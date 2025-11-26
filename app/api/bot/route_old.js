// app/api/bot/route.js
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Token no provisto o inválido" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1]; // 🔹 JWT que vino del front

    const body = await req.json();
    const mensaje = body.mensaje;

    if (!mensaje) {
      return new Response(
        JSON.stringify({ error: "Falta el mensaje a enviar" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Ejemplo: llamada a la API de Botmaker
    // (acá deberías reemplazar `BOTMAKER_API_URL` y `BOTMAKER_API_KEY` por tus datos)
    const BOTMAKER_API_URL = "https://api.botmaker.com/v2/messages";
    const BOTMAKER_API_KEY = process.env.BOTMAKER_API_KEY;

    const resBot = await fetch(BOTMAKER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BOTMAKER_API_KEY}`, // tu API key de Botmaker
      },
      body: JSON.stringify({
        platform: "whatsapp",
        message: mensaje,
        chatChannelNumber: "549261XXXXXXX", // el número del bot o del usuario según tu caso
        extra: {
          jwt_token: token, // 👈 le pasás tu JWT al bot por si tu backend lo necesita
        },
      }),
    });

    const dataBot = await resBot.json();

    return new Response(JSON.stringify(dataBot), {
      status: resBot.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en /api/bot:", error);
    return new Response(
      JSON.stringify({ error: "Error al enviar mensaje al bot" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

