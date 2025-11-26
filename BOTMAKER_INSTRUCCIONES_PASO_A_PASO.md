# Instrucciones Paso a Paso para Botmaker

## 📋 Situación Actual

Botmaker te muestra estas opciones:
- ✅ **Endpoint** (con plantilla de código)
- **Activador de notificación a través Hubspot** (no es lo que necesitas)
- **Crear una página HTML** (no es lo que necesitas)

## ✅ SOLUCIÓN: Usar "Endpoint"

### Paso 1: Crear la Acción

1. Ve a: **Chatbots → Código → + Nueva acción de código**
2. **Nombre:** "Consultar Expediente"
3. **Tipo:** Selecciona **"Endpoint"**
4. Botmaker te mostrará un editor de código

### Paso 2: Limpiar el Editor

1. **Borra TODO el código** que Botmaker te muestra por defecto
2. Deja el editor vacío

### Paso 3: Copiar el Código Correcto

**IMPORTANTE:** No puedes subir archivos .js. Debes copiar y pegar.

#### Opción A: Código Completo (Recomendado)

1. Abre el archivo: `BOTMAKER_ENDPOINT_CODE.js`
2. **Copia TODO el código** (Ctrl+A, Ctrl+C)
3. **Reemplaza esta línea ANTES de pegar:**
   ```javascript
   const API_URL = "https://tu-dominio.com/api/bot/webhook";
   ```
   Por tu URL real:
   ```javascript
   const API_URL = "https://tu-app.com/api/bot/webhook";
   ```
4. Pega el código en el editor de Botmaker

#### Opción B: Si la Opción A no funciona

1. Abre el archivo: `BOTMAKER_ENDPOINT_SIMPLE.js`
2. Copia TODO el código
3. Reemplaza la URL como en el paso anterior
4. Pega en Botmaker

### Paso 4: Guardar y Publicar

1. Haz clic en **"Guardar"**
2. Haz clic en **"Publicar"** (si es necesario)

---

## 🔧 Cómo Obtener tu URL

### Si estás en Producción:
```
https://tu-dominio.com/api/bot/webhook
```

### Si estás en Desarrollo Local:

Necesitas exponer tu localhost con un túnel:

#### Opción 1: ngrok (Recomendado)
```bash
# Instala ngrok: https://ngrok.com/
ngrok http 3000
```
Obtendrás una URL como: `https://abc123.ngrok.io`
Entonces tu API_URL será: `https://abc123.ngrok.io/api/bot/webhook`

#### Opción 2: localtunnel
```bash
npm install -g localtunnel
lt --port 3000
```

---

## 🧪 Probar el Endpoint

### Desde el Navegador:
```
https://tu-dominio.com/api/bot/webhook?numeroExpediente=12345
```

### Desde curl:
```bash
curl -X POST https://tu-dominio.com/api/bot/webhook \
  -H "Content-Type: application/json" \
  -d '{"query": "12345"}'
```

### Desde Botmaker:
1. En tu flujo, extrae el número de expediente
2. Llama a la acción "Consultar Expediente"
3. Pasa el número como parámetro

---

## 📝 Formas de Pasar el Número de Expediente

El código acepta el número de expediente de estas formas:

### 1. Query Parameter (GET):
```
https://tu-endpoint?numeroExpediente=12345
```

### 2. Body JSON (POST):
```json
{
  "numeroExpediente": "12345"
}
```

O también:
```json
{
  "query": "12345"
}
```

### 3. Desde Variables de Botmaker:
Si configuras variables en tu flujo, el código las leerá automáticamente.

---

## ❌ NO uses estas opciones:

- ❌ **"Activador de notificación a través Hubspot"** - Es solo para Hubspot
- ❌ **"Crear una página HTML"** - No es lo que necesitas

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'fetch'"
Botmaker puede no tener `fetch` nativo. En ese caso, usa la versión simplificada o agrega:
```javascript
const fetch = require('node-fetch');
```

### Error: "req is not defined"
Asegúrate de usar el código de `BOTMAKER_ENDPOINT_CODE.js` que está adaptado a la estructura de Botmaker.

### No recibe el número de expediente
- Verifica que estés pasando el parámetro correctamente
- Revisa los logs en Botmaker (bmconsole.log)
- Prueba primero con query parameter: `?numeroExpediente=12345`

### Error de conexión
- Verifica que la URL sea correcta (incluye `https://`)
- Verifica que el servidor esté corriendo
- Si usas ngrok, verifica que el túnel esté activo

---

## 📞 Ejemplo de Uso en Flujo de Botmaker

1. **Usuario escribe:** "Consulta expediente 12345"
2. **Botmaker extrae:** "12345" (usando NLP o regex)
3. **Botmaker guarda en variable:** `numeroExpediente = "12345"`
4. **Botmaker llama a:** Tu acción "Consultar Expediente"
5. **La acción:**
   - Lee el número de la variable o parámetro
   - Llama a tu API
   - Devuelve la respuesta
6. **Botmaker muestra:** El resultado al usuario

---

## ✅ Checklist Final

- [ ] Creé la acción de código tipo "Endpoint"
- [ ] Copié el código de `BOTMAKER_ENDPOINT_CODE.js`
- [ ] Reemplacé la URL con mi dominio real
- [ ] Guardé y publiqué la acción
- [ ] Probé el endpoint desde el navegador
- [ ] Configuré el flujo en Botmaker para usar la acción
- [ ] Probé el flujo completo

---

## 📚 Archivos de Referencia

- `BOTMAKER_ENDPOINT_CODE.js` - Código completo (recomendado)
- `BOTMAKER_ENDPOINT_SIMPLE.js` - Versión simplificada
- `BOTMAKER_INTEGRATION.md` - Documentación completa
- `BOTMAKER_GUIA_RAPIDA.md` - Guía rápida

