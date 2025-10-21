"use client";

import { useState, useEffect } from 'react';
import Header from '@/app/components/landing/layout/Header';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import CoordinatorCard from '@/app/components/landing/coordinator/CoordinatorCard';

interface PendingReservation {
  id: string;
  user_name: string;
  room_name: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export default function CoordinatorPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const [reservations, setReservations] = useState<PendingReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:3001';

  useEffect(() => {
    if (isUserLoading) return; 
    if (!user || user.role !== 'Admin') {
      router.push('/dashboard'); 
      return;
    }
    if (!user.area_id) {
      setError("Tu cuenta de administrador no está asignada a un área.");
      setIsLoading(false);
      return;
    }
    const fetchPendingReservations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reservations/pending/area/${user.area_id}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar las solicitudes.');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingReservations();
  }, [user, isUserLoading, router]);

  const handleUpdateStatus = async (id: string, status: 'Aprobada' | 'Rechazada') => {
    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la reserva.');
      }
      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };
  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <p className="text-center p-10">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Coordinador</h1>
          <p className="text-gray-500">
            Aprobar o rechazar solicitudes pendientes del área: <span className="font-semibold">{user?.area_name}</span>
          </p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.length === 0 && !isLoading && (
            <p className="text-gray-500 md:col-span-3 text-center">
              No hay solicitudes pendientes para tu área.
            </p>
          )}
          {reservations.map(res => (
            <CoordinatorCard
              key={res.id}
              reservation={res}
              onApprove={() => handleUpdateStatus(res.id, 'Aprobada')}
              onReject={() => handleUpdateStatus(res.id, 'Rechazada')}
            />
          ))}
        </div>
      </main>
    </div>
  );
}