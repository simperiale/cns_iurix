# Solución: Usar Acción Tipo "Usuario" en lugar de "Endpoint"

## 🔴 Problema

Botmaker **NO permite configurar parámetros** en acciones de código tipo "Endpoint".

## ✅ Solución: Usar Tipo "Usuario"

Las acciones tipo **"Usuario"** tienen acceso directo a las variables del flujo sin necesidad de configurar parámetros.

---

## 📋 Pasos para Configurar

### Paso 1: Crear Nueva Acción de Código

1. En Botmaker: **Chatbots → Código → + Nueva acción de código**
2. **Nombre:** "Consultar Expediente"
3. **Tipo:** Selecciona **"Usuario"** (NO "Endpoint")
4. Te mostrará un editor de código

### Paso 2: Copiar el Código

1. Abre el archivo: **`BOTMAKER_ACCION_USUARIO.js`**
2. **Copia TODO el código**
3. **Reemplaza esta línea ANTES de pegar:**
   ```javascript
   const API_URL = "https://tu-dominio.com/api/bot/webhook";
   ```
   Por tu URL real:
   ```javascript
   const API_URL = "https://tu-app.com/api/bot/webhook";
   ```
4. Pega el código en el editor de Botmaker

### Paso 3: Guardar y Publicar

1. Haz clic en **"Guardar"**
2. Haz clic en **"Publicar"** (si es necesario)

---

## 🎯 Cómo Funciona

### Tu Flujo (sin cambios):

```
Usuario completa formulario
  ↓
Botmaker guarda: nro_expediente = "12345"
  ↓
Bloque llama a acción "Consultar Expediente" (tipo Usuario)
  ↓
La acción lee automáticamente: bot.getVariable('nro_expediente')
  ↓
Llama a tu API
  ↓
Devuelve respuesta al usuario
```

### Ventajas de Tipo "Usuario":

✅ **Acceso directo a variables** - No necesitas configurar parámetros  
✅ **Más simple** - El código lee las variables automáticamente  
✅ **Mejor integración** - Diseñado para trabajar con el flujo del bot  

---

## 🔍 El Código Busca la Variable en Este Orden:

1. `bot.getVariable('nro_expediente')` ← **Tu variable**
2. `bot.getVariable('numeroExpediente')` (alternativo)
3. `bot.getVariable('query')` (alternativo)
4. `context.nro_expediente` (desde contexto)
5. `message.text` (extrae números del mensaje)
6. `user.get('nro_expediente')` (desde usuario)

---

## 🧪 Cómo Probar

### Opción 1: Desde el Flujo de Botmaker

1. Configura tu flujo:
   - Formulario guarda en `${nro_expediente}`
   - Bloque llama a acción "Consultar Expediente"
2. Prueba el flujo completo
3. El bot debería responder con los datos del expediente

### Opción 2: Verificar Logs

El código incluye logs. Revisa los logs de la acción en Botmaker y deberías ver:

```
[Consultar Expediente] Número obtenido de variable del bot: 12345
[Consultar Expediente] Consultando expediente: 12345
[Consultar Expediente] Respuesta recibida exitosamente
```

---

## ⚠️ Si Aún No Funciona

### Problema: No encuentra la variable

**Solución 1:** Verifica que el nombre de la variable sea exactamente `nro_expediente` (sin espacios, minúsculas)

**Solución 2:** Agrega logs temporales para ver qué variables están disponibles:
```javascript
OUTPUTS.log(`[${NAME_CA}] Variables disponibles: ${JSON.stringify(bot.getAllVariables())}`);
```

**Solución 3:** Si Botmaker usa otro método para acceder a variables, ajusta el código. Algunas versiones usan:
- `variables.nro_expediente`
- `flow.nro_expediente`
- `session.nro_expediente`

### Problema: Error de sintaxis

**Solución:** Usa la versión simplificada o verifica que la sintaxis sea compatible con tu versión de Botmaker.

---

## 📊 Comparación: Endpoint vs Usuario

| Característica | Endpoint | Usuario |
|---------------|----------|---------|
| Acceso a variables | Requiere parámetros | ✅ Directo |
| Configuración | Más compleja | ✅ Más simple |
| Uso | Para APIs externas | ✅ Para flujos de bot |
| Tu caso | ❌ No permite parámetros | ✅ **RECOMENDADO** |

---

## 🔄 Flujo Completo Actualizado

```
Usuario escribe número en formulario
  ↓
Botmaker guarda: nro_expediente = "12345"
  ↓
Bloque ejecuta acción "Consultar Expediente" (tipo Usuario)
  ↓
Código lee automáticamente: bot.getVariable('nro_expediente')
  ↓
Código llama a: /api/bot/webhook con { query: "12345" }
  ↓
Tu API consulta el expediente
  ↓
Devuelve respuesta formateada
  ↓
Código envía: bot.sendMessage(resultado.reply)
  ↓
Usuario ve los datos del expediente
```

---

## ✅ Checklist

- [ ] Creé acción de código tipo **"Usuario"** (NO "Endpoint")
- [ ] Copié el código de `BOTMAKER_ACCION_USUARIO.js`
- [ ] Reemplacé la URL con mi dominio real
- [ ] Guardé y publiqué la acción
- [ ] Configuré el flujo para llamar a esta acción
- [ ] Probé el flujo completo
- [ ] Revisé los logs para verificar que lee la variable

---

## 💡 Nota Final

Si después de probar tipo "Usuario" aún tienes problemas, puede ser que tu versión de Botmaker use una sintaxis diferente. En ese caso, comparte los logs o mensajes de error y podemos ajustar el código específicamente para tu versión.

