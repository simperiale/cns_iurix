/* "use client";

import { useEffect, useState } from "react";
import { getExpedientes } from '../lib/api';

function Header({ title }) {
  return <h1>{title ? title : "Sistema Judicial - Expedientes"}</h1>;
}

export default function HomePage() {
  const [likes, setLikes] = useState(0);
  const [expedientes, setExpedientes] = useState([]);
  const [error, setError] = useState(null);

  function handleClick() {
    setLikes(likes + 1);
  }

  useEffect(() => {
    // Intentamos obtener expedientes cuando el usuario ya esté autenticado
    getExpedientes()
      .then((data) => {
        if (data && data.expedientes) {
          setExpedientes(data.expedientes);
        } else {
          setError("No hay expedientes disponibles.");
        }
      })
      .catch((err) => {
        console.error("Error al obtener expedientes:", err);
        setError("Debe iniciar sesión para ver los expedientes.");
      });
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <Header title="Bienvenido 👋" />

      <div style={{ marginTop: 20 }}>
        <a href="/api/auth/login">Iniciar sesión</a> |{" "}
        <a href="/api/auth/logout">Cerrar sesión</a>
      </div>

      <section style={{ marginTop: 30 }}>
        <h2>Listado de Expedientes</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {expedientes.length > 0 ? (
          <ul>
            {expedientes.map((exp, i) => (
              <li key={i}>
                <strong>Número:</strong> {exp.numeroExp} <br />
                <strong>Año:</strong> {exp.anioExp} <br />
                <strong>Cuij:</strong> {exp.cuijExp} <br />
                <strong>Carátula:</strong> {exp.caratulaExp || "Sin nombre"} <br />
                <strong>Juzgado:</strong> {exp.juzgadoExp || "Sin nombre"} <br />
                <strong>Nivel de Acceso:</strong> {exp.nivelAccesoExp || "Sin nombre"} <br />
                <strong>Último Movimiento:</strong> {exp.ultimoMovExp || "Sin nombre"}
              </li>
            ))}
          </ul>
        ) : !error ? (
          <p>Cargando expedientes...</p>
        ) : null}
      </section>

      <section style={{ marginTop: 40 }}>
        <button onClick={handleClick}>Like ({likes})</button>
      </section>
    </main>
  );
} */

"use client";

import { useState } from "react";

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
  const [likes, setLikes] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <main style={{ padding: 20 }}>
      <Header title="Bienvenidos! 👋" />

      <div style={{ marginTop: 20 }}>
        <a href="/api/auth/login">Iniciar sesión</a> |{" "}
        <a href="/api/auth/logout">Cerrar sesión</a>
      </div>

      {/* 🔹 FORMULARIO DE BÚSQUEDA */}
      <section style={{ marginTop: 30 }}>
        <h2>Buscar Expedientes</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
            <label className="block text-sm text-gray-600 mb-1">Fecha Desde:  </label>
            <input
              type="text"
              name="fechaDesde"
              placeholder="Fecha desde (dd/mm/yyyy)"
              value={form.fechaDesde}
              onChange={handleChange}
              length={10} 
            />
            </div>
            <div> 
            <label className="block text-sm text-gray-600 mb-1">Fecha Hasta:  </label>  
            <input
              type="text"
              name="fechaHasta"
              placeholder="Fecha hasta (dd/mm/yyyy)"
              value={form.fechaHasta}
              onChange={handleChange}
            />
            </div>
            <div>
            <label className="block text-sm text-gray-600 mb-1">Número de Causa:  </label>
            <input
              type="text"
              name="numeroCausa"
              placeholder="Número de expediente"
              value={form.numeroExpediente}
              onChange={handleChange}
            />
            </div>
            <div>
            <label className="block text-sm text-gray-600 mb-1">CUiJ:  </label>
            <input
              type="text"
              name="cuijCausa"
              placeholder="CUiJ"
              value={form.cuij}
              onChange={handleChange}
            />
            </div>
            <div>
            <label className="block text-sm text-gray-600 mb-1">Año de Causa:  </label>
            <input
              type="text"
              name="anioCausa"
              placeholder="Año de causa"
              value={form.anioCausa}
              onChange={handleChange}
            />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: 15,
              padding: "8px 16px",
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

      {/* 🔹 RESULTADOS */}
      <section style={{ marginTop: 30 }}>
        <h2>Listado de Expedientes</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading && <p>Cargando expedientes...</p>}

        {!loading && expedientes.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {expedientes.map((exp, i) => (
              <li
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>Número:</strong> {exp.numeroExp} <br />
                <strong>Año:</strong> {exp.anioExp} <br />
                <strong>Cuij:</strong> {exp.cuijExp} <br />
                <strong>Carátula:</strong> {exp.caratulaExp || "Sin nombre"} <br />
                <strong>Juzgado:</strong> {exp.juzgadoExp || "Sin nombre"} <br />
                <strong>Nivel de Acceso:</strong> {exp.nivelAccesoExp || "Sin dato"} <br />
                <strong>Último Movimiento:</strong> {exp.ultimoMovExp || "Sin dato"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <button onClick={handleClick}>Like ({likes})</button>
      </section>
    </main>
  );
}
