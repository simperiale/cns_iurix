import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  // Borramos la cookie local del token
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  );

  // Construimos la URL de logout de Keycloak
  const logoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout`;

  // Redirigimos al logout remoto (esto invalida la sesión en Keycloak)
  const body = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    // Keycloak puede aceptar opcionalmente el refresh_token
    // refresh_token: tokenData.refresh_token
  });

  await fetch(logoutUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {
    // si falla, simplemente seguimos
  });

  // Redirigimos al inicio
  return new Response(null, {
    status: 302,
    headers: { ...headers, Location: "/" },
  });
}
