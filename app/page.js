"use client";

import { useState, useEffect } from "react";

function Header({ title }) {
  return <h1>{title ? title : "Sistema Judicial - Expedientes"}</h1>;
}

export default function HomePage() {
  const [form, setForm] = useState({
    fechaDesde: "",
    fechaHasta: "",
    numeroExpediente: "",
    cuij: "",
    anioCausa: "",
  });

  const [expedientes, setExpedientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);   
  
  useEffect(() => {
    async function obtenerToken() {
      try {
        console.log("🔄 Verificando si hay token en cookies...");
        const res = await fetch("/api/auth/token");
        if (!res.ok) {
          console.warn("No se encontró token en cookies");
          return;
        }
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("jwt_token", data.token);
          console.log("🔐 Token guardado en localStorage");
        }
      } catch (err) {
        console.error("Error al obtener el token:", err);
      }
    }

    obtenerToken();
  }, []); // ← solo se ejecuta una vez al montar

  function handleClick() {
    console.log("✅ Botón funcionando en cliente");
  }

  // ✅ ACÁ podés declarar la función para enviar mensaje al bot
  async function enviarMensajeAlBot1(mensaje) {
    console.log("🟢 Entrando a enviarMensajeAlBot con mensaje:", mensaje);
  }

async function enviarMensajeAlBot(mensaje) {
  console.log("🟢 Enviando mensaje al bot:", mensaje);

  const token = localStorage.getItem("jwt_token");
  if (!token) {
    console.warn("No hay token disponible");
    return { error: "Usuario no autenticado" };
  }

  try {
    const res = await fetch("https://api.botmaker.com/v2.0/externals/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": "TU_ACCESS_TOKEN_DE_BOTMAKER" // ⚠️ reemplazá con tu token de API de Botmaker
      },
      body: JSON.stringify({
        platform: "whatsapp", // o "webchat" según el canal
        customer: {
          phoneNumber: "2616768030", // o email, o ID del usuario según el canal
          name: "Usuario Next.js",
          extras: {
            jwt_token: token // 👈 Aquí mandás el token a Botmaker
          }
        },
        message: {
          text: mensaje
        }
      }),
    });

    const data = await res.json();
    console.log("📩 Respuesta de Botmaker:", data);
    return data;

  } catch (err) {
    console.error("Error al enviar mensaje al bot:", err);
    return { error: "No se pudo contactar al bot" };
  }
}




  // 🔹 Ejemplo: podrías llamar al bot después de consultar expedientes
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setExpedientes([]);
    setLoading(true);

    try {
      const res = await fetch("/api/expedientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al obtener expedientes");

      if (data.expedientes?.length > 0) {
        setExpedientes(data.expedientes);

        // 👇 ejemplo: notificar al bot del resultado
        await enviarMensajeAlBot(`Se consultaron ${data.expedientes.length} expedientes.`);
      } else {
        setError("No se encontraron expedientes con esos filtros.");
      }
    } catch (err) {
      console.error("Error al consultar:", err);
      setError("Debe iniciar sesión o hubo un error en la consulta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <Header title="Bienvenidos al sistema de consulta de expedientes de Iurix! 👋" />

      <div style={{ marginTop: 20 }}>
        <a href="/api/auth/login">Iniciar sesión</a> |{" "}
        <a href="/api/auth/logout">Cerrar sesión</a>
      </div>
      
      {/* FORMULARIO */}
      <section style={{ marginTop: 30 }}>
        <h2>Buscar Expedientes</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
          {/* ... tu formulario original ... */}
          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: "6px 12px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
            disabled={loading}
          >
            {loading ? "Consultando..." : "Buscar"}
          </button>
          
        </form>
      </section>
      

      {/* RESULTADOS */}
      <section style={{ marginTop: 30 }}>
        <h2>Listado de Expedientes</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && expedientes.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {expedientes.map((exp, i) => (
              <li key={i} style={{ border: "1px solid #ddd", borderRadius: 6, padding: "10px", marginBottom: "10px" }}>
                <strong>Número:</strong> {exp.numeroExp} <br />
                <strong>Año:</strong> {exp.anioExp || exp.anioCausa} <br />
                <strong>Cuij:</strong> {exp.cuijExp} <br />
                <strong>Carátula:</strong> {exp.caratulaExp || "Sin nombre"} <br />
                <strong>Juzgado:</strong> {exp.juzgadoExp || "Sin nombre"} <br />
                <strong>Fecha de inicio:</strong> {exp.fechaInicioExp} <br />
                <strong>Circunscripcion:</strong> {exp.circunscripcion} <br />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
