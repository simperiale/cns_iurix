# Cómo Obtener el Refresh Token para Automatizar la Autenticación

## 🎯 Objetivo

Obtener un `refresh_token` que podamos usar para obtener `access_token` automáticamente sin necesidad de que el usuario se loguee cada vez.

## 📋 Pasos para Obtener el Refresh Token

### Opción 1: Desde las Cookies del Navegador (Más Fácil)

1. **Inicia sesión manualmente en tu aplicación:**
   - Ve a: `http://localhost:3000`
   - Haz clic en "Iniciar sesión"
   - Completa el login con tus credenciales

2. **Abre las herramientas de desarrollador:**
   - Presiona `F12` o clic derecho → "Inspeccionar"
   - Ve a la pestaña **"Application"** (Chrome) o **"Almacenamiento"** (Firefox)

3. **Busca las cookies:**
   - En el panel izquierdo, expande **"Cookies"**
   - Selecciona `http://localhost:3000`
   - Busca la cookie llamada **`refresh_token`**

4. **Copia el valor:**
   - Haz clic en la cookie `refresh_token`
   - Copia el **"Value"** completo (es un string largo)

5. **Agrega a tu `.env`:**
   ```env
   BOT_REFRESH_TOKEN=el_valor_que_copiaste_aqui
   ```

6. **Reinicia el servidor:**
   ```bash
   # Detén el servidor (Ctrl+C) y vuelve a iniciarlo
   npm run dev
   ```

### Opción 2: Desde la Consola del Navegador

1. **Inicia sesión manualmente** (igual que Opción 1)

2. **Abre la consola del navegador:**
   - Presiona `F12`
   - Ve a la pestaña **"Console"**

3. **Ejecuta este código:**
   ```javascript
   document.cookie.split('; ').find(row => row.startsWith('refresh_token='))?.split('=')[1]
   ```

4. **Copia el resultado** y agrégalo a `.env` como `BOT_REFRESH_TOKEN`

### Opción 3: Desde el Código (Temporal)

Puedes agregar temporalmente este código en `app/api/auth/callback/route.js` para ver el refresh token:

```javascript
// Después de obtener el token (línea ~50)
console.log("🔑 REFRESH TOKEN (copia este valor):", refreshToken);
console.log("Agrégalo a .env como: BOT_REFRESH_TOKEN=" + refreshToken);
```

Luego:
1. Haz login manualmente
2. Revisa los logs del servidor
3. Copia el refresh token que aparece
4. Agrégalo a `.env`
5. **Elimina el código temporal** (por seguridad)

## ✅ Verificar que Funciona

Después de agregar el `BOT_REFRESH_TOKEN` a `.env`:

1. **Reinicia el servidor**

2. **Prueba el endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/bot/webhook \
     -H "Content-Type: application/json" \
     -d '{"query": "12345"}'
   ```

3. **Deberías ver en los logs:**
   ```
   🔄 Token expirado, refrescando...
   ✅ Token guardado en caché
   ```

## 🔄 Cómo Funciona

1. **Primera vez:** Usa el `BOT_REFRESH_TOKEN` de `.env` para obtener un `access_token`
2. **Guarda en caché:** El token se guarda en `.token-cache.json` con su `refresh_token`
3. **Renovación automática:** Cuando el token expira, usa el `refresh_token` guardado para obtener uno nuevo
4. **Sin interacción:** No necesitas volver a loguearte manualmente

## ⚠️ Importantenpm run dev
- **No compartas el refresh token** - es como una contraseña

## 🛡️ Seguridad

- El archivo `.token-cache.json` se crea automáticamente
- **Agrégalo a `.gitignore`** para no subirlo al repositorio:
  ```
  .token-cache.json
  ```

## 📝 Archivo .env Completo

Tu `.env` debería tener:

```env
# Credenciales (aunque no se usen directamente, las mantenemos por si acaso)
BOT_USERNAME=tu_usuario
BOT_PASSWORD=tu_contraseña
BOT_CLIENT_ID=app_mobile

# Refresh token para automatización (OBLIGATORIO)
BOT_REFRESH_TOKEN=tu_refresh_token_aqui
```

## 🆘 Si el Refresh Token Expira

Si después de 30 días el refresh token expira:

1. **Obtén uno nuevo** siguiendo los pasos de arriba
2. **Actualiza** `BOT_REFRESH_TOKEN` en `.env`npm run dev
3. **O elimina** `.token-cache.json` para forzar una nueva inicialización

## ✅ Ventajas de Esta Solución

- ✅ **Completamente automático** después de la configuración inicial
- ✅ **No requiere acceso a Keycloak**
- ✅ **No requiere habilitar grant types adicionales**
- ✅ **Renovación automática** de tokens
- ✅ **Funciona con las mismas credenciales** que usas manualmente

