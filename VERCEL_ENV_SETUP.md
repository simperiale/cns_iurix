# Configuración de Variables de Entorno en Vercel

## Variables Necesarias

Para que la autenticación funcione correctamente en producción, necesitas configurar las siguientes variables de entorno en Vercel:

### Variables Requeridas

1. **NEXT_PUBLIC_BASE_URL** (Recomendado)
   - Valor: `https://cns-iurix.vercel.app`
   - Descripción: URL base de tu aplicación en producción
   - Nota: Si no se configura, se usará automáticamente `VERCEL_URL` que Vercel proporciona automáticamente

### Variables Opcionales (si las necesitas)

Si en el futuro quieres usar variables de entorno para otros valores:

- `NEXT_PUBLIC_KEYCLOAK_URL`: URL de Keycloak (actualmente hardcodeado)
- `NEXT_PUBLIC_CLIENT_ID`: Client ID de Keycloak (actualmente hardcodeado como "app_mobile")
- `NEXT_PUBLIC_SCOPE`: Scope de OAuth (actualmente hardcodeado)

## Cómo Configurar en Vercel

1. **Ve a tu proyecto en Vercel:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto `cns-iurix`

2. **Ve a Settings → Environment Variables**

3. **Agrega la variable:**
   - **Name:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://cns-iurix.vercel.app`
   - **Environment:** Selecciona todas (Production, Preview, Development) o solo Production

4. **Guarda los cambios**

5. **Redeploy la aplicación:**
   - Ve a la pestaña "Deployments"
   - Haz clic en los tres puntos del último deployment
   - Selecciona "Redeploy"

## Nota Importante

- **VERCEL_URL**: Vercel proporciona automáticamente esta variable, pero puede incluir el dominio de preview (ej: `cns-iurix-abc123.vercel.app`). Si quieres usar siempre tu dominio personalizado, configura `NEXT_PUBLIC_BASE_URL`.

- **Redirect URI en Keycloak**: Asegúrate de que en la configuración del cliente `app_mobile` en Keycloak, esté registrado el redirect URI:
  - `https://cns-iurix.vercel.app/api/auth/callback`
  - También puedes agregar: `https://*.vercel.app/api/auth/callback` para permitir todos los previews

## Verificación

Después de configurar y redeployar, verifica que:
1. El login redirige correctamente a Keycloak
2. El callback funciona y no muestra el error "Missing code or verifier"
3. Las cookies se guardan correctamente (verifica en DevTools → Application → Cookies)

