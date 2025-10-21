"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext'; 
import {
  Building2,
  LayoutDashboard,
  Building,
  CalendarCheck2,
  UserCog,
  BarChart2,
  UserCircle2,
  LogOut,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Building2 className="w-6 h-6 text-blue-600" />
            Sistema de Reservas
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/rooms" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Building size={20} /> Salas
          </Link>
          <Link href="/reservations" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <CalendarCheck2 size={20} /> Mis Reservas
          </Link>
          {user && user.role === 'Admin' && (
            <>
              <Link href="/coordinator" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <UserCog size={20} /> Coordinador
              </Link>
              <Link href="/reports" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <BarChart2 size={20} /> Reportes
              </Link>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-600 hover:text-blue-600"
          >
            <UserCircle2 size={28} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-20">
              {user ? (
                <>
                  <div className="p-3 border-b">
                    <p className="font-semibold text-gray-800 truncate">{user.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-1">
                  <Link href="/login" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}