// app/api/bot/webhook/route.js
// Webhook para Botmaker - formatea la respuesta para el bot
import { getServiceToken } from "@/lib/auth-refresh";

export async function POST(req) {
  try {
    const body = await req.json();
    // Botmaker puede enviar el número de expediente en diferentes campos
    const numeroExpediente = body.query || body.numeroExpediente || body.expediente || body.numero;
    // Año de causa (opcional)
    const anioCausa = body.anioCausa || body.anio || "";

    if (!numeroExpediente) {
      return Response.json({ 
        reply: "❌ Por favor, proporciona un número de expediente para consultar." 
      }, { status: 400 });
    }

    // 1️⃣ Obtener token de autenticación usando credenciales de servicio
    let token;
    try {
      token = await getServiceToken();
    } catch (authError) {
      console.error("❌ Error de autenticación:", authError);
      return Response.json({ 
        reply: "❌ Error de autenticación. No se pudo consultar el expediente." 
      }, { status: 401 });
    }

    // 2️⃣ Consultar la API de expedientes
    // Construir parámetros correctamente (solo agregar si tienen valor)
    const bodyParams = new URLSearchParams({
      fechaDesde: "",
      fechaHasta: "",
      misCausas: "false",
    });
    
    // Agregar numeroExpediente solo si tiene valor
    if (numeroExpediente) {
      bodyParams.append("numeroExpediente", numeroExpediente);
    }
    
    // Agregar anioCausa solo si tiene valor (no enviar string vacío)
    if (anioCausa && anioCausa.trim() !== "") {
      bodyParams.append("anioCausa", anioCausa);
    }

    console.log("🔍 Parámetros de búsqueda:", {
      numeroExpediente,
      anioCausa: anioCausa || "(no proporcionado)",
      bodyParams: bodyParams.toString()
    });

    const expedienteUrl = "https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getExpedientes?pagina=1&tamanio=10";
    
    const expedienteRes = await fetch(expedienteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: bodyParams.toString(),
    });

    if (expedienteRes.status === 204) {
      return Response.json({ 
        reply: `❌ No se encontró ningún expediente con el número: ${numeroExpediente}` 
      });
    }

    const text = await expedienteRes.text();
    if (!text) {
      return Response.json({ 
        reply: "❌ Error: No se recibió respuesta del servidor." 
      }, { status: 502 });
    }

    const expData = JSON.parse(text);

    if (!expedienteRes.ok) {
      return Response.json({ 
        reply: `❌ Error al consultar: ${expData.error || "Error desconocido"}` 
      }, { status: expedienteRes.status });
    }

    const expedientes = expData.expedientes || [];

    if (expedientes.length === 0) {
      return Response.json({ 
        reply: `❌ No se encontró ningún expediente con el número: ${numeroExpediente}${anioCausa ? ` del año ${anioCausa}` : ""}` 
      });
    }

    // 3️⃣ Filtrar resultados para asegurar que coincidan con los parámetros
    let expedientesFiltrados = expedientes;
    
    // Filtrar por número de expediente (comparación más estricta)
    if (numeroExpediente) {
      const numExpBuscado = numeroExpediente.toString().trim();
      expedientesFiltrados = expedientesFiltrados.filter(exp => {
        // Buscar en diferentes campos que pueden contener el número
        const numExp = (exp.numeroExp || "").toString().trim();
        const cuijExp = (exp.cuijExp || "").toString().trim();
        
        // Comparación exacta o que termine/empiece con el número buscado
        return numExp === numExpBuscado || 
               cuijExp === numExpBuscado ||
               numExp.endsWith(numExpBuscado) ||
               cuijExp.endsWith(numExpBuscado) ||
               numExp.startsWith(numExpBuscado) ||
               cuijExp.startsWith(numExpBuscado);
      });
      
      console.log(`🔍 Filtrado por número: ${expedientes.length} → ${expedientesFiltrados.length} expedientes`);
    }
    
    // Filtrar por año si fue proporcionado (comparación exacta)
    if (anioCausa && anioCausa.trim() !== "") {
      const anioBuscado = anioCausa.toString().trim();
      const antesFiltro = expedientesFiltrados.length;
      expedientesFiltrados = expedientesFiltrados.filter(exp => {
        const anioExp = (exp.anioExp || "").toString().trim();
        return anioExp === anioBuscado;
      });
      
      console.log(`🔍 Filtrado por año ${anioBuscado}: ${antesFiltro} → ${expedientesFiltrados.length} expedientes`);
    }

    if (expedientesFiltrados.length === 0) {
      return Response.json({ 
        reply: `❌ No se encontró ningún expediente con el número: ${numeroExpediente}${anioCausa ? ` del año ${anioCausa}` : ""}` 
      });
    }

    // 3️⃣ Formatear respuesta para el bot
    const exp = expedientesFiltrados[0];
    let reply = `📄 *Expediente encontrado*\n\n`;
    reply += `*Carátula:* ${exp.caratulaExp || "N/A"}\n`;
    reply += `*CUij:* ${exp.cuijExp || "N/A"}\n`;
    reply += `*Año:* ${exp.anioExp || "N/A"}\n`;
    reply += `*Juzgado:* ${exp.juzgadoExp || "N/A"}\n`;
    
    if (exp.numeroExp) {
      reply += `*Número:* ${exp.numeroExp}\n`;
    }
    if (exp.fechaInicio) {
      reply += `*Fecha de inicio:* ${exp.fechaInicio}\n`;
    }

    if (expedientesFiltrados.length > 1) {
      reply += `\n⚠️ Se encontraron ${expedientesFiltrados.length} expedientes que coinciden. Mostrando el primero.`;
    } else if (expedientes.length > expedientesFiltrados.length) {
      reply += `\nℹ️ Se encontraron ${expedientes.length} expedientes en total, ${expedientesFiltrados.length} coinciden con los filtros aplicados.`;
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return Response.json({ 
      reply: "❌ Error interno. Por favor, intenta nuevamente más tarde." 
    }, { status: 500 });
  }
}
