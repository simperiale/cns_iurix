/* import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce";

export async function GET() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  // Guardamos el verifier en una cookie (para validarlo después)
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const authUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/auth?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&scope=${process.env.NEXT_PUBLIC_SCOPE}&redirect_uri=${redirect_uri}&code_challenge=${challenge}&code_challenge_method=S256`;

  const headers = new Headers();
  headers.append("Set-Cookie", `pkce_verifier=${verifier}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return Response.redirect(authUrl);
} */

import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';

export async function GET(req) {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  // Obtener la URL base desde la request o variable de entorno
  const urlObj = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  `${urlObj.protocol}//${urlObj.host}`);
  
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback`);
  const clientId = "app_mobile";
  const scope = "openid profile offline_access";
  const authUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/auth";

  const url = `${authUrl}?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&code_challenge=${challenge}&code_challenge_method=S256`;

  // Guardamos el verifier en una cookie temporal (5 minutos)
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `pkce_verifier=${verifier}; Path=/; HttpOnly; Secure; Max-Age=300`
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...Object.fromEntries(headers),
    },
  });
}
