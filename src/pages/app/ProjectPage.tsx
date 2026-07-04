import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { useProject } from "@/features/projects/api";
import {
  useProjectEntries,
  useAddEntry,
  useDeleteEntry,
  useUpdateEntry,
  type TimeEntry,
  type EntrySource,
} from "@/features/timesheet/api";
import { useProjectFixed, useProfiles, useProjectOverrides } from "@/features/ownership/api";
import { calculateOwnership } from "@/features/ownership/calculateOwnership";
import { OwnershipPie } from "@/features/ownership/OwnershipPie";
import { OwnershipTable } from "@/features/ownership/OwnershipTable";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import { Trash2, ArrowLeft, Play, Square, Pencil } from "lucide-react";

const TIMER_KEY = (pid: string, uid: string) => `vb_timer_${pid}_${uid}`;

function SourceBadge({ source }: { source: EntrySource }) {
  const map: Record<EntrySource, { label: string; variant: "default" | "secondary" | "outline" }> = {
    tracked: { label: "Cronómetro", variant: "default" },
    edited: { label: "Editado", variant: "secondary" },
    manual: { label: "Manual", variant: "outline" },
  };
  const cfg = map[source] ?? map.tracked;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project } = useProject(id);
  const { data: entries = [] } = useProjectEntries(id);
  const { data: fixed = [] } = useProjectFixed(id);
  const { data: overrides = [] } = useProjectOverrides(id);
  const { data: profiles = [] } = useProfiles();
  const addEntry = useAddEntry();
  const updateEntry = useUpdateEntry();
  const delEntry = useDeleteEntry();

  // Manual entry form
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");

  // Timer
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    const raw = localStorage.getItem(TIMER_KEY(id, user.id));
    if (raw) setStartedAt(parseInt(raw, 10));
  }, [id, user]);

  useEffect(() => {
    if (startedAt) {
      tickRef.current = setInterval(() => setNow(Date.now()), 1000);
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    }
  }, [startedAt]);

  const startTimer = () => {
    if (!id || !user) return;
    const t = Date.now();
    localStorage.setItem(TIMER_KEY(id, user.id), String(t));
    setStartedAt(t);
    setNow(t);
  };

  const stopTimer = async () => {
    if (!startedAt || !id || !user) return;
    const elapsedMs = Date.now() - startedAt;
    const hoursDec = Math.round((elapsedMs / 3_600_000) * 100) / 100;
    if (hoursDec <= 0) {
      toast.error("Tiempo insuficiente");
      return;
    }
    try {
      await addEntry.mutateAsync({
        project_id: id,
        hours: hoursDec,
        work_date: new Date().toISOString().slice(0, 10),
        description: "",
        source: "tracked",
      });
      localStorage.removeItem(TIMER_KEY(id, user.id));
      setStartedAt(null);
      toast.success(`Registradas ${hoursDec.toFixed(2)} h`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const cancelTimer = () => {
    if (!id || !user) return;
    localStorage.removeItem(TIMER_KEY(id, user.id));
    setStartedAt(null);
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!h || h <= 0 || !id) return toast.error("Horas inválidas");
    try {
      await addEntry.mutateAsync({
        project_id: id,
        hours: h,
        work_date: date,
        description,
        source: "manual",
      });
      setHours("");
      setDescription("");
      toast.success("Registro manual añadido");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const rows = useMemo(() => calculateOwnership(profiles, entries, fixed, overrides), [profiles, entries, fixed, overrides]);
  const totalHours = entries.reduce((s, e) => s + Number(e.hours), 0);
  const myEntries = entries.filter((e) => e.user_id === user?.id);

  const nameOf = (uid: string) => {
    const p = profiles.find((x) => x.id === uid);
    return p?.full_name || p?.email || uid.slice(0, 8);
  };

  // Edit dialog state
  const [editing, setEditing] = useState<TimeEntry | null>(null);

  if (!project) return <p>Cargando…</p>;

  const elapsed = startedAt ? now - startedAt : 0;
  const hh = Math.floor(elapsed / 3_600_000);
  const mm = Math.floor((elapsed % 3_600_000) / 60_000);
  const ss = Math.floor((elapsed % 60_000) / 1000);
  const fmt = (n: number) => n.toString().padStart(2, "0");

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
        <Card className="p-5 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">Cronómetro</h2>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-mono tabular-nums">
                {fmt(hh)}:{fmt(mm)}:{fmt(ss)}
              </div>
              {!startedAt ? (
                <Button onClick={startTimer}>
                  <Play className="h-4 w-4 mr-1" /> Iniciar
                </Button>
              ) : (
                <>
                  <Button onClick={stopTimer} disabled={addEntry.isPending}>
                    <Square className="h-4 w-4 mr-1" /> Detener y registrar
                  </Button>
                  <Button variant="ghost" onClick={cancelTimer}>Cancelar</Button>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-3">Registro manual</h2>
            <form onSubmit={submitManual} className="space-y-3">
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
              <Button type="submit" disabled={addEntry.isPending} variant="secondary">
                Añadir manual
              </Button>
            </form>
          </div>
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
              <TableHead>Origen</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myEntries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.work_date}</TableCell>
                <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                <TableCell><SourceBadge source={e.source} /></TableCell>
                <TableCell className="max-w-md truncate">{e.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(e)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => delEntry.mutate(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {myEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">Sin registros</TableCell>
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
              <TableHead>Origen</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.work_date}</TableCell>
                <TableCell>{nameOf(e.user_id)}</TableCell>
                <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                <TableCell><SourceBadge source={e.source} /></TableCell>
                <TableCell className="max-w-md truncate">{e.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar registro</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-3"
              onSubmit={async (ev) => {
                ev.preventDefault();
                const fd = new FormData(ev.currentTarget);
                const h = parseFloat(String(fd.get("hours")));
                const d = String(fd.get("date"));
                const desc = String(fd.get("desc") || "");
                if (!h || h <= 0) return toast.error("Horas inválidas");
                try {
                  await updateEntry.mutateAsync({ id: editing.id, hours: h, work_date: d, description: desc });
                  setEditing(null);
                  toast.success("Registro actualizado");
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Horas</Label>
                  <Input name="hours" type="number" step="0.25" min="0" defaultValue={editing.hours} required />
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input name="date" type="date" defaultValue={editing.work_date} required />
                </div>
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea name="desc" rows={2} defaultValue={editing.description ?? ""} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button type="submit" disabled={updateEntry.isPending}>Guardar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
