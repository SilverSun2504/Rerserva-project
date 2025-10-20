/* PAGINA PRINCIPAL QUE VISUALIZA TODO EL APARTADO DEL DASHBOARD CON AUN SOLO FUNCIONALIDAD DE 
POR EL MOMENTO SALAS */

"use client";

import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import Header from "@/app/components/landing/layout/Header";
import {
  Building,
  CalendarCheck2,
  UserCog,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [roomCount, setRoomCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rooms`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la información de las salas.");
        }
        const rooms = await response.json();
        setRoomCount(rooms.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUserLoading
              ? "Bienvenido..."
              : `Bienvenido, ${user?.fullName || "Invitado"}`}
          </h1>
          <p className="text-gray-500">Departamento de Tecnología</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Salas Disponibles
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {isLoading ? "..." : error ? "!" : roomCount}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total de salas</p>
            </div>
            <Building className="text-gray-300" size={24} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-400 mt-1">Esperando aprobación</p>
            </div>
            <AlertCircle className="text-yellow-400" size={24} />
          </div>
          {/* Card: Aprobadas */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Aprobadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-400 mt-1">Reservas confirmadas</p>
            </div>
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Rechazadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-400 mt-1">No aprobadas</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>

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
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-50 transition-colors">
                <CalendarCheck2 size={20} /> Mis Reservas
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-50 transition-colors">
                <UserCog size={20} /> Panel de Coordinador
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas Reservas
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Tus reservas aprobadas más cercanas
            </p>
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-md">
              <p className="text-gray-500">No tienes reservas próximas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
