import { Link } from "react-router-dom";
import { useProjects, useAppSettings } from "@/features/projects/api";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/AuthProvider";

export default function DashboardPage() {
  const { data: projects, isLoading } = useProjects();
  const { data: settings } = useAppSettings();
  const { isAdmin } = useAuth();

  const sectionVisible = settings?.internal_projects_section_visible ?? true;
  const visible = (projects ?? []).filter((p) => isAdmin || p.visible_internal);

  if (!isAdmin && !sectionVisible) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Proyectos</h1>
        <Card className="p-6 text-muted-foreground">
          La sección de proyectos no está disponible por el momento.
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Proyectos</h1>
      {isAdmin && !sectionVisible && (
        <Card className="p-3 mb-4 text-xs text-muted-foreground border-dashed">
          Sección oculta para miembros no-admin (solo tú la ves).
        </Card>
      )}
      {isLoading && <p className="text-muted-foreground">Cargando…</p>}
      {!isLoading && visible.length === 0 && (
        <Card className="p-6 text-muted-foreground">
          Todavía no hay proyectos disponibles.
        </Card>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((p) => (
          <Link key={p.id} to={`/app/projects/${p.id}`}>
            <Card className="p-5 hover:border-primary transition-colors flex items-center gap-4">
              <ProjectLogo path={p.logo_url} name={p.name} size={56} />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  Ver panel
                  {isAdmin && !p.visible_internal && " · oculto a miembros"}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
