// app/api/bot/expediente/route.js
// Endpoint para consultar expedientes desde Botmaker
// Recibe: { numeroExpediente: "12345" } o { query: "12345" }
// Devuelve: { expedientes: [...] } o { error: "..." }

import { getServiceToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Aceptamos diferentes formatos que Botmaker pueda enviar
    const numeroExpediente = body.numeroExpediente || body.query || body.expediente || body.numero;

    if (!numeroExpediente) {
      return Response.json(
        { error: "Falta el número de expediente. Envíe 'numeroExpediente', 'query', 'expediente' o 'numero' en el body." },
        { status: 400 }
      );
    }

    // 1️⃣ Obtener token de autenticación usando credenciales de servicio
    let token;
    try {
      token = await getServiceToken();
    } catch (authError) {
      console.error("❌ Error de autenticación:", authError);
      return Response.json(
        { error: "Error de autenticación. Verifique las credenciales de servicio." },
        { status: 401 }
      );
    }

    // 2️⃣ Consultar la API de expedientes
    const bodyParams = new URLSearchParams({
      fechaDesde: "",
      fechaHasta: "",
      misCausas: "false",
      anioCausa: "",
    });
    bodyParams.append("numeroExpediente", numeroExpediente);

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
      return Response.json({ expedientes: [], message: "No se encontraron expedientes." });
    }

    const text = await expedienteRes.text();
    if (!text) {
      return Response.json(
        { error: "Respuesta vacía del servidor externo" },
        { status: 502 }
      );
    }

    const expData = JSON.parse(text);

    if (!expedienteRes.ok) {
      return Response.json(
        { error: expData.error || "Error al consultar expedientes" },
        { status: expedienteRes.status }
      );
    }

    // 3️⃣ Devolver resultado
    return Response.json({
      success: true,
      expedientes: expData.expedientes || [],
      total: expData.total || 0,
    });

  } catch (error) {
    console.error("❌ Error en /api/bot/expediente:", error);
    return Response.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

// También soportamos GET para facilitar pruebas
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const numeroExpediente = searchParams.get("numeroExpediente") || searchParams.get("query");

  if (!numeroExpediente) {
    return Response.json(
      { error: "Falta el número de expediente. Use ?numeroExpediente=12345" },
      { status: 400 }
    );
  }

  // Reutilizamos la lógica de POST
  const mockReq = {
    json: async () => ({ numeroExpediente }),
  };
  return POST(mockReq);
}

