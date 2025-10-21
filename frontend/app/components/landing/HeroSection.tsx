/* -- Layout Principal de presentacion para la vista del LOGIN -- */

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="flex-grow flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Gestiona las Reservas <br /> de Salas de Reuniones
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Sistema completo para solicitar, aprobar y gestionar reservas de
          espacios de reunión en tu empresa
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/registrarse"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/login"
            className="bg-white text-gray-700 px-6 py-3 rounded-md font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
