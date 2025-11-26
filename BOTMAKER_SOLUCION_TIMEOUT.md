# Solución: Timeout de 90 Segundos y Variable No Se Muestra

## 🔴 Problemas Identificados

1. **Timeout de 90 segundos:** El código tarda demasiado o no termina correctamente
2. **Variable no se muestra:** `${respuesta}` está vacía en el bloque "Mensaje de Texto"

---

## 🔍 Diagnóstico: Ver Contenido de Variables

### Paso 1: Agregar Bloque de Debug Temporal

Para ver qué contiene `${respuesta}`, agrega un bloque de debug:

1. **Después del bloque "Acción de Código"**, agrega un bloque **"Respuesta del Bot" → "Mensaje de Texto"**
2. **Escribe este mensaje de prueba:**
   ```
   DEBUG - Variables disponibles:
   
   respuesta = "${respuesta}"
   respuesta_expediente = "${respuesta_expediente}"
   resultado_consulta = "${resultado_consulta}"
   
   Tipo de respuesta: ${typeof respuesta}
   Longitud: ${respuesta.length}
   ```
3. **Ejecuta el flujo** y verifica qué aparece

### Paso 2: Interpretar el Resultado

- **Si aparece el contenido:** La variable está guardada, el problema puede ser formato
- **Si aparece vacío:** La variable no se está guardando
- **Si aparece `${respuesta}` literal:** La sintaxis no es correcta, prueba `{{respuesta}}`

---DEBUG - Variables disponibles:
   
   respuesta = "${respuesta}"
   respuesta_expediente = "${respuesta_expediente}"
   resultado_consulta = "${resultado_consulta}"
   
   Tipo de respuesta: ${typeof respuesta}
   Longitud: ${respuesta.length}

## ⏱️ Solución al Timeout de 90 Segundos

El timeout sugiere que el código está tardando mucho. Posibles causas:
DEBUG - Variables disponibles:
   
   respuesta = "${respuesta}"
   respuesta_expediente = "${respuesta_expediente}"
   resultado_consulta = "${resultado_consulta}"
   
   Tipo de respuesta: ${typeof respuesta}
   Longitud: ${respuesta.length}
### Causa 1: El Fetch Tarda Demasiado

**Solución:** Agregar timeout al fetch y verificar que ngrok esté funcionando

### Causa 2: La Promesa No Se Resuelve

El problema es que usamos `.then()` que es asíncrono. Botmaker puede estar esperando que el código termine síncronamente.

**Solución:** Necesitamos asegurar que el código "termine" antes del timeout.

---

## 🔧 Código Mejorado (Para Reducir Timeout)

El código actual ya tiene logs detallados. Revisa los logs y busca:

1. **¿Cuánto tarda el fetch?**
   ```
   DEBUG - Fetch completado en Xms
   ```
   Si tarda más de 30 segundos, el problema está en la conexión o en tu API.

2. **¿Se guardan las variables?**
   ```
   ✅ Variables guardadas con bot.setVariable
   ```
   Si no ves esto, las variables no se están guardando.

3. **¿Qué muestra la verificación?**
   ```
   🔍 Verificación - respuesta: ...
   ```
   Esto te dirá si la variable se guardó correctamente.

---

## 📋 Checklist de Debugging

### Verificar en los Logs:

- [ ] ¿Ves `✅ Variables guardadas`?
- [ ] ¿Ves `🔍 Verificación - respuesta: ...` con contenido?
- [ ] ¿Cuánto tarda el fetch? (busca `Fetch completado en Xms`)
- [ ] ¿Hay algún error antes del timeout?

### Verificar en Botmaker:

- [ ] Agregaste bloque de debug para ver variables
- [ ] Probaste con `${respuesta}` y `{{respuesta}}`
- [ ] Verificaste que el bloque "Mensaje de Texto" esté después de la acción de código

---

## 💡 Solución Rápida: Bloque de Debug

**Agrega este bloque temporalmente** para ver qué está pasando:

**Bloque: "Respuesta del Bot" → "Mensaje de Texto"**
```
🔍 DEBUG:

respuesta existe: ${respuesta ? "SÍ" : "NO"}
respuesta contenido: "${respuesta}"
respuesta tipo: ${typeof respuesta}

Todas las variables:
- respuesta: "${respuesta}"
- respuesta_expediente: "${respuesta_expediente}"
```

Esto te mostrará exactamente qué contiene cada variable.

---

## 🆘 Si el Timeout Persiste

El timeout puede ser porque:

1. **El fetch tarda mucho:** Verifica que ngrok esté funcionando y que tu API responda rápido
2. **Botmaker espera que el código termine:** Como usamos `.then()`, el código "termina" inmediatamente pero la promesa sigue ejecutándose

**Solución temporal:** Agregar un pequeño delay o asegurar que todo se ejecute antes de que Botmaker considere que el código terminó.

---

## 📊 Logs que Deberías Ver (En Orden)

```
[Consultar Expediente] ========== EJECUTANDO ACCIÓN ==========
[Consultar Expediente] ========== INICIANDO CONSULTA ==========
[Consultar Expediente] ✅ Número de expediente encontrado: 165818
[Consultar Expediente] 🔄 Iniciando llamada a API: ...
[Consultar Expediente] DEBUG - Fetch completado en Xms
[Consultar Expediente] ✅ Respuesta recibida exitosamente
[Consultar Expediente] ✅ main() completado exitosamente
[Consultar Expediente] 🔍 DEBUG - Intentando guardar variables...
[Consultar Expediente] ✅ Variables guardadas con bot.setVariable
[Consultar Expediente] 🔍 Verificación - respuesta: 📄 Expediente encontrado... ✅
[Consultar Expediente] ========== FIN DE .then() ==========
```

**Si NO ves "Variables guardadas" o "Verificación", hay un problema.**

---

## ✅ Próximos Pasos

1. **Ejecuta el flujo** y copia TODOS los logs
2. **Agrega el bloque de debug** para ver variables
3. **Comparte los logs** para identificar el problema exacto

Con esa información podré darte una solución específica.

