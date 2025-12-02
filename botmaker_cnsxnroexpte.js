const main = async () => {
    try {
        // Función de log segura
        const log = (msg) => {
            try {
                if (typeof user !== 'undefined' && user.log) {
                    user.log(msg);
                } else if (typeof console !== 'undefined') {
                    console.log(msg);
                }
            } catch (e) {
                console.log(msg);
            }
        };

        log("=== Inicio acción de código ===");

        // 1) Tomar variables del flujo - Intentar múltiples métodos
        let numeroExpediente = null;
        let anioCausa = null;
        
        // Método 1: user.get (si está disponible)
        if (typeof user !== 'undefined' && user.get) {
            numeroExpediente = user.get("numeroExpediente") || 
                              user.get("nro_expediente") || 
                              user.get("query");
            anioCausa = user.get("anioCausa") || 
                       user.get("anio_expedediente") || 
                       user.get("anio_causa");
            if (numeroExpediente) {
                log("✅ Número obtenido de user.get: " + numeroExpediente);
            }
            if (anioCausa) {
                log("✅ Año obtenido de user.get: " + anioCausa);
            }
        }
        
        // Método 2: bot.getVariable (más común en acciones tipo Usuario)
        if (!numeroExpediente && typeof bot !== 'undefined' && bot.getVariable) {
            numeroExpediente = bot.getVariable("numeroExpediente") || 
                              bot.getVariable("nro_expediente") || 
                              bot.getVariable("query");
            if (numeroExpediente) {
                log("✅ Número obtenido de bot.getVariable: " + numeroExpediente);
            }
        }
        
        if (!anioCausa && typeof bot !== 'undefined' && bot.getVariable) {
            anioCausa = bot.getVariable("anioCausa") || 
                       bot.getVariable("anio") || 
                       bot.getVariable("anio_causa");
            if (anioCausa) {
                log("✅ Año obtenido de bot.getVariable: " + anioCausa);
            }
        }
        
        // Método 3: context (para variables de sesión)
        if (!numeroExpediente && typeof context !== 'undefined') {
            numeroExpediente = context.numeroExpediente || 
                              context.nro_expediente || 
                              context.query;
            if (numeroExpediente) {
                log("✅ Número obtenido de context: " + numeroExpediente);
            }
        }
        
        if (!anioCausa && typeof context !== 'undefined') {
            anioCausa = context.anioCausa || 
                       context.anio || 
                       context.anio_causa;
            if (anioCausa) {
                log("✅ Año obtenido de context: " + anioCausa);
            }
        }

        if (!numeroExpediente) {
            const errorMsg = "❌ No se recibió el número de expediente.";
            log("❌ ERROR: " + errorMsg);
            
            // Intentar guardar en múltiples lugares
            if (typeof bot !== 'undefined' && bot.setVariable) {
                bot.setVariable("ci_respuesta", errorMsg);
            } else if (typeof context !== 'undefined' && context.set) {
                context.set("ci_respuesta", errorMsg);
            } else if (typeof user !== 'undefined' && user.set) {
                user.set("ci_respuesta", errorMsg);
            }
            return;
        }

        log("🔄 Consultando expediente: " + numeroExpediente + (anioCausa ? " (Año: " + anioCausa + ")" : ""));

        // 2) URL de tu API
        const url = "https://6bd71e61fc01.ngrok-free.app/api/bot/webhook";

        // 3) Llamado al endpoint con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segundos

        let response;
        try {
            // Preparar el body con ambas variables
            const requestBody = {
                query: numeroExpediente,
                numeroExpediente: numeroExpediente
            };
            
            // Agregar anioCausa solo si fue proporcionado
            if (anioCausa) {
                requestBody.anioCausa = anioCausa;
                requestBody.anio = anioCausa; // También como 'anio' por compatibilidad
            }
            
            log("📤 Enviando request: " + JSON.stringify(requestBody));
            
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                const errorMsg = "❌ La consulta tardó demasiado tiempo.";
                log("❌ ERROR: " + errorMsg);
                
                if (typeof bot !== 'undefined' && bot.setVariable) {
                    bot.setVariable("ci_respuesta", errorMsg);
                } else if (typeof context !== 'undefined' && context.set) {
                    context.set("ci_respuesta", errorMsg);
                } else if (typeof user !== 'undefined' && user.set) {
                    user.set("ci_respuesta", errorMsg);
                }
                return;
            }
            throw fetchError;
        }

        if (!response.ok) {
            const errorMsg = `❌ Error al consultar: ${response.status} ${response.statusText}`;
            log("❌ ERROR: " + errorMsg);
            
            if (typeof bot !== 'undefined' && bot.setVariable) {
                bot.setVariable("ci_respuesta", errorMsg);
            } else if (typeof context !== 'undefined' && context.set) {
                context.set("ci_respuesta", errorMsg);
            } else if (typeof user !== 'undefined' && user.set) {
                user.set("ci_respuesta", errorMsg);
            }
            return;
        }

        const data = await response.json();
        log("✅ Respuesta de API recibida");

        // 4) Guardar respuesta en variable de Botmaker
        const respuesta = data.reply || "❌ No se encontró información del expediente.";
        
        // Intentar guardar en múltiples lugares (prioridad: bot > context > user)
        let guardado = false;
        if (typeof bot !== 'undefined' && bot.setVariable) {
            bot.setVariable("ci_respuesta", respuesta);
            log("✅ Variable guardada con bot.setVariable");
            guardado = true;
        } else if (typeof context !== 'undefined' && context.set) {
            context.set("ci_respuesta", respuesta);
            log("✅ Variable guardada con context.set (sesión)");
            guardado = true;
        } else if (typeof user !== 'undefined' && user.set) {
            user.set("ci_respuesta", respuesta);
            log("✅ Variable guardada con user.set");
            guardado = true;
        }
        
        if (!guardado) {
            log("⚠️ No se pudo guardar la variable (bot.setVariable, context.set o user.set no disponibles)");
        } else {
            log("✅ Variable 'ci_respuesta' guardada correctamente: " + respuesta.substring(0, 50) + "...");
        }

    } catch (err) {
        const errorMsg = "❌ Error consultando el expediente: " + err.message;
        
        // Intentar log
        try {
            if (typeof user !== 'undefined' && user.log) {
                user.log("❌ ERROR: " + errorMsg);
            } else {
                console.log("❌ ERROR: " + errorMsg);
            }
        } catch (e) {
            console.log("❌ ERROR: " + errorMsg);
        }
        
        // Intentar guardar error en variable
        try {
            if (typeof bot !== 'undefined' && bot.setVariable) {
                bot.setVariable("ci_respuesta", errorMsg);
            } else if (typeof context !== 'undefined' && context.set) {
                context.set("ci_respuesta", errorMsg);
            } else if (typeof user !== 'undefined' && user.set) {
                user.set("ci_respuesta", errorMsg);
            }
        } catch (e) {
            console.log("No se pudo guardar variable de error");
        }
    }
};

