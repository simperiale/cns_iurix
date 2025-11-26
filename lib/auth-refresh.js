// lib/auth-refresh.js
// Sistema de autenticación usando refresh token persistente
// Solución para cuando no se puede usar grant type "password"

import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), '.token-cache.json');

// Leer token cacheado del archivo
function readCachedToken() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf8');
      const tokenData = JSON.parse(data);
      
      // Verificar si el token aún es válido (con margen de 5 minutos)
      const expiresAt = tokenData.expires_at || 0;
      const now = Date.now();
      const margin = 5 * 60 * 1000; // 5 minutos en milisegundos
      
      if (expiresAt > (now + margin)) {
        return tokenData.access_token;
      }
      
      // Si expiró, intentar refrescar
      if (tokenData.refresh_token) {
        return null; // Retornar null para que se refresque
      }
    }
  } catch (error) {
    console.error("Error leyendo token cacheado:", error);
  }
  return null;
}

// Guardar token en archivo
function saveCachedToken(tokenData) {
  try {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000 || 3600000); // Default 1 hora
    
    const dataToSave = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      token_type: tokenData.token_type || 'Bearer'
    };
    
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(dataToSave, null, 2));
    console.log("✅ Token guardado en caché");
  } catch (error) {
    console.error("Error guardando token:", error);
  }
}

// Obtener nuevo token usando refresh token
async function refreshAccessToken(refreshToken) {
  const tokenUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token";
  const clientId = process.env.BOT_CLIENT_ID || "app_mobile";

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error al refrescar token:", data);
      throw new Error(`Error al refrescar token: ${data.error_description || data.error}`);
    }

    // Guardar el nuevo token
    saveCachedToken(data);
    return data.access_token;
  } catch (error) {
    console.error("💥 Error inesperado al refrescar token:", error);
    throw error;
  }
}

// Obtener token inicial (requiere interacción manual la primera vez)
async function getInitialToken() {
  const tokenUrl = "https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token";
  const clientId = process.env.BOT_CLIENT_ID || "app_mobile";
  
  // Leer refresh token desde .env (debe ser configurado manualmente la primera vez)
  const refreshToken = process.env.BOT_REFRESH_TOKEN;

  if (refreshToken) {
    console.log("🔄 Usando refresh token de .env para obtener access token inicial...");
    return await refreshAccessToken(refreshToken);
  }

  throw new Error(
    "No hay token cacheado ni refresh token configurado.\n\n" +
    "SOLUCIÓN: Obtén un refresh token manualmente:\n" +
    "1. Haz login manual en tu app (localhost:3000)\n" +
    "2. Abre las cookies del navegador\n" +
    "3. Copia el valor de 'refresh_token'\n" +
    "4. Agrégalo a .env como: BOT_REFRESH_TOKEN=tu_refresh_token_aqui\n" +
    "5. Reinicia el servidor"
  );
}

// Función principal: obtener token (con cache y refresh automático)
export async function getServiceToken() {
  // 1. Intentar leer token cacheado
  const cachedToken = readCachedToken();
  if (cachedToken) {
    console.log("✅ Usando token cacheado");
    return cachedToken;
  }

  // 2. Si no hay token válido, leer refresh token del archivo
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf8');
      const tokenData = JSON.parse(data);
      
      if (tokenData.refresh_token) {
        console.log("🔄 Token expirado, refrescando...");
        return await refreshAccessToken(tokenData.refresh_token);
      }
    }
  } catch (error) {
    console.error("Error leyendo archivo de token:", error);
  }

  // 3. Si no hay refresh token en archivo, intentar desde .env
  console.log("⚠️ No hay token cacheado, intentando obtener token inicial...");
  return await getInitialToken();
}

// Función para inicializar el sistema (obtener refresh token inicial)
export async function initializeTokenSystem() {
  const refreshToken = process.env.BOT_REFRESH_TOKEN;
  
  if (!refreshToken) {
    console.log("⚠️ BOT_REFRESH_TOKEN no configurado en .env");
    return false;
  }

  try {
    const accessToken = await refreshAccessToken(refreshToken);
    console.log("✅ Sistema de tokens inicializado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error inicializando sistema de tokens:", error);
    return false;
  }
}

