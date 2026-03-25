"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function Topbar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">Panel de control</h1>
        <p className="topbar-subtitle">Monitoreo glucémico en tiempo real cercano</p>
      </div>
      <button type="button" onClick={handleLogout} className="ghost-button">
        Cerrar sesión
      </button>
    </header>
  );
}

