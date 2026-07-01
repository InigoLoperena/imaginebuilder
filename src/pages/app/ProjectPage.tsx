import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useProject } from "@/features/projects/api";
import { useProjectEntries, useAddEntry, useDeleteEntry } from "@/features/timesheet/api";
import { useProjectFixed, useProfiles } from "@/features/ownership/api";
import { calculateOwnership } from "@/features/ownership/calculateOwnership";
import { OwnershipPie } from "@/features/ownership/OwnershipPie";
import { OwnershipTable } from "@/features/ownership/OwnershipTable";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import { Trash2, ArrowLeft } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project } = useProject(id);
  const { data: entries = [] } = useProjectEntries(id);
  const { data: fixed = [] } = useProjectFixed(id);
  const { data: profiles = [] } = useProfiles();
  const addEntry = useAddEntry();
  const delEntry = useDeleteEntry();

  const [hours, setHours] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");

  const rows = useMemo(() => calculateOwnership(profiles, entries, fixed), [profiles, entries, fixed]);
  const totalHours = entries.reduce((s, e) => s + Number(e.hours), 0);
  const myEntries = entries.filter((e) => e.user_id === user?.id);

  const nameOf = (uid: string) => {
    const p = profiles.find((x) => x.id === uid);
    return p?.full_name || p?.email || uid.slice(0, 8);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!h || h <= 0 || !id) return toast.error("Horas inválidas");
    try {
      await addEntry.mutateAsync({ project_id: id, hours: h, work_date: date, description });
      setHours("");
      setDescription("");
      toast.success("Horas registradas");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (!project) return <p>Cargando…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app"><ArrowLeft className="h-4 w-4 mr-1" /> Proyectos</Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <ProjectLogo path={project.logo_url} name={project.name} size={64} />
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Total: {totalHours.toFixed(2)} horas</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Registrar horas</h2>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Horas</Label>
                <Input type="number" step="0.25" min="0" value={hours} onChange={(e) => setHours(e.target.value)} required />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Descripción (opcional)</Label>
              <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit" disabled={addEntry.isPending}>Añadir</Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4">Propiedad</h2>
          <OwnershipPie rows={rows} />
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Tabla de propiedad</h2>
        <OwnershipTable rows={rows} />
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Mis registros</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myEntries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.work_date}</TableCell>
                <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                <TableCell className="max-w-md truncate">{e.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => delEntry.mutate(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {myEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Sin registros</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Timesheet completo</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Miembro</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.work_date}</TableCell>
                <TableCell>{nameOf(e.user_id)}</TableCell>
                <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                <TableCell className="max-w-md truncate">{e.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
