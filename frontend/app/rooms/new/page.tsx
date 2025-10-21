/* PAGINA PARA CREAR NUEVAS SALAS, ESTAS SE GUARDAN EN UNA BASE DE DATOS  */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/components/landing/layout/Header";

export default function NewRoomPage() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  const availableEquipment = [
    "Pantalla",
    "Proyector",
    "Equipo de Videollamada",
    "Pizarra",
    "Sistema de Audio",
  ];

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setEquipment((prev) => [...prev, value]);
    } else {
      setEquipment((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const newRoom = {
      name: roomName,
      capacity: parseInt(capacity),
      location: location,
      imageUrl: imageUrl,
      equipment: equipment,
    };

    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (response.ok) {
        router.push("/rooms");
      } else {
        const data = await response.json();
        setError(data.error || "No se pudo crear la sala.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nueva Sala de Reuniones
        </h1>
        <Link
          href="/rooms"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-8"
        >
          <ArrowLeft size={18} /> Volver a Salas
        </Link>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la Sala <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="roomName"
                placeholder="Ej: Sala Ejecutiva A"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Capacidad (personas)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  placeholder="4"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Ej: Piso 3, Ala Norte"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL de Imagen (opcional)
              </label>
              <input
                type="url"
                id="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Equipamiento Disponible
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                {availableEquipment.map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`equipment-${item}`}
                      value={item}
                      checked={equipment.includes(item)}
                      onChange={handleEquipmentChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`equipment-${item}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors"
            >
              Crear Sala
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
