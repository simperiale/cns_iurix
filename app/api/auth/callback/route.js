import { cookies } from "next/headers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const verifier = cookies().get("pkce_verifier")?.value;

  if (!code || !verifier) {
    return new Response(JSON.stringify({ error: "Missing code or verifier" }), {
      status: 400,
    });
  }

  // Obtener la URL base desde la request o variable de entorno
  const urlObj = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  `${urlObj.protocol}//${urlObj.host}`);
  
  // Datos del proveedor
  const tokenUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token";
  const clientId = "app_mobile";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  // Enviamos el intercambio de código por token
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("❌ Error en el intercambio:", tokenData);
      return new Response(JSON.stringify({ error: tokenData }), {
        status: tokenResponse.status,
      });
    }

    console.log("✅ Token recibido:", tokenData);

    // ⚠️ Verificá que tokenData incluya refresh_token
    // Si no aparece, Keycloak debe habilitar el "offline_access" o "refresh token" en el cliente

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Guardamos ambos tokens en cookies seguras
    const cookieStore = cookies();
    const oneHour = 60 * 60; // 1 hora
    const thirtyDays = 60 * 60 * 24 * 30;

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: oneHour,
    });

    if (refreshToken) {
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: thirtyDays,
      });
    }

    // Redirigimos al home
    const headers = new Headers();
    headers.append("Location", "/");
    //localStorage.setItem("jwt_token", accessToken);
    return new Response(null, { status: 302, headers });
  } catch (error) {
    console.error("Error al intercambiar el token:", error);
    return new Response(JSON.stringify({ error: "Token exchange failed" }), {
      status: 500,
    });
  }
}

