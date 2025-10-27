"use client";

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
      <Header title="Bienvenida, Silvia 👋" />

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
}

