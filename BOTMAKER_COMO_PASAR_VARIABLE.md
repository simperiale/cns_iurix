# Cómo Pasar la Variable ${nro_expediente} a la Acción de Código

## ✅ Tu Flujo Está Correcto

Tu flujo es correcto:
1. ✅ Usuario ingresa número en formulario
2. ✅ Se asigna a variable `${nro_expediente}`
3. ✅ Llamas al bloque con la acción de código

## 🔧 Configuración Necesaria en Botmaker

Para que la variable `${nro_expediente}` llegue a tu acción de código tipo "Endpoint", necesitas pasarla como parámetro. Hay dos formas:

### Opción 1: Pasar como Parámetro en la Acción (Recomendado)

Cuando configuras el bloque que llama a tu acción de código:

1. **En el bloque de la acción de código**, busca la sección de **"Parámetros"** o **"Parameters"**
2. **Agrega un parámetro:**
   - **Nombre del parámetro:** `nro_expediente` (o `numeroExpediente`)
   - **Valor:** `${nro_expediente}` (la variable de tu flujo)

3. El código ya está preparado para leer este parámetro desde `req.query` o `req.body`

### Opción 2: Configurar la Llamada HTTP Manualmente

Si Botmaker te permite configurar cómo se llama al endpoint:

1. **Método:** `POST` (recomendado) o `GET`
2. **URL:** La URL de tu endpoint
3. **Body (si es POST):**
   ```json
   {
     "nro_expediente": "${nro_expediente}"
   }
   ```
   
   O como query parameter (si es GET):
   ```
   ?nro_expediente=${nro_expediente}
   ```

## 📝 Ejemplo de Configuración en Botmaker

### Paso 1: En el Formulario
```
Usuario completa formulario
  ↓
Botmaker guarda en variable: nro_expediente = "12345"
```

### Paso 2: En el Bloque de Acción de Código
```
Bloque: "Consultar Expediente"
  ↓
Parámetros:
  - nro_expediente = ${nro_expediente}
  ↓
Ejecuta acción de código
```

### Paso 3: El Código Lee la Variable
El código en `BOTMAKER_ENDPOINT_CODE.js` buscará la variable en este orden:
1. `req.query.nro_expediente` (si pasas como query parameter)
2. `req.body.nro_expediente` (si pasas en el body)
3. `req.query.numeroExpediente` (nombre alternativo)
4. `req.body.numeroExpediente` (nombre alternativo)
5. Y otros nombres alternativos...

## 🧪 Cómo Verificar que Funciona

### Opción 1: Revisar los Logs

El código incluye logs que te mostrarán de dónde obtuvo el número:

```javascript
OUTPUTS.log(`[${NAME_CA}] Número obtenido de query (nro_expediente): ${numeroExpediente}`);
```

En Botmaker, revisa los logs de la acción para ver si está recibiendo la variable.

### Opción 2: Probar Manualmente

Puedes probar el endpoint directamente desde el navegador o Postman:

**Con GET:**
```
https://tu-endpoint?nro_expediente=12345
```

**Con POST:**
```bash
curl -X POST https://tu-endpoint \
  -H "Content-Type: application/json" \
  -d '{"nro_expediente": "12345"}'
```

## ⚠️ Si No Funciona

### Problema: La variable no llega

**Solución 1:** Verifica que el nombre de la variable sea exactamente `nro_expediente` (sin espacios, mayúsculas/minúsculas importan)

**Solución 2:** Si Botmaker usa otro formato, puedes cambiar el nombre de la variable en tu flujo a `numeroExpediente` que también está soportado.

**Solución 3:** Agrega logs temporales en el código para ver qué está recibiendo:
```javascript
OUTPUTS.log(`[${NAME_CA}] req.query: ${JSON.stringify(req.query)}`);
OUTPUTS.log(`[${NAME_CA}] req.body: ${JSON.stringify(req.body)}`);
```

### Problema: Botmaker no permite pasar parámetros

Si Botmaker no te permite configurar parámetros en la acción de código tipo "Endpoint", entonces:

1. **Usa una acción de código tipo "Usuario"** en lugar de "Endpoint"
2. O configura la acción para que llame a tu endpoint pasando la variable en la URL o body

## 📋 Checklist

- [ ] Variable `${nro_expediente}` está guardada correctamente en el flujo
- [ ] La acción de código está configurada para recibir parámetros
- [ ] El parámetro `nro_expediente` está configurado con valor `${nro_expediente}`
- [ ] El código está actualizado (lee `nro_expediente`)
- [ ] Probé el endpoint manualmente y funciona
- [ ] Revisé los logs en Botmaker para verificar que recibe la variable

## 🔄 Flujo Completo

```
Usuario escribe número en formulario
  ↓
Botmaker guarda: nro_expediente = "12345"
  ↓
Bloque llama a acción "Consultar Expediente"
  ↓
Pasa parámetro: nro_expediente = ${nro_expediente}
  ↓
Código lee: req.body.nro_expediente o req.query.nro_expediente
  ↓
Código llama a: /api/bot/webhook con { query: "12345" }
  ↓
Tu API consulta el expediente
  ↓
Devuelve respuesta formateada
  ↓
Botmaker muestra respuesta al usuario
```

## 💡 Tip Adicional

Si quieres usar un nombre diferente para la variable (por ejemplo `numero_expediente` o `expediente_numero`), solo necesitas:

1. Actualizar el código para buscar ese nombre también
2. O cambiar el nombre de la variable en Botmaker a `nro_expediente` o `numeroExpediente` que ya están soportados

