# Cómo Verificar que ${respuesta} Tiene el Valor Correcto

## 🔍 Cómo Saber que `${respuesta}` = `resultado.reply`

### Método 1: Revisar los Logs (Más Fácil)

Después de ejecutar el flujo, busca en los logs:

```
[Consultar Expediente] 📋 VERIFICACIÓN - Contenido guardado en variable 'respuesta':
[Consultar Expediente] 📄 *Expediente encontrado*
[Consultar Expediente] *Carátula:* Ejemplo vs Ejemplo
[Consultar Expediente] 📏 Longitud total: 150 caracteres
[Consultar Expediente] ✅ La variable 'respuesta' en Botmaker debería contener exactamente esto
```

**Esto te muestra exactamente qué se guardó en la variable `respuesta`.**

---

### Método 2: Bloque de Debug en Botmaker

Agrega un bloque "Mensaje de Texto" temporal después de la acción de código:

```
🔍 VERIFICACIÓN:

Contenido de respuesta:
"${respuesta}"

Longitud: ${respuesta.length}
Tipo: ${typeof respuesta}
```

**Esto te mostrará:**
- El contenido completo de `${respuesta}`
- Si está vacía o tiene contenido
- Su longitud y tipo

---

### Método 3: Comparar Manualmente

1. **En los logs**, copia el contenido que aparece después de:
   ```
   📋 VERIFICACIÓN - Contenido guardado en variable 'respuesta':
   ```

2. **En Botmaker**, agrega un bloque "Mensaje de Texto" con:
   ```
   ${respuesta}
   ```

3. **Compara:** El contenido debería ser **exactamente igual**

---

## 📊 Flujo de Verificación

```
Código ejecuta:
  resultado.reply = "📄 Expediente encontrado..."
  ↓
Código guarda:
  bot.setVariable('respuesta', resultado.reply)
  ↓
Logs muestran:
  📋 VERIFICACIÓN - Contenido guardado: "📄 Expediente encontrado..."
  ↓
Botmaker tiene:
  respuesta = "📄 Expediente encontrado..."
  ↓
Bloque "Mensaje de Texto" muestra:
  ${respuesta} → "📄 Expediente encontrado..."
```

---

## ✅ Verificación Paso a Paso

### Paso 1: Ejecutar el Flujo

1. Ejecuta el flujo completo
2. Ingresa un número de expediente
3. Espera a que termine

### Paso 2: Revisar Logs

Busca estos mensajes en orden:

1. ✅ `✅ Variables guardadas: respuesta, respuesta_expediente, resultado_consulta`
2. ✅ `📋 VERIFICACIÓN - Contenido guardado en variable 'respuesta':`
3. ✅ `📄 *Expediente encontrado*...` (el contenido completo)
4. ✅ `📏 Longitud total: X caracteres`

### Paso 3: Verificar en Botmaker

Agrega un bloque de debug:

**Bloque: "Mensaje de Texto"**
```
VERIFICACIÓN:

respuesta = "${respuesta}"

¿Coincide con los logs? ✅/❌
```

---

## 🔍 Qué Buscar en los Logs

### Si TODO está bien:

```
✅ Variables guardadas: respuesta, respuesta_expediente, resultado_consulta
📋 VERIFICACIÓN - Contenido guardado en variable 'respuesta':
📄 *Expediente encontrado*

*Carátula:* Ejemplo vs Ejemplo
*CUij:* 165818
...
📏 Longitud total: 150 caracteres
✅ La variable 'respuesta' en Botmaker debería contener exactamente esto
✅ Proceso completado - Variables guardadas
```

**Entonces:** `${respuesta}` en Botmaker tiene **exactamente** ese contenido.

### Si hay problema:

```
❌ ERROR: No se pudo guardar variables
```

**Entonces:** La variable NO se guardó, `${respuesta}` estará vacía.

---

## 🧪 Test Rápido

### Test 1: Verificar que se Guarda

**En los logs, busca:**
```
✅ Variables guardadas
📋 VERIFICACIÓN - Contenido guardado
```

Si ves ambos, la variable se guardó correctamente.

### Test 2: Verificar el Contenido

**Agrega bloque de debug:**
```
DEBUG:
"${respuesta}"
```

**Compara con los logs:**
- Si coincide → ✅ Todo bien
- Si está vacío → ❌ No se guardó
- Si es diferente → ❌ Hay un problema

---

## 💡 Resumen

**Para verificar que `${respuesta}` = `resultado.reply`:**

1. **Revisa los logs** - Verás exactamente qué se guardó
2. **Agrega bloque de debug** - Verás qué contiene `${respuesta}`
3. **Compara ambos** - Deben ser iguales

**El código ahora muestra en los logs:**
- ✅ Qué se guardó en la variable
- ✅ La longitud del contenido
- ✅ Confirmación de que se guardó correctamente

Con esto puedes verificar que todo funciona correctamente.


