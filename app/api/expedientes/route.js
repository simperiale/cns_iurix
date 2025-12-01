import { cookies } from "next/headers";

export async function POST(req) {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No se encontró el token en la cookie" }, { status: 401 });
  }

  const bodyData = await req.json();
  const {
    fechaDesde = "",
    fechaHasta = "",
    numeroExpediente = "",
    cuij = "",
    anioCausa = "",
    caratulaExpediente = "",
    misCausas = false,
  } = bodyData;

  const body = new URLSearchParams({
    fechaDesde,
    fechaHasta,
    misCausas: misCausas ? "true" : "false",
    anioCausa,
  });

  if (numeroExpediente) body.append("numeroExpediente", numeroExpediente);
  if (cuij) body.append("cuij", cuij);
  if (caratulaExpediente) body.append("caratulaExpediente", caratulaExpediente);

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
