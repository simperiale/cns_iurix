"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Header({ title }) {
  return <h1>{title ? title : "Buscar Expedientes"}</h1>;
}

export default function BuscarExpedientesPage() {
  const [form, setForm] = useState({
    fechaDesde: "",
    fechaHasta: "",
    numeroExpediente: "",
    cuij: "",
    anioCausa: "",
    caratulaExpediente: "",
    misCausas: false,
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
  }, []);


    
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

      // Verificar si la respuesta es ok antes de parsear JSON
      if (!res.ok) {
        let errorMessage = "Error al obtener expedientes";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Si no se puede parsear como JSON, usar el status text
          errorMessage = `Error ${res.status}: ${res.statusText || errorMessage}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      if (data.expedientes?.length > 0) {
        setExpedientes(data.expedientes);
        //await enviarMensajeAlBot(`Se consultaron ${data.expedientes.length} expedientes.`);
      } else {
        setExpedientes([]);
        setError("No se encontraron expedientes con esos filtros.");
      }
    } catch (err) {
      console.error("Error al consultar:", err);
      setError(err.message || "Debe iniciar sesión o hubo un error en la consulta.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  return (
    <main style={{ padding: 20 }}>
      <Header title="Buscar Expedientes" />

      <div style={{ marginTop: 20 }}>
        <Link href="/">Inicio</Link> |{" "}
        <Link href="/api/auth/login">Iniciar sesión</Link> |{" "}
        <Link href="/api/auth/logout">Cerrar sesión</Link>
      </div>

      {/* FORMULARIO */}
      <section style={{ marginTop: 30 }}>
        <h2>Buscar Expedientes</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px",
              maxWidth: "800px",
            }}
          >
            <div>
              <label htmlFor="fechaDesde" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                Fecha Desde
              </label>
              <input
                type="date"
                id="fechaDesde"
                name="fechaDesde"
                value={form.fechaDesde}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="fechaHasta" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                Fecha Hasta
              </label>
              <input
                type="date"
                id="fechaHasta"
                name="fechaHasta"
                value={form.fechaHasta}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="numeroExpediente" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                Número de Expediente
              </label>
              <input
                type="text"
                id="numeroExpediente"
                name="numeroExpediente"
                value={form.numeroExpediente}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="cuij" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                CUIJ
              </label>
              <input
                type="text"
                id="cuij"
                name="cuij"
                value={form.cuij}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="anioCausa" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                Año
              </label>
              <input
                type="number"
                id="anioCausa"
                name="anioCausa"
                min="1900"
                max="2099"
                value={form.anioCausa}
                onChange={handleChange}
                style={{
                  width: "120px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", marginTop: "25px" }}>
              <input
                type="checkbox"
                id="misCausas"
                name="misCausas"
                checked={form.misCausas}
                onChange={handleChange}
                style={{ marginRight: "8px", width: "18px", height: "18px" }}
                disabled={loading}
              />
              <label htmlFor="misCausas" style={{ fontWeight: "bold" }}>
                Mis Causas
              </label>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label htmlFor="caratulaExpediente" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                Carátula del Expediente
              </label>
              <input
                type="text"
                id="caratulaExpediente"
                name="caratulaExpediente"
                value={form.caratulaExpediente}
                maxLength="50"
                placeholder="Ej: López vs. Pérez por Daños y Perjuicios"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: "14px",
                }}
                disabled={loading}
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px", textAlign: "right" }}>
                Máx. 50 caracteres
              </p>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontSize: "16px",
              fontWeight: "bold",
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
              <li
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "15px",
                  marginBottom: "10px",
                  background: "#f9f9f9",
                }}
              >
                <strong>Número:</strong> {exp.numeroExp} <br />
                <strong>Año:</strong> {exp.anioExp} <br />
                <strong>Cuij:</strong> {exp.cuijExp} <br />
                <strong>Carátula:</strong> {exp.caratulaExp || "Sin nombre"} <br />
                <strong>Fuero:</strong> {exp.fuero || "N/A"} <br />
                <strong>Circunscripción:</strong> {exp.circunscripcion || "N/A"} <br />
                <strong>Magistrado:</strong> {exp.magistrado || "N/A"} <br />
                <strong>Tribunal de Radicación:</strong> {exp.tribunalDeRadicacion || "Sin nombre"} <br />
                <strong>Fecha de inicio:</strong> {exp.fechaInicioExp || "N/A"} <br />
                <strong>Nivel de Acceso:</strong> {exp.nivelAccesoExp || "N/A"} <br />
                <div style={{ marginTop: "5px" }}>
                  {exp.favorito && <span style={{ color: "gold" }}>⭐ Favorito</span>}
                  {exp.usuarioVinculado && <span style={{ color: "green", marginLeft: "10px" }}>✓ Usuario Vinculado</span>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && expedientes.length === 0 && !error && (
          <p>Ingrese los filtros de búsqueda y haga clic en "Buscar" para consultar expedientes.</p>
        )}
      </section>
    </main>
  );
}

