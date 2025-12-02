// app/api/bot/detalle-ficha/route.js
// Webhook para Botmaker - consulta detalle de expediente por CUIJ
import { getServiceToken } from "@/lib/auth-refresh";

export async function POST(req) {
  try {
    const body = await req.json();
    // Botmaker puede enviar el CUIJ en diferentes campos
    const cuij = body.query || body.cuij || body.cuijExp || body.cui;

    if (!cuij) {
      return Response.json({ 
        reply: "❌ Por favor, proporciona un CUIJ para consultar el detalle del expediente." 
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

    console.log("🔍 Consultando ficha por CUIJ:", cuij);

    // 2️⃣ Consultar la API de ficha del expediente
    const fichaUrl = "https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getFicha";
    
    const bodyParams = new URLSearchParams({
      cuij: cuij,
    });

    const fichaRes = await fetch(fichaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: bodyParams.toString(),
    });

    if (fichaRes.status === 204) {
      return Response.json({ 
        reply: `❌ No se encontró información para el CUIJ: ${cuij}` 
      });
    }

    const text = await fichaRes.text();
    if (!text) {
      return Response.json({ 
        reply: "❌ Error: No se recibió respuesta del servidor." 
      }, { status: 502 });
    }

    const fichaData = JSON.parse(text);

    if (!fichaRes.ok) {
      return Response.json({ 
        reply: `❌ Error al consultar: ${fichaData.error || "Error desconocido"}` 
      }, { status: fichaRes.status });
    }

    // 3️⃣ Formatear respuesta para el bot
    let reply = `📄 *Detalle del Expediente*\n\n`;
    reply += `*CUIJ:* ${fichaData.cuijExp || "N/A"}\n`;
    
    if (fichaData.numeroPreexistente) {
      reply += `*Número Preexistente:* ${fichaData.numeroPreexistente}\n`;
    }
    
    if (fichaData.objetoDeJuicio) {
      reply += `*Objeto de Juicio:* ${fichaData.objetoDeJuicio}\n`;
    }
    
    if (fichaData.fechaDeInicio) {
      reply += `*Fecha de Inicio:* ${fichaData.fechaDeInicio}\n`;
    }
    
    if (fichaData.fechaDePresentacion) {
      reply += `*Fecha de Presentación:* ${fichaData.fechaDePresentacion}\n`;
    }
    
    if (fichaData.fechaUltimoMovimiento) {
      reply += `*Fecha Último Movimiento:* ${fichaData.fechaUltimoMovimiento}\n`;
    }
    
    if (fichaData.organismoDeOrigen) {
      reply += `*Organismo de Origen:* ${fichaData.organismoDeOrigen}\n`;
    }
    
    if (fichaData.organismoDeRadicacionActual) {
      reply += `*Organismo de Radicación Actual:* ${fichaData.organismoDeRadicacionActual}\n`;
    }
    
    if (fichaData.ubicacionActual) {
      reply += `*Ubicación Actual:* ${fichaData.ubicacionActual}\n`;
    }
    
    if (fichaData.tribunalDePrimeraInstancia) {
      reply += `*Tribunal de Primera Instancia:* ${fichaData.tribunalDePrimeraInstancia}\n`;
    }
    
    if (fichaData.tribunalDeSegundaInstancia) {
      reply += `*Tribunal de Segunda Instancia:* ${fichaData.tribunalDeSegundaInstancia}\n`;
    }
    
    reply += `*Sentencia:* ${fichaData.sentencia ? "Sí" : "No"}\n`;
    reply += `*Usuario Vinculado:* ${fichaData.usuarioVinculado ? "Sí" : "No"}\n`;

    return Response.json({ reply });

  } catch (error) {
    console.error("❌ Error en webhook detalle-ficha:", error);
    return Response.json({ 
      reply: "❌ Error interno. Por favor, intenta nuevamente más tarde." 
    }, { status: 500 });
  }
}

