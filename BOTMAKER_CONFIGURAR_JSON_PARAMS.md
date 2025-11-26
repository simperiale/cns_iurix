# Cómo Configurar el JSON Params en Botmaker

## ✅ Formato Correcto del JSON

Cuando Botmaker te pide un **"JSON params"**, debes usar el formato JSON estándar:

### ❌ INCORRECTO (esto NO es JSON válido):
```
nro_expediente = ${nro_expediente}
```

### ✅ CORRECTO (formato JSON):
```json
{
  "nro_expediente": "${nro_expediente}"
}
```

---

## 📝 Instrucciones Paso a Paso

### Paso 1: En el Bloque de Acción de Código

1. Selecciona la acción: "Consultar Expediente"
2. Busca el campo: **"JSON params"** o **"Parámetros JSON"**
3. Ingresa el siguiente JSON:

```json
{
  "nro_expediente": "${nro_expediente}"
}
```

### Paso 2: Verificar el Formato

Asegúrate de que:
- ✅ Tiene llaves `{ }` al inicio y final
- ✅ El nombre de la propiedad está entre comillas: `"nro_expediente"`
- ✅ El valor usa la variable de Botmaker: `"${nro_expediente}"`
- ✅ Hay dos puntos `:` entre la propiedad y el valor
- ✅ Hay una coma `,` si hay más propiedades

### Paso 3: Ejemplo Completo

Si tienes múltiples parámetros (aunque en tu caso solo necesitas uno):

```json
{
  "nro_expediente": "${nro_expediente}",
  "otro_parametro": "${otra_variable}"
}
```

---

## 🔍 Cómo Funciona

1. **Botmaker reemplaza** `${nro_expediente}` con el valor real de la variable
2. **Pasa los parámetros** al código de la acción
3. **El código lee** desde `params.nro_expediente`

---

## 📋 Ejemplos de Formato

### Ejemplo 1: Un solo parámetro (tu caso)
```json
{
  "nro_expediente": "${nro_expediente}"
}
```

### Ejemplo 2: Con nombre alternativo
```json
{
  "numeroExpediente": "${nro_expediente}"
}
```

### Ejemplo 3: Múltiples parámetros
```json
{
  "nro_expediente": "${nro_expediente}",
  "usuario": "${usuario}",
  "fecha": "${fecha}"
}
```

---

## ⚠️ Errores Comunes

### Error 1: Sin llaves
```
❌ nro_expediente: "${nro_expediente}"
✅ { "nro_expediente": "${nro_expediente}" }
```

### Error 2: Sin comillas en la propiedad
```
❌ { nro_expediente: "${nro_expediente}" }
✅ { "nro_expediente": "${nro_expediente}" }
```

### Error 3: Sin dos puntos
```
❌ { "nro_expediente" "${nro_expediente}" }
✅ { "nro_expediente": "${nro_expediente}" }
```

### Error 4: Variable sin ${}
```
❌ { "nro_expediente": "nro_expediente" }
✅ { "nro_expediente": "${nro_expediente}" }
```

---

## 🧪 Cómo Verificar que Funciona

### Opción 1: Revisar Logs

El código incluye logs. Revisa los logs de la acción en Botmaker y deberías ver:

```
[Consultar Expediente] Número obtenido de params JSON: 12345
```

### Opción 2: Probar el Flujo

1. Ejecuta el flujo completo
2. Ingresa un número de expediente
3. Verifica que el bot responda con los datos

---

## 🔄 Flujo Completo

```
Usuario completa formulario
  ↓
Botmaker guarda: nro_expediente = "12345"
  ↓
Bloque de acción de código:
  - Acción: "Consultar Expediente"
  - JSON params: { "nro_expediente": "${nro_expediente}" }
  ↓
Botmaker reemplaza: { "nro_expediente": "12345" }
  ↓
Código lee: params.nro_expediente = "12345"
  ↓
Código llama a tu API
  ↓
Devuelve respuesta al usuario
```

---

## 💡 Nota Importante

El código está preparado para leer el parámetro desde múltiples fuentes (en orden de prioridad):

1. `params.nro_expediente` ← **Desde JSON params** (tu caso)
2. `bot.getVariable('nro_expediente')` (variables del flujo)
3. `context.nro_expediente` (contexto)
4. `message.text` (extrae del mensaje)
5. `user.get('nro_expediente')` (usuario)

Así que aunque uses JSON params, si por alguna razón no funciona, el código intentará leer desde otras fuentes automáticamente.

---

## ✅ Checklist Final

- [ ] JSON tiene formato correcto con llaves `{ }`
- [ ] Propiedad está entre comillas: `"nro_expediente"`
- [ ] Variable usa formato: `"${nro_expediente}"`
- [ ] Hay dos puntos `:` entre propiedad y valor
- [ ] Probé el flujo y funciona correctamente
- [ ] Revisé los logs para confirmar que lee el parámetro

---

## 🆘 Si No Funciona

### Problema: Error de sintaxis JSON

**Solución:** Usa un validador JSON online para verificar el formato:
- https://jsonlint.com/
- https://jsonformatter.org/

### Problema: El parámetro no llega

**Solución 1:** Verifica que el nombre de la variable sea exactamente `nro_expediente` (sin espacios)

**Solución 2:** Agrega logs temporales en el código:
```javascript
OUTPUTS.log(`[${NAME_CA}] Params recibidos: ${JSON.stringify(params)}`);
```

**Solución 3:** El código también intentará leer desde `bot.getVariable()`, así que debería funcionar de todas formas.



