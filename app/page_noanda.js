"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 p-6">
      
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-3">
          Sistema Judicial
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Consulta tus expedientes, actuaciones y causas judiciales.
        </p>

        {/* 🔹 Botones de sesión */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/api/auth/login"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/api/auth/logout"
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition duration-200"
          >
            Cerrar sesión
          </Link>
        </div>

        {/* 🔹 Ir a expedientes */}
        <div>
          <Link
            href="/expedientes"
            className="inline-block text-blue-700 font-semibold hover:underline hover:text-blue-800 transition"
          >
            Ir a búsqueda de expedientes →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Poder Judicial - Mendoza
      </footer>
    </main>
  );
}
