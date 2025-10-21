"use client";

import React from 'react';

const formatDate = (dateString: string) => {
  try {
    const utcDate = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    if (isNaN(utcDate.getTime())) {
      throw new Error("Fecha inválida recibida del servidor");
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    };
    return utcDate.toLocaleString('es-EC', { ...options, timeZone: 'America/Guayaquil' });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Fecha inválida";
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Aprobada: 'bg-green-100 text-green-700',
    Rechazada: 'bg-red-100 text-red-700',
    Pendiente: 'bg-yellow-100 text-yellow-700',
    Cancelada: 'bg-gray-100 text-gray-700',
  };
  const style = styles[status as keyof typeof styles] || styles.Cancelada;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

export default function ReportTable({ reservations }: { reservations: any[] }) {
  if (reservations.length === 0) {
    return <p className="text-center text-gray-500">No se encontraron reservas con los filtros seleccionados.</p>;
  }

  return (
    <div className="bg-white shadow-sm border rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sala</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((res) => (
            <tr key={res.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.room_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.user_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.area_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(res.start_time)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(res.end_time)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={res.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}