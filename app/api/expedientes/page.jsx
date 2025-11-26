"use client";
import { useState } from "react";

export default function ExpedientesPage() {
  const [form, setForm] = useState({
    fechaDesde: "",
    fechaHasta: "",
    numeroExpediente: "",
    cuij: "",
    anioCausa: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFechas = () => {
    if (!form.fechaDesde || !form.fechaHasta) return true; // no obligatorias
    const [d1, m1, y1] = form.fechaDesde.split("/").map(Number);
    const [d2, m2, y2] = form.fechaHasta.split("/").map(Number);
    const desde = new Date(y1, m1 - 1, d1);
    const hasta = new Date(y2, m2 - 1, d2);
    return desde <= hasta;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!validarFechas()) {
      setError("La fecha desde no puede ser mayor que la fecha hasta.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/expedientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error en la consulta");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-700">
        Buscar Expedientes
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fechaDesde"
            placeholder="Fecha desde (dd/mm/yyyy)"
            value={form.fechaDesde}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="fechaHasta"
            placeholder="Fecha hasta (dd/mm/yyyy)"
            value={form.fechaHasta}
            onChange={handleChange}
            className="border rounded p-2"
          />
        </div>

        <input
          type="text"
          name="numeroExpediente"
          placeholder="Número de expediente"
          value={form.numeroExpediente}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        <input
          type="text"
          name="cuij"
          placeholder="CUiJ"
          value={form.cuij}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        <input
          type="text"
          name="anioCausa"
          placeholder="Año de causa (ej. 2025)"
          value={form.anioCausa}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Consultando...
            </span>
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Resultados:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

