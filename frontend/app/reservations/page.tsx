"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/landing/layout/Header";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { Plus, CalendarX } from "lucide-react";
import ReservationCard from "@/app/components/landing/reservations/ReservationCard";

interface Reservation {
  id: string;
  room_name: string;
  image_url: string;
  start_time: string;
  end_time: string;
  status: string;
}

export default function ReservationsPage() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    if (user?.id) {
      const fetchReservations = async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/reservations/user/${user.id}`
          );
          if (!response.ok) {
            throw new Error("No se pudieron cargar tus reservas.");
          }
          const data = await response.json();
          console.log('Datos recibidos del backend:', data);
          setReservations(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReservations();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  let content;
  if (isLoading) {
    content = (
      <p className="text-center text-gray-500">Cargando tus reservas...</p>
    );
  } else if (error) {
    content = <p className="text-center text-red-500">{error}</p>;
  } else if (reservations.length === 0) {
    content = (
      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-md">
        <CalendarX size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-800">
          No tienes reservas
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Parece que aún no has reservado ninguna sala.
        </p>
        <Link
          href="/rooms"
          className="mt-6 inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          <Plus size={20} />
          Reservar una Sala
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            roomName={reservation.room_name}
            imageUrl={reservation.image_url}
            startTime={reservation.start_time}
            endTime={reservation.end_time}
            status={reservation.status}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
            <p className="text-gray-500">
              Aquí puedes ver el estado de todas tus reservas.
            </p>
          </div>
        </div>
        {content}
      </main>
    </div>
  );
}
