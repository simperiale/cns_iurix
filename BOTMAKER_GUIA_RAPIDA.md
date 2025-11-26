# Guía Rápida: Configurar Botmaker

## Opciones Disponibles en Botmaker

Tienes estas opciones de acción de código:
- ✅ **Endpoint** (RECOMENDADO) - Te pide una plantilla de código
- **Usuario** - Para código que se ejecuta en contexto de usuario
- **Programable** - Para tareas programadas (cron)
- **WA Flow Endpoint** - Para WhatsApp Flow

---

## ✅ OPCIÓN RECOMENDADA: Endpoint

### Paso 1: Crear la Acción

1. En Botmaker: **Chatbots → Código → + Nueva acción de código**
2. **Nombre:** "Consultar Expediente"
3. **Tipo:** Selecciona **"Endpoint"**
4. Te mostrará un editor de código con una plantilla

### Paso 2: Copiar el Código

**IMPORTANTE:** Botmaker NO permite subir archivos .js directamente. Debes copiar y pegar el código.

Tienes dos opciones:

#### Opción A: Código Completo (Recomendado)

Abre el archivo `BOTMAKER_ENDPOINT_CODE.js` y copia TODO el código.

**Antes de pegar, reemplaza esta línea:**
```javascript
const API_URL = "https://tu-dominio.com/api/bot/webhook";
```

Por tu URL real, por ejemplo:
```javascript
const API_URL = "https://mi-app.herokuapp.com/api/bot/webhook";
```

O si estás en desarrollo local con ngrok:
```javascript
const API_URL = "https://abc123.ngrok.io/api/bot/webhook";
```

#### Opción B: Código Simplificado

Si la versión completa da problemas, usa `BOTMAKER_ENDPOINT_SIMPLE.js` (más simple y compatible).

### Paso 3: Versión Simplificada (si la anterior no funciona)

Si Botmaker tiene una sintaxis diferente, usa esta versión más simple:

```javascript
// REEMPLAZA esta URL con la tuya
const API_URL = "https://tu-dominio.com/api/bot/webhook";

// Obtener número de expediente
let numeroExpediente = null;

// Intentar obtener desde diferentes fuentes
if (typeof bot !== 'undefined') {
  numeroExpediente = bot.getVariable('numeroExpediente') || 
                    bot.getVariable('query');
}

if (!numeroExpediente && typeof message !== 'undefined') {
  const match = message.text.match(/\d+/);
  if (match) numeroExpediente = match[0];
}

if (!numeroExpediente) {
  return { reply: "❌ Por favor, proporciona un número de expediente." };
}

// Llamar a la API
try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: numeroExpediente })
  });
  
  const data = await response.json();
  return { reply: data.reply || "❌ Error al consultar" };
} catch (error) {
  return { reply: `❌ Error: ${error.message}` };
}
```

### Paso 4: Guardar y Publicar

1. Pega el código en la plantilla
2. **Guarda** la acción
3. **Publica** la acción

---

## Opción Alternativa: WA Flow Endpoint

Si prefieres usar "WA Flow Endpoint":

1. **URL:**
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

---

## Cómo Obtener el Número de Expediente

El código intenta obtener el número de expediente de estas fuentes (en orden):

1. **Variable del bot:** `bot.getVariable('numeroExpediente')`
2. **Variable alternativa:** `bot.getVariable('query')`
3. **Del mensaje:** Extrae números del texto del mensaje
4. **Parámetros:** Si se pasan como parámetros

### Configurar en el Flujo de Botmaker

Para que funcione correctamente, en tu flujo de Botmaker:

1. **Extrae el número** del mensaje del usuario (usando NLP o regex)
2. **Guarda en una variable** llamada `numeroExpediente` o `query`
3. **Llama a la acción** de código que creaste

Ejemplo de flujo:
```
Usuario: "Consulta expediente 12345"
  ↓
Botmaker extrae: "12345"
  ↓
Guarda en variable: numeroExpediente = "12345"
  ↓
Ejecuta acción: "Consultar Expediente"
  ↓
Bot responde con los datos del expediente
```

---

## Probar la Configuración

### Opción 1: Probar desde Botmaker

1. En Botmaker, ve a **Probar** o **Test**
2. Escribe un mensaje como: "Consulta expediente 12345"
3. Verifica que el bot responda con los datos del expediente

### Opción 2: Probar el Endpoint Directamente

Usa curl o Postman para probar:

```bash
curl -X POST https://tu-dominio.com/api/bot/webhook \
  -H "Content-Type: application/json" \
  -d '{"query": "12345"}'
```

Deberías recibir:
```json
{
  "reply": "📄 *Expediente encontrado*\n\n*Carátula:* ..."
}
```

---

## Solución de Problemas

### El código no se ejecuta

- Verifica que la sintaxis del código sea correcta
- Algunas versiones de Botmaker requieren `return main();` al final
- Otras requieren solo `main();`

### No encuentra el número de expediente

- Verifica que estés guardando el número en una variable
- Usa `console.log()` para debug (si Botmaker lo permite)
- Ajusta el código para leer de la fuente correcta

### Error de conexión

- Verifica que la URL sea correcta (incluye `https://`)
- Si estás en localhost, usa un túnel (ngrok, localtunnel)
- Verifica que el servidor esté corriendo

### Error de autenticación

- Verifica que el archivo `.env` tenga `BOT_USERNAME` y `BOT_PASSWORD`
- Reinicia el servidor después de cambiar `.env`

---

## Variables de Entorno Necesarias

Asegúrate de tener en tu archivo `.env`:

```env
BOT_USERNAME=tu_usuario
BOT_PASSWORD=tu_contraseña
BOT_CLIENT_ID=app_mobile
```

---

## Notas Importantes

1. **URL en Producción:** Reemplaza `localhost:3000` con tu dominio real
2. **Túnel para Desarrollo:** Usa ngrok o similar para exponer localhost
3. **Seguridad:** Nunca subas el `.env` al repositorio
4. **Credenciales:** Usa un usuario de servicio, no personal

