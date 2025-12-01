"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Header({ title }) {
  return <h1>{title ? title : "Detalle de Expediente"}</h1>;
}

export default function DetalleExpedientePage() {
  const [cuij, setCuij] = useState("");
  const [detalle, setDetalle] = useState(null);
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
    setDetalle(null);
    setLoading(true);

    if (!cuij.trim()) {
      setError("Por favor, ingrese un CUIJ");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/detalle-expediente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuij: cuij.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener el detalle del expediente");
      }

      setDetalle(data);
    } catch (err) {
      console.error("Error al consultar:", err);
      setError(err.message || "Debe iniciar sesión o hubo un error en la consulta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <Header title="Detalle de Expediente" />

      <div style={{ marginTop: 20 }}>
        <Link href="/">Inicio</Link> |{" "}
        <Link href="/api/auth/login">Iniciar sesión</Link> |{" "}
        <Link href="/api/auth/logout">Cerrar sesión</Link>
      </div>

      {/* FORMULARIO */}
      <section style={{ marginTop: 30 }}>
        <h2>Consultar Detalle por CUIJ</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="cuij" style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
              CUIJ:
            </label>
            <input
              type="text"
              id="cuij"
              value={cuij}
              onChange={(e) => setCuij(e.target.value)}
              placeholder="Ej: 13-07473547-3"
              style={{
                width: "300px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: "14px",
              }}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Consultando..." : "Buscar"}
          </button>
        </form>
      </section>

      {/* RESULTADOS */}
      <section style={{ marginTop: 30 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading && <p>Consultando detalle del expediente...</p>}

        {!loading && detalle && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "20px",
              background: "#f9f9f9",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Detalle del Expediente</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              <div>
                <strong>CUIJ:</strong> {detalle.cuijExp}
              </div>
              <div>
                <strong>Número Preexistente:</strong> {detalle.numeroPreexistente || "N/A"}
              </div>
              <div>
                <strong>Objeto de Juicio:</strong> {detalle.objetoDeJuicio || "N/A"}
              </div>
              <div>
                <strong>Fecha de Inicio:</strong> {detalle.fechaDeInicio || "N/A"}
              </div>
              <div>
                <strong>Fecha de Presentación:</strong> {detalle.fechaDePresentacion || "N/A"}
              </div>
              <div>
                <strong>Fecha Último Movimiento:</strong> {detalle.fechaUltimoMovimiento || "N/A"}
              </div>
              <div>
                <strong>Organismo de Origen:</strong> {detalle.organismoDeOrigen || "N/A"}
              </div>
              <div>
                <strong>Organismo de Radicación Actual:</strong> {detalle.organismoDeRadicacionActual || "N/A"}
              </div>
              <div>
                <strong>Ubicación Actual:</strong> {detalle.ubicacionActual || "N/A"}
              </div>
              <div>
                <strong>Tribunal de Primera Instancia:</strong> {detalle.tribunalDePrimeraInstancia || "N/A"}
              </div>
              {detalle.tribunalDeSegundaInstancia && (
                <div>
                  <strong>Tribunal de Segunda Instancia:</strong> {detalle.tribunalDeSegundaInstancia}
                </div>
              )}
              <div>
                <strong>Sentencia:</strong> {detalle.sentencia ? "Sí" : "No"}
              </div>
              <div>
                <strong>Usuario Vinculado:</strong> {detalle.usuarioVinculado ? "Sí" : "No"}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

