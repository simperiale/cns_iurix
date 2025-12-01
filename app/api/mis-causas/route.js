import { cookies } from "next/headers";

export async function GET(req) {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No se encontró el token en la cookie" }, { status: 401 });
  }

  // Obtener parámetros de query string
  const { searchParams } = new URL(req.url);
  const pagina = searchParams.get("pagina") || "1";
  const tamanio = searchParams.get("tamanio") || "10";

  try {
    // Construir URL con parámetros de query
    const url = `https://iurix-api-interop.unitech.pjm.gob.ar/app/expedientes/getMisCausas?pagina=${pagina}&tamanio=${tamanio}`;
    
    // Construir body con los parámetros requeridos
    const body = new URLSearchParams({
      misCausas: "true",
      orden: "FECHA",
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
      return Response.json({ expedientes: [] });
    }

    const text = await response.text();
    if (!text) {
      return Response.json({ error: "Respuesta vacía del servidor externo" }, { status: 502 });
    }

    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Error al obtener mis causas:", error);
    return Response.json(
      { error: "Error al comunicarse con el servicio de expedientes" },
      { status: 500 }
    );
  }
}

