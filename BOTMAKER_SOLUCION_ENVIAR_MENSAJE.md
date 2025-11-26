# Solución: El Mensaje No Llega al Usuario

## 🔴 Problema

El log muestra:
```
[Consultar Expediente] ⚠️ bot.sendMessage NO está disponible
```

El proceso es exitoso pero el usuario no recibe la respuesta.

## ✅ Solución: Usar Bloque "Enviar Mensaje" en el Flujo

Como `bot.sendMessage()` no está disponible en tu versión de Botmaker, necesitas usar un bloque en el flujo para mostrar el mensaje.

### Paso 1: Verificar que la Variable se Guarde

El código ahora guarda el resultado en dos variables:
- `resultado_consulta` - El objeto completo (JSON)
- `respuesta_expediente` - Solo el texto del mensaje (más fácil de usar)

Revisa los logs y deberías ver:
```
✅ Variables guardadas: resultado_consulta y respuesta_expediente
```

### Paso 2: Agregar Bloque "Enviar Mensaje" en el Flujo

1. **En Botmaker, edita tu flujo:**
   - Después del bloque de "Acción de Código" (Consultar Expediente)
   - Agrega un nuevo bloque: **"Enviar Mensaje"** o **"Send Message"**

2. **Configura el mensaje:**
   - En el campo de texto del mensaje, usa:
     ```
     ${respuesta_expediente}
     ```
   
   O si prefieres el formato completo:
   ```
     ${resultado_consulta.reply}
     ```

3. **Guarda el flujo**

### Paso 3: Probar

1. Ejecuta el flujo completo
2. Ingresa un número de expediente
3. El bloque "Enviar Mensaje" debería mostrar la respuesta

---

## 🔍 Cómo Verificar que Funciona

### Verificar Variables en Botmaker

1. **Durante la ejecución del flujo:**
   - En Botmaker, ve a la sección de **"Variables"** o **"Debug"**
   - Deberías ver:
     - `resultado_consulta` = `{"reply":"📄 Expediente...", "success":true, ...}`
     - `respuesta_expediente` = `"📄 Expediente encontrado..."`

2. **Si las variables NO aparecen:**
   - Revisa los logs para ver si hay errores al guardar
   - Verifica que el código se ejecute completamente

---

## 📋 Configuración del Bloque "Enviar Mensaje"

### Opción A: Mensaje Simple (Recomendado)

```
${respuesta_expediente}
```

### Opción B: Con Texto Adicional

```
Consulta completada:

${respuesta_expediente}
```

### Opción C: Formato Completo (si necesitas más datos)

```
${resultado_consulta.reply}

Total de expedientes: ${resultado_consulta.total || 0}
```

---

## 🎯 Flujo Completo Configurado

```
Usuario ingresa número
  ↓
Formulario guarda: nro_expediente = "12345"
  ↓
Bloque: Acción de Código "Consultar Expediente"
  - Ejecuta el código
  - Guarda: respuesta_expediente = "📄 Expediente encontrado..."
  ↓
Bloque: "Enviar Mensaje"
  - Mensaje: ${respuesta_expediente}
  ↓
Usuario ve la respuesta
```

---

## ⚠️ Si las Variables No se Guardan

### Verificar Logs

Busca en los logs:
- `✅ Variables guardadas: resultado_consulta y respuesta_expediente`
- Si ves `⚠️ Error al guardar variables`, hay un problema

### Solución Alternativa: Usar Return

Si `bot.setVariable` tampoco funciona, el código ahora también **retorna** el resultado. Algunas versiones de Botmaker pueden usar el valor retornado automáticamente.

---

## 🔄 Código Actualizado

El código ahora:
1. ✅ Intenta múltiples métodos de envío (`sendMessage`, `sendText`, `reply`)
2. ✅ Guarda el resultado en variables (`resultado_consulta` y `respuesta_expediente`)
3. ✅ Retorna el resultado para que Botmaker lo use
4. ✅ Muestra logs detallados para debugging

---

## ✅ Checklist

- [ ] El código se ejecuta exitosamente (ver logs)
- [ ] Las variables se guardan correctamente (ver logs: "✅ Variables guardadas")
- [ ] Agregaste bloque "Enviar Mensaje" después de la acción de código
- [ ] Configuraste el mensaje con: `${respuesta_expediente}`
- [ ] Probaste el flujo completo
- [ ] El usuario ve la respuesta

---

## 💡 Nota Final

**Esta es la solución más confiable** cuando `bot.sendMessage()` no está disponible. El bloque "Enviar Mensaje" en el flujo es la forma estándar de mostrar mensajes en Botmaker y funciona en todas las versiones.

