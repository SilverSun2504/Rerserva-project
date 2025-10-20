/* NAVBAR DE INICIO DE SESION */

import { Building2 } from "lucide-react";
import HeroSection from "@/app/components/landing/HeroSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <header className="w-full border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">Sistema de Reservas</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registrarse"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      <HeroSection />
    </div>
  );
}