// Ejecutar la función principal
// IMPORTANTE: En Botmaker, el código debe terminar correctamente
main()
    .then(() => {
        // Log de finalización
        try {
            if (typeof user !== 'undefined' && user.log) {
                user.log("✅ Proceso finalizado correctamente");
            }
        } catch (e) {
            console.log("✅ Proceso finalizado correctamente");
        }
        
        // Si result.done está disponible, llamarlo
        if (typeof result !== 'undefined' && result.done) {
            result.done();
        }
    })
    .catch(err => {
        const errorMessage = `❌ Error final: ${err.message}`;
        try {
            if (typeof user !== 'undefined' && user.log) {
                user.log(errorMessage);
            } else {
                console.log(errorMessage);
            }
        } catch (e) {
            console.log(errorMessage);
        }
        
        // Intentar guardar error
        try {
            if (typeof bot !== 'undefined' && bot.setVariable) {
                bot.setVariable("ci_respuesta", errorMessage);
            } else if (typeof context !== 'undefined' && context.set) {
                context.set("ci_respuesta", errorMessage);
            } else if (typeof user !== 'undefined' && user.set) {
                user.set("ci_respuesta", errorMessage);
            }
        } catch (e) {
            // Ignorar
        }
        
        // Si result.done está disponible, llamarlo incluso en error
        if (typeof result !== 'undefined' && result.done) {
            result.done();
        }
    });
