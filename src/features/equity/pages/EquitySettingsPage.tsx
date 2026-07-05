import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/features/projects/api";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PolicyForm } from "@/features/equity/components/PolicyForm";
import { PolicyList } from "@/features/equity/components/PolicyList";
import { SimulatorDialog } from "@/features/equity/components/SimulatorDialog";
import { useProfiles } from "@/features/ownership/api";
import { useProjectPolicies, useUpdateProjectEquityModel } from "@/features/equity/api";
import { Button } from "@/components/ui/button";

export default function EquitySettingsPage() {
  const { data: projects = [] } = useProjects();
  const { data: profiles = [] } = useProfiles();
  const [projectId, setProjectId] = useState<string>("");
  const { data: policies = [] } = useProjectPolicies(projectId || undefined);
  const updateModel = useUpdateProjectEquityModel();

  const project = projects.find((p) => p.id === projectId);
  const nameOf = (uid: string) => {
    const p = profiles.find((x) => x.id === uid);
    return p?.full_name || p?.email || uid.slice(0, 8);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ajustes de equity</h1>
          <p className="text-sm text-muted-foreground">Configura el reparto de equity para cada proyecto.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/como-funciona">¿Cómo funciona?</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/Venturebuilder">← Volver al panel</Link>
          </Button>
        </div>
      </div>

      <Card className="p-5 max-w-md">
        <Label>Proyecto</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger><SelectValue placeholder="Elige un proyecto" /></SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {project && (
        <>
          <Card className="p-5 flex items-center gap-4">
            <ProjectLogo path={project.logo_url} name={project.name} size={56} />
            <div className="flex-1">
              <div className="font-semibold">{project.name}</div>
              <div className="text-xs text-muted-foreground">Modelo de equity activo</div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={project.equity_model}
                onValueChange={(v) => updateModel.mutate({ project_id: project.id, model: v as "dynamic_pool" | "fixed_conversion" })}
              >
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dynamic_pool">Pool Dinámico de Horas</SelectItem>
                  <SelectItem value="fixed_conversion">Conversión Fija de Horas</SelectItem>
                </SelectContent>
              </Select>
              <SimulatorDialog projectId={project.id} nameOf={nameOf} />
              <Button variant="outline" asChild size="sm">
                <Link to={`/app/projects/${project.id}/equity`}>Panel</Link>
              </Button>
            </div>
          </Card>

          <PolicyList policies={policies} />
          <PolicyForm projectId={project.id} />
        </>
      )}
    </div>
  );
}
