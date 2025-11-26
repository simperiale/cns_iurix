"use client";
import { useState } from "react";

export default function ExpedientesForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    fechaDesde: "",
    fechaHasta: "",
    numeroExpediente: "",
    cuij: "",
    anioCausa: "",
    caratulaExpediente: "",
    misCausas: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl mx-auto mt-6 border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        Buscar Expedientes
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha Desde</label>
          <input
            type="date"
            name="fechaDesde"
            value={formData.fechaDesde}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha Hasta</label>
          <input
            type="date"
            name="fechaHasta"
            value={formData.fechaHasta}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Número de Expediente</label>
          <input
            type="text"
            name="numeroExpediente"
            value={formData.numeroExpediente}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">CUIJ</label>
          <input
            type="text"
            name="cuij"
            value={formData.cuij}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Año</label>
          <input
            type="number"
            name="anioCausa"
            min="1900"
            max="2099"
            value={formData.anioCausa}
            onChange={handleChange}
            className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ✅ Campo Mis Causas */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="misCausas"
            checked={formData.misCausas}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
          />
          <label className="ml-2 text-sm text-gray-600">Mis Causas</label>
        </div>

        {/* ✅ Campo Carátula del Expediente */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Carátula del Expediente</label>
          <input
            type="text"
            name="caratulaExpediente"
            value={formData.caratulaExpediente}
            maxLength="50"
            placeholder="Ej: López vs. Pérez por Daños y Perjuicios"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            Máx. 50 caracteres
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
