/* Pagina de registro completament funcional con el login y con la base de datos */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Area {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaId, setAreaId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/areas`);
        if (!response.ok) throw new Error("No se pudieron cargar las áreas");
        const data = await response.json();
        setAreas(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const newUser = {
      fullName,
      email,
      password,
      area_id: areaId,
    };
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.error || "No se pudo completar el registro.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={18} /> Volver al Inicio
        </Link>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-500 mt-1">
            Regístrate para empezar a gestionar tus reservas
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Ej: Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Área / Departamento
            </label>
            <select
              id="area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Selecciona tu área...
              </option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2.5 rounded-md font-semibold hover:bg-blue-800 transition-colors"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
