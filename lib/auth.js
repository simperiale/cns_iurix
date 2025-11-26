// lib/auth.js
// Función helper para obtener token de autenticación usando credenciales de servicio
// Útil para llamadas desde Botmaker u otros servicios externos

export async function getServiceToken() {
  const tokenUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token";
  const clientId = process.env.BOT_CLIENT_ID || "app_mobile";
  
  // Credenciales de servicio desde variables de entorno
  const username = process.env.BOT_USERNAME;
  const password = process.env.BOT_PASSWORD;
  const clientSecret = process.env.BOT_CLIENT_SECRET; // Opcional, para client_credentials

  if (!username || !password) {
    throw new Error("Credenciales de servicio no configuradas. Configure BOT_USERNAME y BOT_PASSWORD en las variables de entorno.");
  }

  // Intentar primero con grant type "password"
  // Si falla, puede ser que el cliente no tenga habilitado este grant type en Keycloak
  let body = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    username: username,
    password: password,
    scope: "openid profile offline_access",
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Token obtenido con grant type 'password'");
      return data.access_token;
    }

    // Si falla con "password", intentar con "client_credentials" si hay client_secret
    if (data.error === "invalid_grant" && clientSecret) {
      console.log("⚠️ Grant type 'password' no disponible, intentando 'client_credentials'...");
      
      body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "openid profile offline_access",
      });

      const response2 = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data2 = await response2.json();

      if (response2.ok) {
        console.log("✅ Token obtenido con grant type 'client_credentials'");
        return data2.access_token;
      }
    }

    // Si ambos fallan, mostrar error detallado
    console.error("❌ Error al obtener token de servicio:", data);
    throw new Error(
      `Error de autenticación: ${data.error_description || data.error || "Unknown error"}\n\n` +
      `NOTA: El grant type "password" puede no estar habilitado para el cliente "${clientId}" en Keycloak.\n` +
      `Opciones:\n` +
      `1. Habilitar "Direct Access Grants" en la configuración del cliente en Keycloak\n` +
      `2. Usar un cliente diferente que tenga habilitado el grant type "password"\n` +
      `3. Configurar BOT_CLIENT_SECRET y usar grant type "client_credentials"`
    );
  } catch (error) {
    console.error("💥 Error inesperado al obtener token de servicio:", error);
    throw error;
  }
}

