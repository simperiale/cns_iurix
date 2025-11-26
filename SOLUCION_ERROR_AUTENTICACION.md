# Solución: Error "Invalid user credentials" al obtener token

## 🔴 Problema

Al ejecutar el bot, obtienes este error:
```
❌ Error al obtener token de servicio: {
  error: 'invalid_grant',
  error_description: 'Invalid user credentials'
}
```

## 🔍 Causa

El grant type **"password"** (Resource Owner Password Credentials) **NO está habilitado** para el cliente `app_mobile` en Keycloak, o las credenciales no son válidas para este grant type.

El flujo manual (`/api/auth/login`) usa **Authorization Code Flow con PKCE**, que es diferente y sí funciona.

## ✅ Soluciones

### Opción 1: Habilitar "Direct Access Grants" en Keycloak (Recomendado)

1. **Accede a Keycloak Admin Console:**
   - Ve a: `https://auth.pjm.gob.ar/auth/admin`
   - Inicia sesión como administrador

2. **Configura el cliente:**
   - Ve a: **Clients** → Busca `app_mobile`
   - En la pestaña **Settings**, busca **"Direct Access Grants Enabled"**
   - **Actívalo** (toggle ON)
   - Guarda los cambios

3. **Verifica las credenciales:**
   - Asegúrate de que `BOT_USERNAME` y `BOT_PASSWORD` en tu `.env` sean correctas
   - Deben ser las mismas credenciales que usas para login manual

### Opción 2: Usar Client Credentials Grant

Si tienes un `client_secret` para el cliente:

1. **Agrega a tu `.env`:**
   ```env
   BOT_CLIENT_SECRET=tu_client_secret_aqui
   ```

2. **El código intentará automáticamente** usar `client_credentials` si `password` falla

### Opción 3: Crear un Cliente Dedicado para Botmaker

1. **En Keycloak, crea un nuevo cliente:**
   - Nombre: `botmaker_service` (o el que prefieras)
   - Client ID: `botmaker_service`
   - **Habilita:** "Direct Access Grants Enabled"
   - **Habilita:** "Service Accounts Enabled" (si quieres usar client_credentials)

2. **Actualiza tu `.env`:**
   ```env
   BOT_CLIENT_ID=botmaker_service
   BOT_USERNAME=tu_usuario
   BOT_PASSWORD=tu_contraseña
   ```

### Opción 4: Usar un Usuario de Servicio

Crea un usuario específico para el servicio (no un usuario personal):

1. **En Keycloak:**
   - Ve a **Users** → **Add user**
   - Crea un usuario: `botmaker_service` (o similar)
   - Configura una contraseña
   - **Importante:** Este usuario debe tener los permisos necesarios

2. **Actualiza tu `.env`:**
   ```env
   BOT_USERNAME=botmaker_service
   BOT_PASSWORD=contraseña_del_usuario_de_servicio
   ```

## 🧪 Cómo Verificar que Funciona

### Paso 1: Verificar Credenciales

Prueba las credenciales directamente con curl:

```bash
curl -X POST https://auth.pjm.gob.ar/auth/realms/IOL/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=app_mobile&username=TU_USUARIO&password=TU_CONTRASEÑA&scope=openid profile offline_access"
```

Si funciona, deberías recibir un `access_token`.

### Paso 2: Verificar Configuración del Cliente

En Keycloak Admin Console:
- Ve a **Clients** → `app_mobile` → **Settings**
- Verifica que **"Direct Access Grants Enabled"** esté **ON**

## 📋 Checklist

- [ ] Verificaste que las credenciales en `.env` son correctas
- [ ] Habilitaste "Direct Access Grants" en Keycloak para el cliente
- [ ] Probaste las credenciales con curl
- [ ] Reiniciaste el servidor después de cambiar `.env`
- [ ] Verificaste que el usuario tiene permisos necesarios

## ⚠️ Nota Importante

**El grant type "password" puede no estar habilitado por seguridad.** Es común que Keycloak lo deshabilite por defecto. Si no puedes habilitarlo, considera:

1. **Usar Authorization Code Flow** (más seguro, pero requiere interacción del usuario)
2. **Usar Client Credentials** (si tienes un client_secret)
3. **Crear un cliente específico** para servicios automatizados

## 🔧 Código Actualizado

El código en `lib/auth.js` ahora:
- ✅ Intenta primero con `password` grant
- ✅ Si falla, intenta con `client_credentials` (si hay `BOT_CLIENT_SECRET`)
- ✅ Muestra mensajes de error más descriptivos
- ✅ Indica qué hacer si falla

## 💡 Recomendación

**La mejor solución es la Opción 1:** Habilitar "Direct Access Grants" en Keycloak para el cliente `app_mobile`. Esto permite usar el grant type "password" con las mismas credenciales que usas para login manual.

