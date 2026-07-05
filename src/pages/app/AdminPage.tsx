import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjects, useUpsertProject, useDeleteProject, uploadProjectLogo, Project } from "@/features/projects/api";
import { useProfiles, useProjectFixed, useSetFixed, useParticipations, useParticipationHistory, useAddMemberWithDilution, Profile, Participation } from "@/features/ownership/api";
import { useAllEntries, useDeleteEntry } from "@/features/timesheet/api";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects = [] } = useProjects();
  const { data: profiles = [] } = useProfiles();
  const { data: allEntries = [] } = useAllEntries();
  const delEntry = useDeleteEntry();
  const [selectedProject, setSelectedProject] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-semibold">Admin · Venture Builder</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/app">App</Link></Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/login"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ProjectsSection projects={projects} />
        <UsersSection />
        <FixedSection projects={projects} selected={selectedProject} setSelected={setSelectedProject} />
        <DilutionSection projects={projects} />
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Todos los registros de tiempo</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Miembro</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEntries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.work_date}</TableCell>
                  <TableCell>{projects.find((p) => p.id === e.project_id)?.name ?? "—"}</TableCell>
                  <TableCell>{profiles.find((p) => p.id === e.user_id)?.full_name || e.user_id.slice(0, 8)}</TableCell>
                  <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                  <TableCell className="max-w-xs truncate">{e.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => delEntry.mutate(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  const upsert = useUpsertProject();
  const del = useDeleteProject();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [deck, setDeck] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const openNew = () => {
    setEditing(null); setName(""); setWebsite(""); setDeck(""); setDesc(""); setFile(null); setOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setWebsite(p.website_url ?? "");
    setDeck(p.pitch_deck_url ?? "");
    setDesc(p.description ?? "");
    setFile(null);
    setOpen(true);
  };

  const save = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setBusy(true);
    try {
      let logo_url: string | null | undefined = editing?.logo_url ?? null;
      if (file) logo_url = await uploadProjectLogo(file);
      await upsert.mutateAsync({
        id: editing?.id,
        name: name.trim(),
        logo_url,
        website_url: website.trim() || null,
        pitch_deck_url: deck.trim() || null,
        description: desc.trim() || null,
      });
      toast.success("Guardado");
      setOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Proyectos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nuevo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar" : "Nuevo"} proyecto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Logo</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
              <div><Label>Web del proyecto</Label><Input type="url" placeholder="https://…" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
              <div><Label>URL del pitch deck</Label><Input type="url" placeholder="https://…" value={deck} onChange={(e) => setDeck(e.target.value)} /></div>
              <div><Label>Descripción (landing)</Label><Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
              <Button onClick={save} disabled={busy} className="w-full">{busy ? "Guardando…" : "Guardar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((p) => (
          <Card key={p.id} className="p-4 flex items-center gap-3">
            <ProjectLogo path={p.logo_url} name={p.name} size={48} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm(`¿Eliminar "${p.name}"? Se borrarán sus horas y asignaciones.`)) del.mutate(p.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}

function UsersSection() {
  const { data: profiles = [] } = useProfiles();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const call = async (action: string, payload: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { action, ...payload },
    });
    if (error) throw error;
    if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
    return data;
  };

  const openNew = () => { setEditingId(null); setEmail(""); setPassword(""); setName(""); setOpen(true); };
  const openEdit = (p: { id: string; full_name: string | null; email: string | null }) => {
    setEditingId(p.id); setEmail(p.email ?? ""); setPassword(""); setName(p.full_name ?? ""); setOpen(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      if (editingId) {
        await call("update", { user_id: editingId, email: email || undefined, password: password || undefined, full_name: name });
      } else {
        if (!email || !password) throw new Error("Email y contraseña requeridos");
        await call("create", { email, password, full_name: name });
      }
      toast.success("Guardado");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["profiles"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await call("delete", { user_id: id });
      toast.success("Eliminado");
      qc.invalidateQueries({ queryKey: ["profiles"] });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Usuarios</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nuevo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nuevo"} usuario</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div>
                <Label>Contraseña {editingId && "(dejar vacío para no cambiar)"}</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={save} disabled={busy} className="w-full">{busy ? "Guardando…" : "Guardar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead></TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.full_name}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function FixedSection({
  projects,
  selected,
  setSelected,
}: {
  projects: Project[];
  selected: string;
  setSelected: (v: string) => void;
}) {
  const { data: profiles = [] } = useProfiles();
  const { data: fixed = [] } = useProjectFixed(selected || undefined);
  const setFixed = useSetFixed();
  const total = fixed.reduce((s, f) => s + Number(f.percentage), 0);

  return (
    <Card className="p-5">
      <h2 className="font-semibold mb-4">Propiedad fija por proyecto</h2>
      <div className="mb-4 max-w-sm">
        <Label>Proyecto</Label>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger><SelectValue placeholder="Elegir proyecto" /></SelectTrigger>
          <SelectContent>
            {projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      {selected && (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            Suma actual: <strong>{total.toFixed(2)}%</strong> · Pool variable: <strong>{Math.max(0, 100 - total).toFixed(2)}%</strong>
          </p>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Miembro</TableHead><TableHead className="w-40">% fijo</TableHead><TableHead></TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => {
                const current = fixed.find((f) => f.user_id === p.id);
                return (
                  <FixedRow
                    key={p.id}
                    name={p.full_name || p.email || ""}
                    initial={current?.percentage ?? 0}
                    onSave={(v) => setFixed.mutate({ project_id: selected, user_id: p.id, percentage: v })}
                  />
                );
              })}
            </TableBody>
          </Table>

          
        </>
      )}
    </Card>
  );
}

function FixedRow({ name, initial, onSave }: { name: string; initial: number; onSave: (v: number) => void }) {
  const [val, setVal] = useState(String(initial));
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Input type="number" step="0.1" min="0" max="100" value={val} onChange={(e) => setVal(e.target.value)} />
      </TableCell>
      <TableCell>
        <Button size="sm" onClick={() => onSave(parseFloat(val) || 0)}>Guardar</Button>
      </TableCell>
    </TableRow>
  );
}
