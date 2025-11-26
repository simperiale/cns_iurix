// app/api/auth/token/route.js
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}
