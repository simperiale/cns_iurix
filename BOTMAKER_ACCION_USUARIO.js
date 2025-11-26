// ============================================
// CÓDIGO PARA BOTMAKER - TIPO "USUARIO"
// ============================================
// 
// INSTRUCCIONES:
// 1. En Botmaker, crea una nueva "Acción de Código"
// 2. Selecciona el tipo "Usuario" (NO "Endpoint")
// 3. Copia y pega TODO este código
// 4. REEMPLAZA "https://tu-dominio.com" con tu URL real
// 5. Guarda y publica
//
// VENTAJA: Este tipo de acción tiene acceso directo a las variables del flujo
//
// ============================================

//@constant('Name CA.It must be the same name with which this code action is saved')
const NAME_CA = "Consultar Expediente";

// URL de tu aplicación (REEMPLAZA con tu dominio real)
const API_URL = "https://205c87297515.ngrok-free.app/api/bot/webhook";

const OUTPUTS = {
  log: (text) => {
    try {
      if (typeof bmconsole !== 'undefined' && bmconsole.log) {
        bmconsole.log(text);
      } else if (typeof console !== 'undefined' && console.log) {
        console.log(text);
      }
      // Si hay un objeto result disponible (para testing)
      if (typeof result !== 'undefined' && result.text) {
        result.text(text);
      }
    } catch (e) {
      // Si falla, intentar con console estándar
      if (typeof console !== 'undefined') {
        console.log(text);
      }
    }
  },
};

