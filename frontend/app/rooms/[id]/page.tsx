"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Header from "@/app/components/landing/layout/Header";
import Image from "next/image";
import { MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  image_url: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";
  const roomId = params.id;

  useEffect(() => {
    if (roomId) {
      fetch(`${API_URL}/api/rooms/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          setRoom(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar detalles de la sala:", err);
          setError("No se pudo cargar la sala.");
          setIsLoading(false);
        });
    }
  }, [roomId]);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("Debes iniciar sesión para reservar.");
      return;
    }
    const startDateTimeLocalString = `${startDate}T${startTime}`;
    const endDateTimeLocalString = `${endDate}T${endTime}`;
    const startDateLocal = new Date(startDateTimeLocalString);
    const endDateLocal = new Date(endDateTimeLocalString);
    const startTimeISO_UTC = startDateLocal.toISOString();
    const endTimeISO_UTC = endDateLocal.toISOString();
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roomId: room?.id,
          startTime: startTimeISO_UTC,
          endTime: endTimeISO_UTC,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error al crear la reserva.");
      setSuccess(
        '¡Reserva solicitada con éxito! Revisa "Mis Reservas" para ver el estado.'
      );
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al cargar las salas.");
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];
  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Cargando sala...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <Link
          href="/rooms"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={18} /> Volver a la lista de salas
        </Link>
        {room ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={room.image_url}
                  alt={room.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <div className="flex items-center gap-2 text-md text-gray-500 mt-2">
                <MapPin size={16} /> <span>{room.location}</span>
              </div>
              <div className="flex items-center gap-2 text-md text-gray-500 mt-2">
                <Users size={16} />{" "}
                <span>Capacidad: {room.capacity} personas</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                Equipamiento
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.equipment.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Solicitar Reserva
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Horario laboral: 8:00 AM - 6:00 PM
              </p>
              <form onSubmit={handleReservationSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={today}
                      className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || today}
                      className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm mb-4">{success}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white font-semibold py-3 rounded-md hover:bg-blue-800"
                >
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Error al cargar la sala.</p>
        )}
      </main>
    </div>
  );
}
