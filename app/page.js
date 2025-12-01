"use client";

import Link from "next/link";

function Header({ title }) {
  return <h1>{title ? title : "Sistema Judicial - Expedientes"}</h1>;
}

export default function HomePage() {

  return (
    <main style={{ padding: 20 }}>
      <Header title="Bienvenidos al sistema de consulta de expedientes de Iurix! 👋" />

      <div style={{ marginTop: 20 }}>
        <a href="/api/auth/login">Iniciar sesión</a> |{" "}
        <a href="/api/auth/logout">Cerrar sesión</a>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav style={{ marginTop: 20, padding: "15px", background: "#f5f5f5", borderRadius: 6 }}>
        <h3 style={{ marginTop: 0 }}>Consultas Disponibles</h3>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <li>
            <Link 
              href="/buscar-expedientes" 
              style={{ 
                padding: "8px 16px", 
                background: "#0070f3", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                display: "inline-block"
              }}
            >
              Buscar Expedientes
            </Link>
          </li>
          <li>
            <Link 
              href="/mis-causas" 
              style={{ 
                padding: "8px 16px", 
                background: "#0070f3", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                display: "inline-block"
              }}
            >
              Mis Causas
            </Link>
          </li>
          <li>
            <span 
              style={{ 
                padding: "8px 16px", 
                background: "#ccc", 
                color: "#666", 
                borderRadius: 4,
                display: "inline-block",
                cursor: "not-allowed"
              }}
              title="Próximamente"
            >
              Lista Diaria
            </span>
          </li>
          <li>
            <span 
              style={{ 
                padding: "8px 16px", 
                background: "#ccc", 
                color: "#666", 
                borderRadius: 4,
                display: "inline-block",
                cursor: "not-allowed"
              }}
              title="Próximamente"
            >
              Partes de Expediente
            </span>
          </li>
          <li>
            <Link 
              href="/detalle-expediente" 
              style={{ 
                padding: "8px 16px", 
                background: "#0070f3", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                display: "inline-block"
              }}
            >
              Detalle de Expediente
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
