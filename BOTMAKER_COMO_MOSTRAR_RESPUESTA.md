# Cómo Mostrar la Respuesta al Usuario en Botmaker

## ❓ Pregunta: ¿El usuario ve el `return resultado`?

**Respuesta corta:** Depende de cómo esté configurado Botmaker, pero el código actual usa **ambos métodos** para asegurar que funcione.

---

## 🔍 Cómo Funciona Actualmente

El código actual hace **dos cosas** para asegurar que el usuario vea la respuesta:

### 1. Envía el Mensaje Explícitamente (Líneas 154-158)
```javascript
if (resultado && resultado.reply) {
  if (typeof bot !== 'undefined' && bot.sendMessage) {
    bot.sendMessage(resultado.reply);  // ← Envía directamente al usuario
  }
}
```

### 2. Retorna el Resultado (Línea 167)
```javascript
return resultado;  // ← Permite que Botmaker o el flujo lo use
```

---

## ✅ Sí, el Usuario Verá la Respuesta

**El usuario SÍ verá la respuesta** porque:

1. **`bot.sendMessage(resultado.reply)`** envía el mensaje directamente al usuario
2. **`return resultado`** permite que:
   - Botmaker muestre automáticamente el `reply` (en algunas versiones)
   - El flujo continúe y use el resultado en bloques siguientes
   - Se pueda acceder al resultado desde otros bloques

---

## 📋 Formato del Resultado

El código retorna un objeto con esta estructura:

```javascript
{
  reply: "📄 *Expediente encontrado*\n\n*Carátula:* ...",  // ← Esto se muestra al usuario
  success: true,
  expedientes: [...],
  data: {...}
}
```

**La propiedad `reply`** es la que contiene el mensaje que verá el usuario.

---

## 🎯 Diferentes Formas de Mostrar la Respuesta

### Opción 1: Envío Automático (Actual - Recomendado)

El código envía automáticamente con `bot.sendMessage()`:
```javascript
bot.sendMessage(resultado.reply);  // Usuario ve el mensaje inmediatamente
return resultado;  // También retorna para uso del flujo
```

**Ventaja:** El usuario siempre ve la respuesta, sin configuración adicional.

### Opción 2: Solo Retornar (Requiere Configuración)

Si solo retornas el resultado:
```javascript
return { reply: "Mensaje aquí" };
```

**Requiere:**
- Que Botmaker esté configurado para mostrar automáticamente el `reply`
- O que el siguiente bloque del flujo muestre el resultado

### Opción 3: Usar Bloque de Mensaje en el Flujo

Puedes:
1. Retornar el resultado sin enviar mensaje
2. En el siguiente bloque del flujo, usar un bloque "Enviar Mensaje"
3. Mostrar: `${resultado_consulta.reply}` o similar

---

## 🔧 Configuración en el Flujo de Botmaker

### Si el Mensaje NO Aparece Automáticamente:

1. **Verifica que `bot.sendMessage()` esté disponible:**
   - Revisa los logs para ver si hay errores
   - Algunas versiones de Botmaker usan otro método

2. **Agrega un bloque "Enviar Mensaje" después de la acción:**
   - En el flujo, después del bloque de acción de código
   - Agrega un bloque "Enviar Mensaje"
   - Usa la variable: `${resultado_consulta.reply}`

3. **Verifica el formato del mensaje:**
   - El mensaje usa Markdown (`*texto*` para negrita)
   - Algunos canales (WhatsApp) pueden requerir formato diferente

---

## 🧪 Cómo Probar

### Paso 1: Ejecutar el Flujo
1. Ejecuta el flujo completo
2. Ingresa un número de expediente
3. Verifica si aparece el mensaje

### Paso 2: Revisar Logs
Revisa los logs de la acción y deberías ver:
```
[Consultar Expediente] Respuesta recibida exitosamente
```

### Paso 3: Verificar Variables
Si el mensaje no aparece, verifica que la variable `resultado_consulta` se haya guardado:
- En Botmaker, revisa las variables de la conversación
- Debería existir: `resultado_consulta` con el JSON del resultado

---

## ⚠️ Si el Usuario NO Ve la Respuesta

### Solución 1: Verificar que `bot.sendMessage` Funcione

Agrega logs temporales:
```javascript
if (typeof bot !== 'undefined' && bot.sendMessage) {
  OUTPUTS.log(`[${NAME_CA}] Enviando mensaje: ${resultado.reply}`);
  bot.sendMessage(resultado.reply);
} else {
  OUTPUTS.log(`[${NAME_CA}] ERROR: bot.sendMessage no está disponible`);
}
```

### Solución 2: Usar Bloque de Mensaje en el Flujo

1. **Modifica el código** para NO enviar el mensaje automáticamente:
   ```javascript
   // Comentar esta línea:
   // bot.sendMessage(resultado.reply);
   ```

2. **En el flujo de Botmaker:**
   - Después del bloque de acción de código
   - Agrega un bloque "Enviar Mensaje"
   - Configura el mensaje para mostrar: `${resultado_consulta.reply}`

### Solución 3: Retornar Solo el Texto

Si Botmaker muestra automáticamente el valor retornado:
```javascript
// En lugar de retornar el objeto completo:
return resultado.reply;  // Retorna solo el texto del mensaje
```

---

## 📊 Resumen

| Método | ¿Usuario Ve la Respuesta? | Requiere Configuración |
|--------|---------------------------|------------------------|
| `bot.sendMessage()` | ✅ **SÍ** (actual) | ❌ No |
| `return { reply: "..." }` | ⚠️ Depende de Botmaker | ✅ Puede requerir |
| Bloque "Enviar Mensaje" | ✅ **SÍ** | ✅ Sí, en el flujo |

**El código actual usa el método más confiable** (`bot.sendMessage()`), así que el usuario debería ver la respuesta automáticamente.

---

## ✅ Checklist

- [ ] El código incluye `bot.sendMessage(resultado.reply)`
- [ ] El resultado tiene la propiedad `reply`
- [ ] Probé el flujo y el usuario ve el mensaje
- [ ] Si no funciona, revisé los logs
- [ ] Si no funciona, agregué un bloque "Enviar Mensaje" en el flujo

---

## 💡 Recomendación Final

**El código actual está bien configurado.** El usuario debería ver la respuesta porque:

1. ✅ Usa `bot.sendMessage()` para enviar directamente
2. ✅ Retorna el resultado para uso del flujo
3. ✅ Guarda el resultado en una variable por si acaso

Si por alguna razón no funciona, usa la **Solución 2** (bloque "Enviar Mensaje" en el flujo).

