"use client";

import React from "react";
import { User, Calendar, AlertTriangle } from "lucide-react";

interface CoordinatorCardProps {
  reservation: {
    id: string;
    user_name: string;
    room_name: string;
    start_time: string;
    end_time: string;
    created_at: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("es-ES", options);
};

export default function CoordinatorCard({
  reservation,
  onApprove,
  onReject,
}: CoordinatorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {reservation.room_name}
          </h3>
          <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <User size={14} /> Solicitado por: {reservation.user_name}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
          <AlertTriangle size={14} /> Pendiente
        </div>
      </div>
      <div className="border-t my-3"></div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <div>
            <p className="font-semibold">Inicio:</p>
            <p className="text-gray-600">
              {formatDate(reservation.start_time)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <div>
            <p className="font-semibold">Fin:</p>
            <p className="text-gray-600">{formatDate(reservation.end_time)}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Solicitado el: {formatDate(reservation.created_at)}
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onApprove(reservation.id)}
          className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Aprobar
        </button>
        <button
          onClick={() => onReject(reservation.id)}
          className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
