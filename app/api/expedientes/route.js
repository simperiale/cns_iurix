import { cookies } from "next/headers";

export async function POST(req) {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No se encontró el token en la cookie" }, { status: 401 });
  }

  const bodyData = await req.json();
  // Mapear campos del formulario a los nombres que espera la API
  const {
    fechaDesde = "",        // del formulario -> presentadoDesde en API
    fechaHasta = "",        // del formulario -> presentadoHasta en API
    numeroExpediente = "",  // del formulario -> numero en API
    cuij = "",              // del formulario -> cuij en API (igual)
    anioCausa = "",         // del formulario -> anio en API
    caratulaExpediente = "", // del formulario -> caratula en API
    misCausas = "false",      // del formulario -> MisCausas en API
  } = bodyData;

  // Construir el body con los nombres que espera la API
  // Solo enviar campos que tengan valor (no vacíos, no null, no undefined)
  const body = new URLSearchParams();
  
  // Helper para verificar si un campo tiene valor
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== "" && String(value).trim() !== "";
  };
  
  // Solo agregar campos que tengan valor
  if (hasValue(fechaDesde)) body.append("presentadoDesde", fechaDesde.trim());
  if (hasValue(fechaHasta)) body.append("presentadoHasta", fechaHasta.trim());
  if (hasValue(anioCausa)) body.append("anio", anioCausa.toString().trim());
  if (hasValue(numeroExpediente)) body.append("numero", numeroExpediente);
  if (hasValue(cuij)) body.append("cuij", cuij.trim());
  if (hasValue(caratulaExpediente)) body.append("caratula", caratulaExpediente.toUpperCase());
  
  // MisCausas siempre se envía (aunque sea false)
  body.append("misCausas", misCausas === "true" ? "true" : "false");  
  console.log("🔍 Parámetros enviados a la API:", body.toString());

  try {
    const response = await fetch(
      "https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getListadoExpedientes?pagina=1&tamanio=10",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: body.toString(),
      }
    );

   
    if (response.status === 204) {
      return Response.json({ expedientes: [] });
    }

    const text = await response.text();
    
    if (!text || text.trim() === "") {
      return Response.json({ 
        error: `Respuesta vacía del servidor externo (Status: ${response.status})` 
      }, { status: 502 });
    }

    try {
      const data = JSON.parse(text);
      return Response.json(data);
    } catch (parseError) {
      return Response.json({ 
        error: `Error al procesar la respuesta del servidor: ${parseError.message}` 
      }, { status: 502 });
    }
  } catch (error) {
    return Response.json(
      { error: `Error al comunicarse con el servicio de expedientes: ${error.message}` },
      { status: 500 }
    );
  }
}
