# Cómo Debuggear Variables en Botmaker

## 🔍 Problema: La Variable No Se Muestra

Si la variable `${respuesta}` no se muestra en el bloque "Mensaje de Texto", sigue estos pasos para diagnosticar:

---

## 📋 Paso 1: Verificar en los Logs

### Busca estos mensajes en los logs:

✅ **Si ves esto, las variables se guardaron:**
```
✅ Variables guardadas con bot.setVariable:
   - respuesta_expediente: 📄 Expediente encontrado...
   - respuesta: 📄 Expediente encontrado...
```

❌ **Si ves esto, hay un problema:**
```
❌ ERROR: No se pudo guardar ninguna variable
❌ bot.setVariable, user.set y variables NO están disponibles
```

---

## 📋 Paso 2: Verificar el Nombre de la Variable

El código guarda la variable con **dos nombres**:
- `respuesta_expediente` (nombre completo)
- `respuesta` (nombre corto - el que estás usando)

**Verifica en los logs:**
```
✅ Variables guardadas:
   - respuesta_expediente: ...
   - respuesta: ...
```

Si ves ambos, entonces `respuesta` debería estar disponible.

---

## 📋 Paso 3: Verificar en Botmaker

### Opción A: Ver Variables de la Conversación

1. **En Botmaker, durante la ejecución del flujo:**
   - Ve a la sección de **"Variables"** o **"Debug"** o **"Conversation Variables"**
   - Busca la variable `respuesta`
   - Verifica que tenga contenido

### Opción B: Agregar Bloque de Debug Temporal

1. **Agrega un bloque "Mensaje de Texto" temporal** después de la acción de código
2. **Escribe:**
   ```
   Variables disponibles:
   respuesta: ${respuesta}
   respuesta_expediente: ${respuesta_expediente}
   resultado_consulta: ${resultado_consulta}
   ```
3. **Ejecuta el flujo** y verifica qué variables aparecen

---

## 🔧 Soluciones Según el Problema

### Problema 1: La Variable No Se Guarda

**Síntoma:** En los logs ves `❌ ERROR: No se pudo guardar ninguna variable`

**Solución:** El código intenta múltiples métodos. Si todos fallan, puede ser que tu versión de Botmaker use una sintaxis diferente.

**Prueba esto en el código:**
```javascript
// Agregar después de la línea donde se guarda la variable
OUTPUTS.log(`[${NAME_CA}] 🔍 DEBUG - Objetos disponibles:`);
OUTPUTS.log(`[${NAME_CA}] 🔍 - typeof bot: ${typeof bot}`);
OUTPUTS.log(`[${NAME_CA}] 🔍 - typeof user: ${typeof user}`);
OUTPUTS.log(`[${NAME_CA}] 🔍 - typeof variables: ${typeof variables}`);
```

### Problema 2: La Variable Se Guarda Pero No Se Muestra

**Síntoma:** Los logs muestran `✅ Variables guardadas` pero `${respuesta}` está vacía

**Posibles causas:**
1. **Nombre incorrecto:** Verifica que uses exactamente `${respuesta}` (sin espacios, minúsculas)
2. **Sintaxis incorrecta:** Prueba `{{respuesta}}` (doble llave)
3. **Scope de la variable:** La variable puede estar en un scope diferente

**Solución:**
- Prueba con `${respuesta_expediente}` en lugar de `${respuesta}`
- O prueba con `{{respuesta}}` (doble llave)

### Problema 3: Timeout de 90 Segundos

**Síntoma:** `"90 seconds timeout, failing"`

**Causa:** El código está tardando demasiado, probablemente en el `fetch` a tu API.

**Solución:**
1. **Verifica que tu API responda rápido:**
   - Revisa los logs de tu aplicación
   - Verifica que ngrok esté funcionando correctamente
   - Prueba el endpoint directamente con curl

2. **Agrega timeout al fetch:**
   El código ya tiene logs de tiempo, pero puedes agregar un timeout explícito.

---

## 🧪 Test Rápido: Ver Contenido de Variables

### Agregar Bloque de Debug

1. **Después del bloque de acción de código**, agrega un bloque "Mensaje de Texto"
2. **Escribe este mensaje de prueba:**
   ```
   DEBUG - Variables:
   respuesta = "${respuesta}"
   respuesta_expediente = "${respuesta_expediente}"
   resultado_consulta = "${resultado_consulta}"
   ```
3. **Ejecuta el flujo** y verifica qué aparece

### Interpretar el Resultado

- **Si aparece el contenido:** La variable está guardada, el problema es en cómo la usas
- **Si aparece vacío:** La variable no se está guardando correctamente
- **Si aparece `${respuesta}` literal:** La sintaxis de variables no es correcta, prueba `{{respuesta}}`

---

## 📊 Logs Detallados que Deberías Ver

### Logs Exitosos:

```
[Consultar Expediente] ✅ main() completado exitosamente
[Consultar Expediente] DEBUG - resultado: {"reply":"📄 Expediente encontrado...","success":true}
[Consultar Expediente] 🔍 DEBUG - Intentando guardar variables...
[Consultar Expediente] 🔍 DEBUG - resultado.reply: 📄 Expediente encontrado...
[Consultar Expediente] 🔍 DEBUG - bot.setVariable está disponible
[Consultar Expediente] ✅ Variables guardadas con bot.setVariable:
[Consultar Expediente]    - respuesta_expediente: 📄 Expediente encontrado...
[Consultar Expediente]    - respuesta: 📄 Expediente encontrado...
[Consultar Expediente] 🔍 Verificación - respuesta: 📄 Expediente encontrado...
[Consultar Expediente] ========== FIN DE .then() ==========
```

### Si No Ves "Variables guardadas":

El problema está en que `bot.setVariable` no está disponible. Revisa los logs para ver qué objetos están disponibles.

---

## 🔧 Solución Alternativa: Usar Return

Si las variables no se guardan, podemos modificar el código para que retorne el resultado de forma que Botmaker lo capture automáticamente. Pero esto requiere que el código sea síncrono, lo cual es complicado con `.then()`.

---

## ✅ Checklist de Debugging

- [ ] Revisé los logs y veo "✅ Variables guardadas"
- [ ] Verifiqué que el nombre de la variable sea exactamente `respuesta`
- [ ] Probé con `${respuesta}` y `{{respuesta}}`
- [ ] Agregué un bloque de debug para ver qué variables están disponibles
- [ ] Verifiqué que el código se ejecute completamente (no timeout antes)
- [ ] Revisé que ngrok esté funcionando y la API responda rápido

---

## 💡 Próximos Pasos

1. **Ejecuta el flujo** y copia TODOS los logs de la acción de código
2. **Comparte los logs** para que pueda ver exactamente qué está pasando
3. **Especialmente busca:**
   - `✅ Variables guardadas` o `❌ ERROR`
   - `🔍 Verificación - respuesta:`
   - Cualquier mensaje de error

Con esos logs podré identificar exactamente dónde está el problema.


