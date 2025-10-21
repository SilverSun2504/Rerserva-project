/* PAGINA QUE MUESTRA LAS SALAS CARGADAS POR DEFECTO GRACIAS AL FILE seed.js Y TAMBIEN LAS QUE CREEMOS NOSOTROS
CON EL BOTON "NUEVA SALA" */

"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/landing/layout/Header";
import RoomCard from "@/app/components/landing/rooms/RoomCard";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

interface Room {
  id: string;
  name: string;
  location: string | null;
  capacity: number;
  equipment: string[];
  image_url: string;
}

export default function RoomsPage() {
  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rooms`);
        if (!response.ok) throw new Error("No se pudieron cargar las salas.");
        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido al cargar las salas.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Salas de Reuniones
            </h1>
            <p className="text-gray-500">
              Explora y gestiona las salas disponibles
            </p>
          </div>
          {user && user.role === "Admin" && (
            <Link
              href="/rooms/new"
              className="flex items-center gap-2 bg-blue-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              Nueva Sala
            </Link>
          )}
        </div>
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando salas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              let floor = 0;
              let wing = "Ubicación no especificada";
              if (room.location) {
                const parts = room.location.split(",").map((s) => s.trim());
                const floorInfo = parts[0] || "";
                wing = parts[1] || "Ala no especificada";
                floor = parseInt(floorInfo.replace("Piso ", "")) || 0;
              }
              return (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  floor={floor}
                  wing={wing}
                  capacity={room.capacity}
                  equipment={room.equipment}
                  imageUrl={room.image_url}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
