import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function mustChange(user: { user_metadata?: Record<string, unknown> } | null) {
  return !!(user?.user_metadata as { must_change_password?: boolean } | undefined)?.must_change_password;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (mustChange(user) && location.pathname !== "/app/cambiar-contrasena") {
    return <Navigate to="/app/cambiar-contrasena" replace />;
  }
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (mustChange(user)) return <Navigate to="/app/cambiar-contrasena" replace />;
  if (!isAdmin) return <Navigate to="/app" replace />;
  return <>{children}</>;
}
