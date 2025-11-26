# Cómo Usar la Variable en el Mensaje de Texto

## 📋 Pasos para Configurar el Mensaje

### Paso 1: Agregar el Bloque

1. En Botmaker, después del bloque "Acción de Código"
2. Agrega: **"Respuesta del Bot"** → **"Mensaje de Texto"**

### Paso 2: Insertar la Variable

Hay **dos formas** de insertar la variable en el campo de mensaje:

#### Opción A: Escribir Manualmente (Más Común)

En el campo de **"Mensaje de Texto"**, escribe:

```
${respuesta_expediente}
```

**Importante:** 
- Usa el símbolo de dólar `$` seguido de llaves `{}`
- El nombre de la variable es exactamente: `respuesta_expediente` (sin espacios, minúsculas)

#### Opción B: Usar el Selector de Variables (Si está disponible)

1. En el campo de mensaje, busca un botón o icono que diga:
   - **"Variables"** o **"Insert Variable"** o **"{}"**
2. Haz clic en él
3. Selecciona la variable: `respuesta_expediente`
4. Se insertará automáticamente

---

## 📝 Ejemplos de Mensajes

### Ejemplo 1: Solo la Variable (Recomendado)

```
${respuesta_expediente}
```

Esto mostrará directamente la respuesta formateada:
```
📄 *Expediente encontrado*

*Carátula:* Ejemplo vs Ejemplo
*CUij:* 12345
*Año:* 2024
*Juzgado:* Juzgado X
```

### Ejemplo 2: Con Texto Adicional

```
Consulta completada:

${respuesta_expediente}
```

### Ejemplo 3: Con Saludo

```
Hola! Aquí está el resultado de tu consulta:

${respuesta_expediente}

¿Necesitas consultar otro expediente?
```

---

## 🔍 Verificar que la Variable Existe

### Antes de Configurar el Mensaje:

1. **Ejecuta el flujo** hasta el bloque de acción de código
2. **Revisa los logs** - deberías ver:
   ```
   ✅ Variables guardadas: resultado_consulta y respuesta_expediente
   ```

3. **En Botmaker, revisa las variables de la conversación:**
   - Ve a la sección de **"Variables"** o **"Debug"**
   - Deberías ver: `respuesta_expediente` con el valor del mensaje

---

## ⚠️ Si la Variable No Aparece

### Problema: La variable no se guarda

**Solución:** Revisa los logs de la acción de código:
- Si ves: `❌ Error al guardar variables` → Hay un problema con `bot.setVariable`
- Si ves: `✅ Variables guardadas` → La variable debería estar disponible

### Problema: La variable aparece vacía

**Solución:** 
- Verifica que el código se ejecute completamen${respuesta_expediente}te
- Revisa que `resultado.reply` tenga contenido en los logs

### Problema: Error de sintaxis en el mensaje

**Solución:**
- Verifica que uses `${respuesta_expediente}` (con `$` y `{}`)
- Algunas versiones de Botmaker usan `{{respuesta_expediente}}` (doble llave)
- Prueba ambas sintaxis si una no funciona

---

## 🧪 Cómo Probar

1. **Configura el mensaje** con `${respuesta_expediente}`
2. **Guarda el flujo**
3. **Ejecuta el flujo completo:**
   - Ingresa un número de expediente
   - El bloque de acción de código se ejecuta
   - El bloque "Mensaje de Texto" debería mostrar la respuesta

---

## 📊 Sintaxis de Variables en Botmaker

Dependiendo de la versión de Botmaker, puede usar:

| Versión | Sintaxis |
|---------|----------|
| Moderna | `${variable}` |
| Antigua | `{{variable}}` |
| Alternativa | `$variable` |

**Prueba primero:** `${respuesta_expediente}` (la más común)

---

## 💡 Tip: Mensaje con Formato

Si quieres agregar formato al mensaje:

```
📋 *Resultado de la Consulta*

${respuesta_expediente}

---
¿Necesitas otra consulta?
```

---

## ✅ Checklist

- [ ] Agregué bloque "Respuesta del Bot" → "Mensaje de Texto"
- [ ] Escribí `${respuesta_expediente}` en el campo de mensaje
- [ ] Verifiqué que la variable se guarda (revisé logs)
- [ ] Probé el flujo completo
- [ ] El usuario ve la respuesta correctamente

---

## 🆘 Si No Funciona

### Probar Sintaxis Alternativa

Si `${respuesta_expediente}` no funciona, prueba:

1. `{{respuesta_expediente}}` (doble llave)
2. `$respuesta_expediente` (sin llaves)
3. `respuesta_expediente` (sin símbolos - algunas versiones)

### Usar la Variable Completa

Si `respuesta_expediente` no funciona, prueba con:

```
${resultado_consulta.reply}
```

Esto accede al campo `reply` del objeto completo guardado en `resultado_consulta`.

---

## 📝 Ejemplo Completo del Flujo

```
1. Usuario escribe número en formulario
   ↓
2. Bloque: Guardar en variable
   - Variable: nro_expediente = "12345"
   ↓
3. Bloque: Acción de Código "Consultar Expediente"
   - Ejecuta código
   - Guarda: respuesta_expediente = "📄 Expediente encontrado..."
   ↓
4. Bloque: Respuesta del Bot → Mensaje de Texto
   - Mensaje: ${respuesta_expediente}
   ↓
5. Usuario ve: "📄 Expediente encontrado..."
```

---

## 🎯 Resumen

**En el campo "Mensaje de Texto", escribe:**

```
${respuesta_expediente}
```

Eso es todo. La variable se reemplazará automáticamente con el contenido cuando el flujo se ejecute.

