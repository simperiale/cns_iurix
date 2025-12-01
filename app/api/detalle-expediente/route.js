import { cookies } from "next/headers";

export async function POST(req) {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No se encontró el token en la cookie" }, { status: 401 });
  }

  try {
    const bodyData = await req.json();
    const { cuij } = bodyData;

    if (!cuij) {
      return Response.json({ error: "El campo cuij es requerido" }, { status: 400 });
    }

    // Construir URL
    const url = "https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getFicha";
    
    // Construir body con el cuij
    const body = new URLSearchParams({
      cuij: cuij,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: body.toString(),
    });

    if (response.status === 204) {
      return Response.json({ error: "No se encontró información para el cuij proporcionado" }, { status: 404 });
    }

    const text = await response.text();
    if (!text) {
      return Response.json({ error: "Respuesta vacía del servidor externo" }, { status: 502 });
    }

    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Error al obtener detalle del expediente:", error);
    return Response.json(
      { error: "Error al comunicarse con el servicio de expedientes" },
      { status: 500 }
    );
  }
}

