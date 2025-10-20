/* Diseño para las tarjetas de las SALAS, Esto nos sirve para la reutilizacion de codigo con las tarjetas */

import React, { JSX } from "react";
import {
  MapPin,
  Users,
  Monitor,
  Projector,
  Clapperboard,
  Mic2,
  SquarePen,
} from "lucide-react";
import Image from "next/image";

// Definimos los tipos de datos que espera el componente
type RoomCardProps = {
  name: string;
  floor: number;
  wing: string;
  capacity: number;
  equipment: string[];
  imageUrl: string;
};

export default function RoomCard({
  name,
  floor,
  wing,
  capacity,
  equipment,
  imageUrl,
}: RoomCardProps) {
  const equipmentIcons: { [key: string]: JSX.Element } = {
    Pantalla: <Monitor size={14} />,
    Proyector: <Projector size={14} />,
    Videollamada: <Clapperboard size={14} />,
    Pizarra: <SquarePen size={14} />,
    Audio: <Mic2 size={14} />,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={`Imagen de ${name}`}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <button className="text-gray-400 hover:text-blue-600">
            <SquarePen size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <MapPin size={14} />
          <span>
            Piso {floor} - Ala {wing}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Users size={14} />
          <span>Capacidad: {capacity} personas</span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Equipamiento:
          </h4>
          <div className="flex flex-wrap gap-2">
            {equipment.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {equipmentIcons[item]}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <button className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors">
          Ver Detalles y Reservar
        </button>
      </div>
    </div>
  );
}
