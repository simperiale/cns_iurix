# Integración con Botmaker

Esta guía explica cómo integrar la aplicación con Botmaker para consultar expedientes.

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
BOT_USERNAME=tu_usuario
BOT_PASSWORD=tu_contraseña
BOT_CLIENT_ID=app_mobile  # Opcional, por defecto usa "app_mobile"
```

**Importante:** Estas credenciales deben ser válidas en el sistema Keycloak y tener permisos para consultar expedientes.

### 2. Endpoints Disponibles

#### `/api/bot/expediente` - Endpoint de consulta directa

Este endpoint devuelve los datos en formato JSON, ideal para procesamiento programático.

**Método:** `POST` o `GET`

**Body (POST):**
```json
{
  "numeroExpediente": "12345"
}
```

O también acepta:
- `query`
- `expediente`
- `numero`

**Respuesta exitosa:**
```json
{
  "success": true,
  "expedientes": [
    {
      "caratulaExp": "Ejemplo vs Ejemplo",
      "cuijExp": "12345",
      "anioExp": "2024",
      "juzgadoExp": "Juzgado X",
      "numeroExp": "12345",
      "fechaInicio": "2024-01-01"
    }
  ],
  "total": 1
}
```

**Respuesta de error:**
```json
{
  "error": "Mensaje de error"
}
```

**Ejemplo con GET:**
```
GET /api/bot/expediente?numeroExpediente=12345
```

#### `/api/bot/webhook` - Webhook formateado para Botmaker

Este endpoint devuelve la respuesta formateada para mostrar directamente al usuario del bot.

**Método:** `POST`

**Body:**
```json
{
  "query": "12345"
}
```

O también acepta:
- `numeroExpediente`
- `expediente`
- `numero`

**Respuesta exitosa:**
```json
{
  "reply": "📄 *Expediente encontrado*\n\n*Carátula:* Ejemplo vs Ejemplo\n*CUij:* 12345\n..."
}
```

## Configuración en Botmaker

### Opción 1: Usar Acción de Código tipo "Endpoint" (Recomendado)

Esta es la opción más flexible y recomendada.

#### Pasos:

1. **En Botmaker, ve a:** Chatbots → Código → + Nueva acción de código

2. **Configura la acción:**
   - **Nombre:** "Consultar Expediente" (o el nombre que prefieras)
   - **Tipo:** Selecciona **"Endpoint"**
   - **Plantilla de código:** Usa la plantilla del archivo `BOTMAKER_CODE_TEMPLATE.js`

3. **Personaliza la URL:**
   - Abre el archivo `BOTMAKER_CODE_TEMPLATE.js`
   - Reemplaza `"https://tu-dominio.com"` con tu URL real
   - Si estás en desarrollo local, usa un túnel (ngrok, localtunnel, etc.)

4. **Copia y pega el código completo** en la plantilla de Botmaker

5. **Guarda y publica** la acción

#### Código simplificado (alternativa):

Si prefieres un código más simple, puedes usar esta versión:

```javascript
// URL de tu aplicación (REEMPLAZA con tu dominio real)
const API_URL = "https://tu-dominio.com/api/bot/webhook";

async function main() {
  // Obtener número de expediente (ajusta según cómo Botmaker te lo pase)
  const numeroExpediente = bot.getVariable('numeroExpediente') || 
                          bot.getVariable('query') || 
                          message?.text?.match(/\d+/)?.[0];

  if (!numeroExpediente) {
    return { reply: "❌ Por favor, proporciona un número de expediente." };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: numeroExpediente })
    });

    const data = await response.json();
    return { reply: data.reply || "❌ Error al consultar expediente" };
  } catch (error) {
    return { reply: `❌ Error: ${error.message}` };
  }
}

return main();
```

### Opción 2: Usar WA Flow Endpoint

Si Botmaker tiene una opción específica "WA Flow Endpoint", puedes configurarla así:

1. **URL del Endpoint:**
   ```
   https://tu-dominio.com/api/bot/webhook
   ```

2. **Método:** `POST`

3. **Headers:**
   ```
   Content-Type: application/json
   ```

4. **Body (JSON):**
   ```json
   {
     "query": "{{numeroExpediente}}"
   }
   ```
   O si Botmaker usa otro formato:
   ```json
   {
     "numeroExpediente": "{{numeroExpediente}}"
   }
   ```

### Opción 3: Usar Webhook Directo

1. En Botmaker, configura un **Webhook** apuntando a:
   ```
   https://tu-dominio.com/api/bot/webhook
   ```

2. Método: `POST`

3. Headers:
   ```
   Content-Type: application/json
   ```

4. Body (formato JSON):
   ```json
   {
     "query": "{{numeroExpediente}}"
   }
   ```

5. La respuesta del webhook se enviará directamente al usuario.

## Ejemplo de Flujo en Botmaker

1. **Usuario escribe:** "Consulta expediente 12345"
2. **Botmaker extrae:** El número "12345" del mensaje
3. **Botmaker llama a:** `/api/bot/webhook` con `{ "query": "12345" }`
4. **La aplicación:**
   - Obtiene token de autenticación automáticamente
   - Consulta la API de expedientes
   - Formatea la respuesta
5. **Botmaker recibe:** `{ "reply": "📄 *Expediente encontrado*..." }`
6. **Botmaker envía:** El mensaje formateado al usuario

## Solución de Problemas

### Error: "Credenciales de servicio no configuradas"

- Verifica que el archivo `.env` existe y contiene `BOT_USERNAME` y `BOT_PASSWORD`
- Reinicia el servidor después de agregar/modificar variables de entorno

### Error: "Error de autenticación"

- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el usuario tenga permisos en Keycloak
- Verifica que el `BOT_CLIENT_ID` sea correcto (por defecto: "app_mobile")

### Error: "No se encontró el expediente"

- Verifica que el número de expediente sea correcto
- Asegúrate de que el usuario tenga permisos para consultar ese expediente

### El endpoint no responde

- Verifica que el servidor esté corriendo
- Revisa los logs del servidor para ver errores
- Verifica que la URL del endpoint sea correcta (incluye `https://` si es necesario)

## Notas de Seguridad

- **Nunca** subas el archivo `.env` al repositorio
- Las credenciales deben ser de un usuario de servicio (no un usuario personal)
- Considera usar variables de entorno del servidor en lugar de archivo `.env` en producción
- El endpoint `/api/bot/expediente` puede requerir autenticación adicional (API key) en producción

