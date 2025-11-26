# Flujo Completo: Botmaker → cns_iurix → API de Expedientes

## 🔄 Flujo Completo de la Integración

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. BOTMAKER (BOTMAKER_ACCION_USUARIO.js)                        │
│    - Usuario ingresa número de expediente en formulario         │
│    - Se guarda en variable: nro_expediente                     │
│    - Bloque ejecuta acción de código                            │
│    - Código lee: params.nro_expediente o bot.getVariable()     │
│    - Llama a: https://tu-dominio.com/api/bot/webhook            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. TU APLICACIÓN cns_iurix                                      │
│    Endpoint: /api/bot/webhook (route.js)                        │
│                                                                  │
│    a) Recibe: { query: "12345" }                                │
│    b) Llama a: getServiceToken()                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. AUTENTICACIÓN (lib/auth.js)                                  │
│    Función: getServiceToken()                                   │
│                                                                  │
│    a) Lee credenciales de .env:                                 │
│       - BOT_USERNAME                                            │
│       - BOT_PASSWORD                                            │
│       - BOT_CLIENT_ID (opcional, default: "app_mobile")        │
│                                                                  │
│    b) Llama a Keycloak:                                         │
│       POST https://auth.pjm.gob.ar/auth/realms/IOL/.../token   │
│       Body: grant_type=password, username, password, etc.      │
│                                                                  │
│    c) Retorna: access_token                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. CONSULTA EXPEDIENTES (app/api/bot/webhook/route.js)          │
│                                                                  │
│    a) Usa el token obtenido                                     │
│    b) Llama a API externa:                                      │
│       POST https://iurix-api-interop.unitech.pjm.gob.ar/...     │
│       Headers: Authorization: Bearer {token}                   │
│       Body: numeroExpediente=12345                              │
│                                                                  │
│    c) Recibe datos del expediente                               │
│    d) Formatea respuesta para el bot                            │
│    e) Retorna: { reply: "📄 Expediente encontrado..." }         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. RESPUESTA A BOTMAKER                                         │
│    - Botmaker recibe: { reply: "..." }                          │
│    - Código envía: bot.sendMessage(resultado.reply)            │
│    - Usuario ve el mensaje formateado                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Archivos Involucrados

### 1. Botmaker
- **`BOTMAKER_ACCION_USUARIO.js`**
  - Se ejecuta en Botmaker
  - Lee el número de expediente
  - Llama a tu endpoint `/api/bot/webhook`

### 2. Tu Aplicación cns_iurix

#### **`app/api/bot/webhook/route.js`**
- Recibe la petición de Botmaker
- Obtiene el token llamando a `getServiceToken()`
- Consulta la API de expedientes con el token
- Formatea y retorna la respuesta

#### **`lib/auth.js`**
- Función `getServiceToken()`
- Lee credenciales de variables de entorno (`.env`)
- Autentica con Keycloak usando grant type "password"
- Retorna el `access_token`

---

## ✅ Confirmación: Todo Está Conectado

### Sí, el código tiene la conexión completa:

1. ✅ **Botmaker** → Llama a tu aplicación
2. ✅ **Tu aplicación** → Obtiene token con credenciales (`lib/auth.js`)
3. ✅ **Tu aplicación** → Consulta expedientes con el token
4. ✅ **Tu aplicación** → Retorna respuesta formateada
5. ✅ **Botmaker** → Muestra respuesta al usuario

---

## 🔐 Credenciales Necesarias

Para que funcione, necesitas tener en tu archivo `.env`:

```env
BOT_USERNAME=tu_usuario
BOT_PASSWORD=tu_contraseña
BOT_CLIENT_ID=app_mobile  # Opcional
```

Estas credenciales se usan en `lib/auth.js` para obtener el token de Keycloak.

---

## 🧪 Cómo Verificar que Todo Funciona

### Paso 1: Verificar Variables de Entorno
```bash
# Verifica que exista el archivo .env con las credenciales
cat .env
```

### Paso 2: Probar el Endpoint Directamente
```bash
curl -X POST http://localhost:3000/api/bot/webhook \
  -H "Content-Type: application/json" \
  -d '{"query": "12345"}'
```

Deberías recibir:
```json
{
  "reply": "📄 *Expediente encontrado*\n\n..."
}
```

### Paso 3: Verificar Logs
Revisa los logs del servidor para ver:
- ✅ "Token obtenido correctamente"
- ✅ "Consultando expediente: 12345"
- ✅ "Respuesta recibida exitosamente"

---

## 🔍 Puntos Clave del Flujo

### 1. Autenticación Automática
- No necesitas cookies de sesión
- Usa credenciales de servicio desde `.env`
- Obtiene un nuevo token en cada consulta

### 2. Seguridad
- Las credenciales están en `.env` (no en el código)
- El token se obtiene dinámicamente
- No se almacena el token (se obtiene cuando se necesita)

### 3. Formato de Respuesta
- La respuesta está formateada para WhatsApp/Mensajería
- Usa Markdown para formato (`*texto*` = negrita)
- Incluye emojis para mejor UX

---

## ⚠️ Si Algo No Funciona

### Error: "Credenciales de servicio no configuradas"
- **Solución:** Verifica que el archivo `.env` exista y tenga `BOT_USERNAME` y `BOT_PASSWORD`
- Reinicia el servidor después de agregar/modificar `.env`

### Error: "Error de autenticación"
- **Solución:** Verifica que las credenciales sean correctas
- Verifica que el usuario tenga permisos en Keycloak

### Error: "No se encontró el expediente"
- **Solución:** Verifica que el número de expediente sea correcto
- Verifica que el usuario tenga permisos para consultar ese expediente

---

## 📊 Resumen

| Componente | Función | Archivo |
|-----------|---------|---------|
| Botmaker | Ejecuta código, llama a tu API | `BOTMAKER_ACCION_USUARIO.js` |
| Webhook | Recibe petición, coordina flujo | `app/api/bot/webhook/route.js` |
| Autenticación | Obtiene token con credenciales | `lib/auth.js` |
| Consulta | Consulta API de expedientes | `app/api/bot/webhook/route.js` |
| Respuesta | Formatea y retorna resultado | `app/api/bot/webhook/route.js` |

**Todo está conectado y funcionando correctamente.** ✅

