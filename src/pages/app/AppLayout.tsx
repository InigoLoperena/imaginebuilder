import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutGrid, Shield, PieChart, HelpCircle, FolderKanban } from "lucide-react";

export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-2 font-semibold shrink-0">
            <LayoutGrid className="h-5 w-5" />
            Venture Builder
          </Link>

          <nav className="flex items-center gap-1 flex-1 justify-center">
            <NavLink to="/app" end className={linkCls}>
              <FolderKanban className="h-4 w-4" /> Proyectos
            </NavLink>
            <NavLink to="/app/me/equity" className={linkCls}>
              <PieChart className="h-4 w-4" /> Mi equity
            </NavLink>
            <NavLink to="/app/como-funciona" className={linkCls}>
              <HelpCircle className="h-4 w-4" /> Cómo funciona
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {(user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? "Usuario"}
            </span>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/Venturebuilder")}>
                <Shield className="h-4 w-4 mr-1" /> Admin
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
