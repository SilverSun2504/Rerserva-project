"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/landing/layout/Header";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import ReportTable from "@/app/components/landing/reports/ReportTable";
import { Search, X } from "lucide-react";

interface User {
  id: string;
  full_name: string;
}
interface Room {
  id: string;
  name: string;
}

export default function ReportsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  const fetchReservations = async (params = new URLSearchParams()) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/reports/reservations?${params.toString()}`
      );
      if (!response.ok) throw new Error("Error al generar el reporte.");
      const data = await response.json();
      setReservations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoading && (!user || user.role !== "Admin")) {
      router.push("/dashboard");
      return; 
    }

    fetch(`${API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

    fetch(`${API_URL}/api/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
    fetchReservations();
  }, [user, isUserLoading, router]); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedRoom) params.append("roomId", selectedRoom);
    if (selectedUser) params.append("userId", selectedUser);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    fetchReservations(params);
  };

  const clearFilters = () => {
    setSelectedRoom("");
    setSelectedUser("");
    setStartDate("");
    setEndDate("");
    fetchReservations();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500">
            Consulta y filtra el historial de reservas.
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded-lg shadow-sm border mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700"
              >
                Sala
              </label>
              <select
                id="room"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todas las salas</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="user"
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos los usuarios</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Desde
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Hasta
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full py-2 px-3 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400"
            >
              <Search size={18} /> {isLoading ? "Buscando..." : "Buscar"}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X size={18} /> Limpiar
            </button>
          </div>
        </form>
        {error && <p className="text-center text-red-500">{error}</p>}
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando reporte...</p>
        ) : (
          <ReportTable reservations={reservations} />
        )}
      </main>
    </div>
  );
}
