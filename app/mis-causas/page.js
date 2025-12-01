"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Header({ title }) {
  return <h1>{title ? title : "Mis Causas"}</h1>;
}

export default function MisCausasPage() {
  const [expedientes, setExpedientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [tamanio] = useState(10);
  const [paginacion, setPaginacion] = useState({
    totalPaginas: 1,
    totalElementos: 0,
  });

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

  useEffect(() => {
    cargarMisCausas();
  }, [pagina]);

  async function cargarMisCausas() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/mis-causas?pagina=${pagina}&tamanio=${tamanio}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al obtener mis causas");

      // La API devuelve 'causas' no 'expedientes'
      if (data.causas?.length > 0) {
        setExpedientes(data.causas);
        setPaginacion({
          totalPaginas: data.totalPaginas || 1,
          totalElementos: data.totalElementos || 0,
        });
      } else if (data.causas?.length === 0) {
        setExpedientes([]);
        setPaginacion({
          totalPaginas: data.totalPaginas || 1,
          totalElementos: data.totalElementos || 0,
        });
        setError("No se encontraron causas.");
      } else {
        setExpedientes([]);
        setPaginacion({ totalPaginas: 1, totalElementos: 0 });
        setError("No se encontraron causas.");
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
      <Header title="Mis Causas" />

      <div style={{ marginTop: 20 }}>
        <Link href="/">Inicio</Link> |{" "}
        <Link href="/api/auth/login">Iniciar sesión</Link> |{" "}
        <Link href="/api/auth/logout">Cerrar sesión</Link>
      </div>

      {/* RESULTADOS */}
      <section style={{ marginTop: 30 }}>
        <h2>Mis Causas (Ordenadas por Fecha)</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading && <p>Cargando causas...</p>}

        {!loading && expedientes.length > 0 && (
          <>
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
                  <strong>Número:</strong> {exp.numeroExpCau} <br />
                  <strong>Cuij:</strong> {exp.cuijCau} <br />
                  <strong>Carátula:</strong> {exp.caratulaCau || "Sin nombre"} <br />
                  <strong>Fuero:</strong> {exp.fueroCau || "N/A"} <br />
                  <strong>Distrito:</strong> {exp.distritoCau || "N/A"} <br />
                  <strong>Juez de Trámite:</strong> {exp.juezTramiteCau || "Sin nombre"} <br />
                  <strong>Organismo:</strong> {exp.organismoRadActualCau || "Sin nombre"} <br />
                  <strong>Última Acción:</strong> {exp.ultimaAccionCau || "N/A"} <br />
                  {exp.favoritoCau && <span style={{ color: "gold" }}>⭐ Favorito</span>}
                </li>
              ))}
            </ul>

            {/* Paginación simple */}
            <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1 || loading}
                style={{
                  padding: "6px 12px",
                  background: pagina === 1 ? "#ccc" : "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: pagina === 1 ? "not-allowed" : "pointer",
                }}
              >
                Anterior
              </button>
              <span>
                Página {pagina} de {paginacion.totalPaginas} (Total: {paginacion.totalElementos} causas)
              </span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina >= paginacion.totalPaginas || loading}
                style={{
                  padding: "6px 12px",
                  background:
                    pagina >= paginacion.totalPaginas ? "#ccc" : "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: pagina >= paginacion.totalPaginas ? "not-allowed" : "pointer",
                }}
              >
                Siguiente
              </button>
            </div>
          </>
        )}

        {!loading && expedientes.length === 0 && !error && (
          <p>No hay causas para mostrar.</p>
        )}
      </section>
    </main>
  );
}

