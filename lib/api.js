/* // /lib/api.js
export async function getExpedientes() {
  let res = await fetch("/api/expedientes", { cache: "no-store" });

  if (res.status === 401) {
    console.warn("Token expirado, intentando refrescar...");

    const refresh = await fetch("/api/auth/refresh");
    if (refresh.ok) {
      console.log("Token renovado, repitiendo solicitud...");
      res = await fetch("/api/expedientes", { cache: "no-store" });
    } else {
      throw new Error("No se pudo refrescar el token");
    }
  }

  if (!res.ok) {
    throw new Error("Error al obtener expedientes");
  }

  return res.json();
} */
export async function getExpedientes() {
  let res = await fetch("/api/expedientes", { cache: "no-store" });

  if (res.status === 401) {
    console.warn("⚠️ Token expirado, intentando refrescar...");

    const refresh = await fetch("/api/auth/refresh");
    if (refresh.ok) {
      console.log("✅ Token renovado, repitiendo solicitud...");
      res = await fetch("/api/expedientes", { cache: "no-store" });
    } else {
      console.error("❌ No se pudo refrescar el token.");
      throw new Error("Debe iniciar sesión nuevamente.");
    }
  }

  if (!res.ok) {
    throw new Error("Error al obtener expedientes");
  }

  return res.json();
}
