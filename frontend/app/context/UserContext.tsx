/* APARTADO PARA QUE SE SIENTA MAS REAL LA SESION Y SE PUEDA VISUALIZAR LOS DATOS DE LA PERSONA EN LA PAGINA WEB
PARA UNA EXPERIENCIA MAS ACORDE */ 

"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  area_id: string | null;
  area_name: string | null;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
