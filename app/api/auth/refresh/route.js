import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    console.error("❌ No se encontró el refresh_token en las cookies");
    return new Response(JSON.stringify({ error: "No hay refresh token" }), {
      status: 401,
    });
  }

  const tokenUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token";
  const clientId = "app_mobile";

  // Pedimos un nuevo access_token usando el refresh_token
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error al refrescar token:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 401,
      });
    }

    console.log("🔄 Token renovado correctamente:", data);

    // Guardamos nuevamente los tokens
    const oneHour = 60 * 60; // 1 hora
    const thirtyDays = 60 * 60 * 24 * 30;

    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${oneHour}`
    );

    if (data.refresh_token) {
      headers.append(
        "Set-Cookie",
        `refresh_token=${data.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${thirtyDays}`
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("💥 Error inesperado al refrescar el token:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}

