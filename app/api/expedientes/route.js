import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("access_token")?.value;

  console.log("Token leído desde cookie:", token);

  if (!token) {
    return Response.json(
      { error: "No se encontró el token en la cookie" },
      { status: 401 }
    );
  }

  // Armamos el body (urlencoded)
  const body = new URLSearchParams({
    fechaDesde: "01/10/2025",
    fechaHasta: "02/10/2025",
    misCausas: "false",
    anioCausa: "2025",
  });

  try {
    const response = await fetch(
      "https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getExpedientes?pagina=1&tamanio=10",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: body.toString(),
      }
    );

    // Si la API devuelve 204 o vacío
    if (response.status === 204) {
      return Response.json({ expedientes: [] });
    }

    const text = await response.text();

    // Verificamos si la respuesta tiene contenido válido
    if (!text) {
      return Response.json({ error: "Respuesta vacía del servidor externo" }, { status: 502 });
    }

    const data = JSON.parse(text);
    return Response.json(data);

  } catch (error) {
    console.error("Error al obtener expedientes:", error);
    return Response.json(
      { error: "Error al comunicarse con el servicio de expedientes" },
      { status: 500 }
    );
  }
}

