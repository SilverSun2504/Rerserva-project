import React from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, XCircle, Calendar } from "lucide-react";

interface ReservationCardProps {
  roomName: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  status: "Pendiente" | "Aprobada" | "Rechazada" | string;
}

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

const statusStyles = {
  Pendiente: {
    icon: <AlertCircle size={18} className="text-yellow-500" />,
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  Aprobada: {
    icon: <CheckCircle2 size={18} className="text-green-500" />,
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Rechazada: {
    icon: <XCircle size={18} className="text-red-500" />,
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export default function ReservationCard({
  roomName,
  imageUrl,
  startTime,
  endTime,
  status,
}: ReservationCardProps) {
  const style =
    statusStyles[status as keyof typeof statusStyles] || statusStyles.Pendiente;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
        <Image
          src={imageUrl}
          alt={`Imagen de ${roomName}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{roomName}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Calendar size={14} />
          <span>{formatDate(startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} className="opacity-0" />
          <span>{formatDate(endTime)}</span>
        </div>
        <div
          className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text} border ${style.border}`}
        >
          {style.icon}
          {status}
        </div>
      </div>
    </div>
  );
}