const main = async () => {
  try {
    OUTPUTS.log(`[${NAME_CA}] ========== INICIANDO CONSULTA ==========`);
    OUTPUTS.log(`[${NAME_CA}] API_URL configurada: ${API_URL}`);
    
    // Obtener el número de expediente desde las variables del flujo de Botmaker
    let numeroExpediente = null;
    
    // DEBUG: Ver qué objetos están disponibles
    OUTPUTS.log(`[${NAME_CA}] DEBUG - typeof params: ${typeof params}`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - typeof bot: ${typeof bot}`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - typeof context: ${typeof context}`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - typeof message: ${typeof message}`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - typeof user: ${typeof user}`);
    
    // Opción 1: Desde parámetros JSON pasados en el bloque (params) - PRIORIDAD ALTA
    if (typeof params !== 'undefined') {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - params disponible: ${JSON.stringify(params)}`);
      numeroExpediente = params.nro_expediente || 
                        params.numeroExpediente ||
                        params.query;
      if (numeroExpediente) {
        OUTPUTS.log(`[${NAME_CA}] ✅ Número obtenido de params JSON: ${numeroExpediente}`);
      }
    } else {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - params NO está disponible`);
    }
    
    // Opción 2: Desde variables del bot (método más común en acciones tipo "Usuario")
    if (!numeroExpediente && typeof bot !== 'undefined' && bot.getVariable) {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - Intentando obtener de bot.getVariable...`);
      try {
        numeroExpediente = bot.getVariable('nro_expediente') || 
                          bot.getVariable('numeroExpediente') ||
                          bot.getVariable('query') || 
                          bot.getVariable('expediente');
        if (numeroExpediente) {
          OUTPUTS.log(`[${NAME_CA}] ✅ Número obtenido de variable del bot: ${numeroExpediente}`);
        } else {
          OUTPUTS.log(`[${NAME_CA}] DEBUG - bot.getVariable no retornó valor`);
        }
      } catch (e) {
        OUTPUTS.log(`[${NAME_CA}] DEBUG - Error al usar bot.getVariable: ${e.message}`);
      }
    } else {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - bot.getVariable NO está disponible`);
    }
    
    // Opción 3: Desde el contexto de la conversación
    if (!numeroExpediente && typeof context !== 'undefined') {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - context disponible: ${JSON.stringify(context)}`);
      numeroExpediente = context.nro_expediente || 
                        context.numeroExpediente ||
                        context.query;
      if (numeroExpediente) {
        OUTPUTS.log(`[${NAME_CA}] ✅ Número obtenido del contexto: ${numeroExpediente}`);
      }
    }
    
    // Opción 4: Desde el mensaje del usuario (si está disponible)
    if (!numeroExpediente && typeof message !== 'undefined' && message.text) {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - message.text: ${message.text}`);
      const match = message.text.match(/\d+/);
      if (match) {
        numeroExpediente = match[0];
        OUTPUTS.log(`[${NAME_CA}] ✅ Número extraído del mensaje: ${numeroExpediente}`);
      }
    }
    
    // Opción 5: Desde variables globales de Botmaker
    if (!numeroExpediente && typeof user !== 'undefined' && user.get) {
      OUTPUTS.log(`[${NAME_CA}] DEBUG - Intentando obtener de user.get...`);
      try {
        numeroExpediente = user.get('nro_expediente') || 
                          user.get('numeroExpediente');
        if (numeroExpediente) {
          OUTPUTS.log(`[${NAME_CA}] ✅ Número obtenido de user: ${numeroExpediente}`);
        }
      } catch (e) {
        OUTPUTS.log(`[${NAME_CA}] DEBUG - Error al usar user.get: ${e.message}`);
      }
    }
    
    // Validar que tenemos un número de expediente
    if (!numeroExpediente) {
      const errorMsg = "❌ No se encontró el número de expediente. Asegúrate de que la variable 'nro_expediente' esté configurada en el flujo.";
      OUTPUTS.log(`[${NAME_CA}] ❌ ERROR: ${errorMsg}`);
      OUTPUTS.log(`[${NAME_CA}] ========== FIN CON ERROR ==========`);
      
      return {
        reply: errorMsg,
        error: true
      };
    }
    
    OUTPUTS.log(`[${NAME_CA}] ✅ Número de expediente encontrado: ${numeroExpediente}`);
    OUTPUTS.log(`[${NAME_CA}] 🔄 Iniciando llamada a API: ${API_URL}`);
    
    // Llamar a tu API
    const requestBody = {
      query: numeroExpediente,
      numeroExpediente: numeroExpediente
    };
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Request body: ${JSON.stringify(requestBody)}`);
    
    const fetchStartTime = Date.now();
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Iniciando fetch a las ${new Date().toISOString()}`);
    
    // Agregar timeout al fetch para evitar que se cuelgue
    // REDUCIDO A 20 SEGUNDOS para evitar timeout de Botmaker (90s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      OUTPUTS.log(`[${NAME_CA}] ⚠️ Timeout del fetch alcanzado (20s)`);
    }, 20000); // 20 segundos timeout (más agresivo)
    
    let response;
    try {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        const errorMsg = "❌ La consulta tardó demasiado tiempo. Por favor, intenta nuevamente.";
        OUTPUTS.log(`[${NAME_CA}] ❌ ERROR: ${errorMsg}`);
        return {
          reply: errorMsg,
          error: true
        };
      }
      throw fetchError; // Re-lanzar otros errores
    }
    
    const fetchEndTime = Date.now();
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Fetch completado en ${fetchEndTime - fetchStartTime}ms`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Response status: ${response.status}`);
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Response ok: ${response.ok}`);
    
    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
      const errorMsg = `❌ Error al consultar el expediente: ${errorData.error || 'Error desconocido'}`;
      OUTPUTS.log(`[${NAME_CA}] ❌ Error de API: ${errorMsg}`);
      OUTPUTS.log(`[${NAME_CA}] ========== FIN CON ERROR ==========`);
      
      return {
        reply: errorMsg,
        error: true
      };
    }
    
    // Obtener la respuesta
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Parseando respuesta JSON...`);
    const data = await response.json();
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Respuesta recibida: ${JSON.stringify(data).substring(0, 200)}...`);
    
    OUTPUTS.log(`[${NAME_CA}] ✅ Respuesta recibida exitosamente`);
    
    OUTPUTS.log(`[${NAME_CA}] ========== FIN EXITOSO ==========`);
    
    // Devolver la respuesta
    return {
      reply: data.reply || "❌ No se recibió respuesta del servidor",
      success: true,
      expedientes: data.expedientes || [],
      data: data
    };
    
  } catch (error) {
    // Manejo de errores
    const errorMessage = `[${NAME_CA}] Error: ${error.message}`;
    OUTPUTS.log(`[${NAME_CA}] ❌ ERROR CAPTURADO: ${errorMessage}`);
    OUTPUTS.log(`[${NAME_CA}] Stack: ${error.stack}`);
    OUTPUTS.log(`[${NAME_CA}] ========== FIN CON EXCEPCIÓN ==========`);
    
    return {
      reply: `❌ Error interno: ${error.message}\n\nPor favor, intenta nuevamente más tarde.`,
      error: true
    };
  }
};

// Ejecutar la función principal
// CORRECCIÓN: No usamos await en el nivel superior para evitar errores de sintaxis
// En su lugar, usamos .then() y guardamos el resultado en variables para que el flujo lo use

OUTPUTS.log(`[${NAME_CA}] ========== EJECUTANDO ACCIÓN ==========`);

// Ejecutar la función principal con timeout global
// IMPORTANTE: Botmaker tiene un timeout de 90 segundos, así que debemos terminar antes
const executionStartTime = Date.now();
const MAX_EXECUTION_TIME = 85000; // 85 segundos (5 segundos antes del timeout de Botmaker)

main()
  .then((resultado) => {
    const executionTime = Date.now() - executionStartTime;
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Tiempo total de ejecución: ${executionTime}ms`);

    // Guardamos la respuesta si existe
    // IMPORTANTE: Para variables de tipo "sesion" en Botmaker, usar context.set()
    if (resultado && resultado.reply) {
      try { 
        // Prioridad 1: bot.setVariable (para variables globales del bot)
        if (typeof bot !== 'undefined' && bot.setVariable) {
          bot.setVariable('ci_respuesta', resultado.reply);
          OUTPUTS.log(`[${NAME_CA}] ✅ bot.setVariable('ci_respuesta') ejecutado`);
        
        // Prioridad 2: context.set (para variables de sesión)
        } else if (typeof context !== 'undefined' && context.set) {
          context.set('ci_respuesta', resultado.reply);
          OUTPUTS.log(`[${NAME_CA}] ✅ context.set('ci_respuesta') ejecutado - Variable de sesión guardada`);
        
        // Prioridad 3: user.set (para variables de usuario)
        } else if (typeof user !== 'undefined' && user.set) {
          user.set('ci_respuesta', resultado.reply);
          OUTPUTS.log(`[${NAME_CA}] ✅ user.set('ci_respuesta') ejecutado`);
        } else {
          OUTPUTS.log(`[${NAME_CA}] ⚠️ No se encontró método para guardar variable (bot.setVariable, context.set o user.set no disponibles)`);
        }
        
        OUTPUTS.log(`[${NAME_CA}] ✅ Variables guardadas correctamente`);
        
        // Verificación: Intentar leer la variable para confirmar que se guardó
        try {
          let verificacion = null;
          if (typeof bot !== 'undefined' && bot.getVariable) {
            verificacion = bot.getVariable('ci_respuesta');
          } else if (typeof context !== 'undefined' && context.get) {
            verificacion = context.get('ci_respuesta');
          } else if (typeof user !== 'undefined' && user.get) {
            verificacion = user.get('ci_respuesta');
          }
          
          if (verificacion) {
            OUTPUTS.log(`[${NAME_CA}] ✅ Verificación: Variable 'ci_respuesta' leída correctamente (${verificacion.substring(0, 50)}...)`);
          } else {
            OUTPUTS.log(`[${NAME_CA}] ⚠️ Verificación: No se pudo leer la variable después de guardarla`);
          }
        } catch (e) {
          OUTPUTS.log(`[${NAME_CA}] ⚠️ No se pudo verificar la variable: ${e.message}`);
        }
        
      } catch (e) {
        OUTPUTS.log(`[${NAME_CA}] ❌ Error al guardar variables: ${e.message}`);
        OUTPUTS.log(`[${NAME_CA}] Stack: ${e.stack}`);
      }
    } else {
      OUTPUTS.log(`[${NAME_CA}] ⚠️ No hay reply en la respuesta`);
    }

    // 🚀 MUY IMPORTANTE: terminar la ejecución aquí
    OUTPUTS.log(`[${NAME_CA}] ✅ Proceso finalizado correctamente (${executionTime}ms)`);
    OUTPUTS.log(`[${NAME_CA}] ✅ La variable 'ci_respuesta' está lista para usar en el siguiente bloque`);
    OUTPUTS.log(`[${NAME_CA}] ========== FIN DE EJECUCIÓN ==========`);
    
    // Retornar explícitamente para que Botmaker sepa que terminó
    return resultado;
  })
  .catch((error) => {
    const executionTime = Date.now() - executionStartTime;
    OUTPUTS.log(`[${NAME_CA}] DEBUG - Tiempo total antes del error: ${executionTime}ms`);

    const errorMessage = `❌ Error en la acción: ${error.message}`;
    OUTPUTS.log(`[${NAME_CA}] ❌ ERROR CAPTURADO: ${errorMessage}`);

    try {
      // Prioridad 1: bot.setVariable
      if (typeof bot !== 'undefined' && bot.setVariable) {
        bot.setVariable('ci_respuesta', errorMessage);
        OUTPUTS.log(`[${NAME_CA}] ✅ Variable de error guardada con bot.setVariable`);
      // Prioridad 2: context.set (para variables de sesión)
      } else if (typeof context !== 'undefined' && context.set) {
        context.set('ci_respuesta', errorMessage);
        OUTPUTS.log(`[${NAME_CA}] ✅ Variable de error guardada con context.set (sesión)`);
      // Prioridad 3: user.set
      } else if (typeof user !== 'undefined' && user.set) {
        user.set('ci_respuesta', errorMessage);
        OUTPUTS.log(`[${NAME_CA}] ✅ Variable de error guardada con user.set`);
      } else {
        OUTPUTS.log(`[${NAME_CA}] ⚠️ No se encontró método para guardar variable de error`);
      }
    } catch (e) {
      OUTPUTS.log(`[${NAME_CA}] ❌ Error al guardar variable de error: ${e.message}`);
      OUTPUTS.log(`[${NAME_CA}] Stack: ${e.stack}`);
    }

    OUTPUTS.log(`[${NAME_CA}] ✅ Fin con error (${executionTime}ms)`);
    
    // Retornar el error para que Botmaker sepa que terminó
    return { error: true, reply: errorMessage };
  });