import { Link } from "react-router-dom";
import { useProjects } from "@/features/projects/api";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Proyectos</h1>
      {isLoading && <p className="text-muted-foreground">Cargando…</p>}
      {!isLoading && projects?.length === 0 && (
        <Card className="p-6 text-muted-foreground">
          Todavía no hay proyectos. Pide al administrador que cree uno.
        </Card>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((p) => (
          <Link key={p.id} to={`/app/projects/${p.id}`}>
            <Card className="p-5 hover:border-primary transition-colors flex items-center gap-4">
              <ProjectLogo path={p.logo_url} name={p.name} size={56} />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">Ver panel</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
