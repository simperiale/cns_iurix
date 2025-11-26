// /api/bot/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Mensaje recibido del bot:", body);
    // Acá generás tu token real
    const token = "TOKEN_GENERADO";
    

    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json({ error: "Error generando token" }, { status: 400 });
  }
}



/* // app/api/bot/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Mensaje recibido del bot:", body);

    // 1️⃣ Extraemos el mensaje y el token
    const mensaje = body.message?.text || "";
    const token = body.extra?.jwt_token; // <-- Botmaker te enviará esto

    if (!token) {
      console.warn("⚠️ No llegó token en el mensaje del bot.");
      return Response.json({ error: "Token no recibido" }, { status: 400 });
    }

    // 2️⃣ Llamamos a tu endpoint interno que consulta expedientes
    const consulta = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expedientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ numeroExpediente: mensaje })
    });

    const resultado = await consulta.json();
    console.log("📦 Respuesta de consulta:", resultado);

    // 3️⃣ Enviamos respuesta al bot
    const respuesta = resultado?.expedientes?.length
      ? `✅ Encontré ${resultado.expedientes.length} expediente(s).`
      : "❌ No se encontró ningún expediente.";

    return Response.json({ reply: respuesta });
  } catch (error) {
    console.error("❌ Error en /api/bot:", error);
    return Response.json({ error: "Error procesando mensaje" }, { status: 500 });
  }
}

 */