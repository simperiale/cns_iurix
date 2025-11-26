# Manejo de ngrok: ¿Cuándo necesitas reiniciarlo?

## 🔄 Escenarios

### ✅ Escenario 1: Solo reinicias la app (npm run dev)

**NO necesitas reiniciar ngrok**

- ngrok sigue corriendo en otra terminal/ventana
- La URL de ngrok **se mantiene igual**
- Solo reinicia la app: `npm run dev`
- **No necesitas cambiar nada en Botmaker**

### ⚠️ Escenario 2: Cierras ngrok y lo vuelves a abrir

**SÍ necesitas actualizar la URL en Botmaker**

- ngrok genera una **nueva URL** cada vez que lo inicias
- Debes actualizar la URL en:
  1. El código de Botmaker (`BOTMAKER_ACCION_USUARIO.js`)
  2. La variable `API_URL`

### 🔴 Escenario 3: Cierras todo (app + ngrok)

**SÍ necesitas reiniciar ambos y actualizar la URL**

1. Reinicia ngrok: `ngrok http 3000`
2. Copia la nueva URL
3. Actualiza `API_URL` en el código de Botmaker
4. Reinicia la app: `npm run dev`

---

## 💡 Soluciones para Evitar Cambiar la URL

### Opción 1: Mantener ngrok Corriendo (Recomendado)

**Deja ngrok corriendo en una terminal separada:**

```bash
# Terminal 1: ngrok (déjalo corriendo)
ngrok http 3000

# Terminal 2: tu app (reiníciala cuando quieras)
npm run dev
```

**Ventajas:**
- ✅ La URL se mantiene igual
- ✅ No necesitas actualizar Botmaker
- ✅ Más simple

**Desventajas:**
- ⚠️ ngrok debe estar corriendo siempre

### Opción 2: ngrok con URL Fija (Cuenta de Pago)

Si tienes cuenta de pago de ngrok, puedes configurar una URL fija:

```bash
ngrok http 3000 --domain=tu-dominio-fijo.ngrok-free.app
```

**Ventajas:**
- ✅ URL siempre igual
- ✅ No necesitas actualizar Botmaker

**Desventajas:**
- ⚠️ Requiere cuenta de pago de ngrok

### Opción 3: Usar Variables de Entorno

Puedes configurar la URL de ngrok en una variable de entorno:

1. **En tu `.env`:**
   ```env
   NGROK_URL=https://tu-url-ngrok.ngrok-free.app
   ```

2. **En el código de Botmaker, usa:**
   ```javascript
   const API_URL = process.env.NGROK_URL || "https://tu-dominio.com/api/bot/webhook";
   ```

   **Nota:** Esto solo funciona si el código se ejecuta en tu servidor. Para Botmaker, necesitas actualizar manualmente.

### Opción 4: Script de Inicio Automático

Crea un script que inicie ambos:

**`start-dev.sh`:**
```bash
#!/bin/bash
# Inicia ngrok en background
ngrok http 3000 > /dev/null 2>&1 &
NGROK_PID=$!

# Espera un momento para que ngrok inicie
sleep 2

# Obtiene la URL de ngrok
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok-free\.app' | head -1)

echo "✅ ngrok iniciado: $NGROK_URL"
echo "📝 Actualiza esta URL en Botmaker: $NGROK_URL/api/bot/webhook"

# Inicia la app
npm run dev

# Cuando termines, mata ngrok
kill $NGROK_PID
```

**Uso:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 📋 Checklist: ¿Qué hacer cuando reinicias?

### Si solo reinicias la app:
- [ ] ngrok sigue corriendo
- [ ] Reinicia app: `npm run dev`
- [ ] ✅ **No necesitas cambiar nada**

### Si reinicias ngrok:
- [ ] Inicia ngrok: `ngrok http 3000`
- [ ] Copia la nueva URL (ej: `https://abc123.ngrok-free.app`)
- [ ] Actualiza en Botmaker: `API_URL = "https://abc123.ngrok-free.app/api/bot/webhook"`
- [ ] Reinicia app: `npm run dev`

---

## 🔍 Cómo Verificar la URL Actual de ngrok

Si ngrok está corriendo, puedes ver la URL en:

1. **Interfaz web de ngrok:**
   - Abre en el navegador: `http://localhost:4040`
   - Verás la URL actual

2. **Desde la terminal:**
   ```bash
   curl http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok-free\.app'
   ```

3. **Desde la salida de ngrok:**
   - La URL aparece cuando inicias ngrok:
   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
   ```

---

## 💡 Recomendación

**Para desarrollo:**
- Deja ngrok corriendo en una terminal separada
- Solo reinicia la app cuando necesites
- Actualiza la URL en Botmaker solo cuando reinicies ngrok

**Para producción:**
- Usa un dominio real (no ngrok)
- O usa ngrok con cuenta de pago y URL fija
- Configura la URL una vez y no la cambies

---

## 🆘 Si Olvidaste la URL Actual

1. **Si ngrok está corriendo:**
   - Abre: `http://localhost:4040`
   - O ejecuta: `curl http://localhost:4040/api/tunnels`

2. **Si ngrok NO está corriendo:**
   - Inicia ngrok: `ngrok http 3000`
   - Copia la nueva URL
   - Actualiza en Botmaker

---

## 📝 Resumen Rápido

| Acción | ¿Reiniciar ngrok? | ¿Actualizar Botmaker? |
|--------|-------------------|----------------------|
| Solo reiniciar app | ❌ No | ❌ No |
| Reiniciar ngrok | ✅ Sí | ✅ Sí |
| Reiniciar todo | ✅ Sí | ✅ Sí |
| ngrok con URL fija | ✅ Sí (pero URL igual) | ❌ No |

