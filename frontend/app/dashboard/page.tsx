"use client";

import { useUser } from "@/app/context/UserContext";
import Header from "@/app/components/landing/layout/Header";
import {
  Building,
  CalendarCheck2,
  UserCog,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface UpcomingReservation {
  id: string;
  room_name: string;
  start_time: string;
  end_time: string;
}

const formatDate = (dateString: string) => {
  try {
    const utcDate = new Date(
      dateString.endsWith("Z") ? dateString : dateString + "Z"
    );
    if (isNaN(utcDate.getTime())) throw new Error("Fecha inválida");
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return utcDate.toLocaleString("es-EC", {
      ...options,
      timeZone: "America/Guayaquil",
    });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Fecha inválida";
  }
};

export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [roomCount, setRoomCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [upcomingReservations, setUpcomingReservations] = useState<
    UpcomingReservation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      if (isUserLoading) return;
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const [roomsResponse, statsResponse, upcomingResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/rooms`),
            fetch(`${API_URL}/api/dashboard/stats`),
            fetch(`${API_URL}/api/reservations/upcoming/user/${user.id}`), // <-- Llamada al nuevo endpoint
          ]);
        if (!roomsResponse.ok) throw new Error("Error al cargar salas.");
        const roomsData = await roomsResponse.json();
        setRoomCount(roomsData.length);
        if (!statsResponse.ok) throw new Error("Error al cargar estadísticas.");
        const statsData = await statsResponse.json();
        setPendingCount(statsData.pending);
        setApprovedCount(statsData.approved);
        setRejectedCount(statsData.rejected);
        if (!upcomingResponse.ok)
          throw new Error("Error al cargar próximas reservas.");
        const upcomingData = await upcomingResponse.json();
        setUpcomingReservations(upcomingData);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, isUserLoading]);

  const renderCount = (count: number) => {
    if (isLoading) return "...";
    if (error) return "!";
    return count;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUserLoading
              ? "BIENVENIDO..."
              : `BIENVENIDO, ${user?.fullName || "Invitado"}`}
          </h1>
          <p className="text-gray-500">
            {user?.area_name || "Sin área asignada"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Salas Disponibles
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {renderCount(roomCount)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total de salas</p>
            </div>
            <Building className="text-gray-300" size={24} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {renderCount(pendingCount)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Esperando aprobación</p>
            </div>
            <AlertCircle className="text-yellow-400" size={24} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Aprobadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {renderCount(approvedCount)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Reservas confirmadas</p>
            </div>
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Rechazadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {renderCount(rejectedCount)}
              </p>
              <p className="text-xs text-gray-400 mt-1">No aprobadas</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
        {error && !isLoading && (
          <p className="text-center text-red-500 mb-6">
            Error al cargar datos del dashboard: {error}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Acciones Rápidas
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Gestiona tus reservas y salas
            </p>
            <div className="space-y-3">
              <Link
                href="/rooms"
                className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition-colors"
              >
                <Building size={20} /> Ver Salas Disponibles
              </Link>
              <Link
                href="/reservations"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <CalendarCheck2 size={20} /> Mis Reservas
              </Link>
              {user && user.role === "Admin" && (
                <Link
                  href="/coordinator"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <UserCog size={20} /> Panel de Coordinador
                </Link>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas Reservas
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Tus reservas aprobadas más cercanas
            </p>
            {isLoading ? (
              <p className="text-gray-500 text-center">Cargando...</p>
            ) : upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map((res) => (
                  <div key={res.id} className="border-b pb-3 last:border-b-0">
                    <p className="font-semibold text-gray-800">
                      {res.room_name}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <CalendarClock size={14} />
                      {formatDate(res.start_time)} -{" "}
                      {formatDate(res.end_time).split(", ")[1]}{" "}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-md">
                <p className="text-gray-500">No tienes reservas próximas</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
