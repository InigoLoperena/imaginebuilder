import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Play, Square, Pencil, Trash2, Save, X, CalendarClock, Wallet, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const EMPLOYEES = ["Andrea", "Isvara", "Joaquina", "Pablo", "Lucas"] as const;
type Employee = (typeof EMPLOYEES)[number];

interface TimeEntry {
  id: string;
  employee_name: string;
  start_time: string;
  end_time: string | null;
  total_minutes: number | null;
  description: string | null;
  entry_source?: string | null;
}

interface PaymentMethod {
  id?: string;
  employee_name: string;
  global_username: string | null;
  bank_ars: string | null;
  bank_usd: string | null;
}

const PaymentMethodForm = ({ name }: { name: Employee }) => {
  const [pm, setPm] = useState<PaymentMethod>({
    employee_name: name,
    global_username: "",
    bank_ars: "",
    bank_usd: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("employee_payment_methods")
        .select("*")
        .eq("employee_name", name)
        .maybeSingle();
      if (data) setPm(data as PaymentMethod);
    })();
  }, [name]);

  const save = async () => {
    setLoading(true);
    const payload = {
      employee_name: name,
      global_username: pm.global_username || null,
      bank_ars: pm.bank_ars || null,
      bank_usd: pm.bank_usd || null,
    };
    const { error } = await supabase
      .from("employee_payment_methods")
      .upsert(payload, { onConflict: "employee_name" });
    setLoading(false);
    if (error) {
      toast.error("Error guardando método de pago");
      return;
    }
    toast.success("Método de pago guardado");
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-zinc-950 border-2 border-[#a2c041]/40">
      <div className="flex items-center gap-2 text-[#b4fa74] font-permanent-marker text-xl">
        <Wallet className="w-5 h-5" /> Método de pago
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-[#b4fa74] text-xs font-permanent-marker">
            Usuario Global
          </label>
          <Input
            placeholder="usuario o email"
            value={pm.global_username || ""}
            onChange={(e) =>
              setPm({ ...pm, global_username: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
        </div>
        <div>
          <label className="text-[#b4fa74] text-xs font-permanent-marker">
            Transferencia en Pesos (ARS)
          </label>
          <Input
            placeholder="CBU / Alias / cuenta"
            value={pm.bank_ars || ""}
            onChange={(e) => setPm({ ...pm, bank_ars: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
        </div>
        <div>
          <label className="text-[#b4fa74] text-xs font-permanent-marker">
            Transferencia en Dólares (USD)
          </label>
          <Input
            placeholder="cuenta / IBAN / SWIFT"
            value={pm.bank_usd || ""}
            onChange={(e) => setPm({ ...pm, bank_usd: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
        </div>
      </div>
      <Button
        onClick={save}
        disabled={loading}
        className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
      >
        <Save className="mr-1" /> Guardar método de pago
      </Button>
    </div>
  );
};

const STORAGE_KEY = "greenhunt_active_timers";

type ActiveTimers = Partial<Record<Employee, { id: string; start: string }>>;

const loadActive = (): ActiveTimers => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveActive = (a: ActiveTimers) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));

const formatDuration = (minutes: number | null) => {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// Argentina timezone (UTC-3, no DST). All time displays and inputs use this zone.
const AR_TZ = "America/Argentina/Buenos_Aires";
const AR_OFFSET_MIN = -180; // UTC-3

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: AR_TZ,
  });
};

// Get the wall-clock parts of an ISO timestamp as seen in Argentina
const getARParts = (d: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: AR_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "00";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") === "24" ? "00" : get("hour"),
    minute: get("minute"),
  };
};

// Convert ISO UTC string to a value usable by <input type="datetime-local"> in Argentina time
const isoToLocalInput = (iso: string | null): string => {
  if (!iso) return "";
  const p = getARParts(new Date(iso));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};

// Convert a datetime-local string (interpreted as Argentina time) to a UTC ISO string
const localInputToISO = (local: string): string => {
  // local is like "2026-04-21T15:00"; treat as Argentina wall time (UTC-3)
  const [date, time] = local.split("T");
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  // UTC equivalent = AR time - offset (offset is -180, so subtract -180 = add 180 minutes)
  const utcMs = Date.UTC(y, mo - 1, d, h, mi) - AR_OFFSET_MIN * 60_000;
  return new Date(utcMs).toISOString();
};

// Monday 00:00 (Argentina time) of the current week, returned as a UTC timestamp (ms)
const startOfCurrentWeek = (): Date => {
  const now = new Date();
  const p = getARParts(now);
  // Determine weekday in Argentina
  const arNoon = new Date(`${p.year}-${p.month}-${p.day}T12:00:00-03:00`);
  const day = arNoon.getUTCDay(); // 0=Sun..6=Sat (same in any tz at noon)
  const diff = day === 0 ? -6 : 1 - day;
  const mondayDay = new Date(arNoon);
  mondayDay.setUTCDate(mondayDay.getUTCDate() + diff);
  const mp = getARParts(mondayDay);
  // Monday 00:00 AR -> UTC
  return new Date(`${mp.year}-${mp.month}-${mp.day}T00:00:00-03:00`);
};

const sumWeekMinutes = (entries: TimeEntry[]): number => {
  const monday = startOfCurrentWeek().getTime();
  const nextMonday = monday + 7 * 24 * 60 * 60 * 1000;
  return entries.reduce((acc, e) => {
    if (!e.start_time || e.total_minutes == null) return acc;
    const t = new Date(e.start_time).getTime();
    if (t >= monday && t < nextMonday) return acc + e.total_minutes;
    return acc;
  }, 0);
};

const sumPreviousWeeksMinutes = (entries: TimeEntry[]): number => {
  const monday = startOfCurrentWeek().getTime();
  return entries.reduce((acc, e) => {
    if (!e.start_time || e.total_minutes == null) return acc;
    const t = new Date(e.start_time).getTime();
    if (t < monday) return acc + e.total_minutes;
    return acc;
  }, 0);
};

const groupPreviousWeeks = (
  entries: TimeEntry[]
): { start: Date; end: Date; minutes: number }[] => {
  const currentMonday = startOfCurrentWeek().getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const buckets = new Map<number, number>();
  for (const e of entries) {
    if (!e.start_time || e.total_minutes == null) continue;
    const t = new Date(e.start_time).getTime();
    if (t >= currentMonday) continue;
    const weeksAgo = Math.floor((currentMonday - t) / weekMs) + 1;
    const weekStart = currentMonday - weeksAgo * weekMs;
    buckets.set(weekStart, (buckets.get(weekStart) || 0) + e.total_minutes);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([start, minutes]) => ({
      start: new Date(start),
      end: new Date(start + weekMs - 1),
      minutes,
    }));
};

const formatARDate = (d: Date): string => {
  const p = getARParts(d);
  return `${p.day}/${p.month}`;
};

const EmployeeSection = ({
  name,
  entries,
  active,
  onStart,
  onStop,
  onUpdate,
  onDelete,
  elapsed,
}: {
  name: Employee;
  entries: TimeEntry[];
  active: { id: string; start: string } | undefined;
  onStart: (name: Employee) => void;
  onStop: (name: Employee) => void;
  onUpdate: (id: string, patch: Partial<TimeEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  elapsed: number;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const beginEdit = (e: TimeEntry) => {
    setEditingId(e.id);
    setEditStart(isoToLocalInput(e.start_time));
    setEditEnd(isoToLocalInput(e.end_time));
    setEditDesc(e.description || "");
  };

  const saveEdit = async (id: string) => {
    const startISO = localInputToISO(editStart);
    const endISO = editEnd ? localInputToISO(editEnd) : null;
    const totalMinutes = endISO
      ? Math.max(
          0,
          Math.round(
            (new Date(endISO).getTime() - new Date(startISO).getTime()) / 60000
          )
        )
      : null;
    await onUpdate(id, {
      start_time: startISO,
      end_time: endISO,
      total_minutes: totalMinutes,
      description: editDesc,
      entry_source: "manual",
    });
    setEditingId(null);
  };

  const handleStop = async () => {
    onStop(name);
  };

  const handleStart = () => {
    onStart(name);
    setNewDesc("");
  };

  // When stopping we want to attach a description — handled via inline edit after stop.
  // But to make it simpler, we update description if provided right when stopping:
  const handleStopWithDesc = async () => {
    if (!active) return;
    const id = active.id;
    const endISO = new Date().toISOString();
    const totalMinutes = Math.max(
      0,
      Math.round(
        (new Date(endISO).getTime() - new Date(active.start).getTime()) / 60000
      )
    );
    await onUpdate(id, {
      end_time: endISO,
      total_minutes: totalMinutes,
      description: newDesc || null,
    });
    onStop(name);
    setNewDesc("");
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle
          className="font-permanent-marker text-3xl"
          style={{ color: "#b4fa74" }}
        >
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentMethodForm name={name} />
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {!active ? (
            <Button
              onClick={handleStart}
              className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
            >
              <Play className="mr-1" /> Iniciar contador
            </Button>
          ) : (
            <>
              <div className="text-[#b4fa74] font-mono text-lg">
                ⏱ {Math.floor(elapsed / 60)}h {elapsed % 60}m corriendo
              </div>
              <Input
                placeholder="Descripción del trabajo"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white max-w-md"
              />
              <Button
                onClick={handleStopWithDesc}
                variant="destructive"
                className="font-permanent-marker"
              >
                <Square className="mr-1" /> Detener contador
              </Button>
            </>
          )}
        </div>

        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="w-full flex items-center justify-between gap-2 p-3 rounded-lg bg-zinc-950 border-2 border-[#a2c041]/40 hover:border-[#a2c041] transition-colors group">
            <div className="flex items-center gap-2 text-[#b4fa74] font-permanent-marker text-lg">
              <CalendarClock className="w-5 h-5" />
              Registro de horarios ({entries.length})
            </div>
            <ChevronDown className="w-5 h-5 text-[#b4fa74] transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-300">Inicio</TableHead>
                    <TableHead className="text-zinc-300">Fin</TableHead>
                    <TableHead className="text-zinc-300">Duración</TableHead>
                    <TableHead className="text-zinc-300">Descripción</TableHead>
                    <TableHead className="text-zinc-300 w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 && (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-zinc-500 text-center">
                        Sin registros aún.
                      </TableCell>
                    </TableRow>
                  )}
                  {entries.map((e) =>
                    editingId === e.id ? (
                      <TableRow key={e.id} className="border-zinc-800">
                        <TableCell>
                          <label className="flex items-center gap-2 text-[#b4fa74] text-xs font-permanent-marker mb-1">
                            <CalendarClock className="w-4 h-4" /> Entrada
                          </label>
                          <Input
                            type="datetime-local"
                            value={editStart}
                            onChange={(ev) => setEditStart(ev.target.value)}
                            className="bg-zinc-800 border-2 border-[#a2c041] text-white text-base h-12 [color-scheme:dark]"
                          />
                        </TableCell>
                        <TableCell>
                          <label className="flex items-center gap-2 text-[#b4fa74] text-xs font-permanent-marker mb-1">
                            <CalendarClock className="w-4 h-4" /> Salida
                          </label>
                          <Input
                            type="datetime-local"
                            value={editEnd}
                            onChange={(ev) => setEditEnd(ev.target.value)}
                            className="bg-zinc-800 border-2 border-[#a2c041] text-white text-base h-12 [color-scheme:dark]"
                          />
                        </TableCell>
                        <TableCell className="text-zinc-400">auto</TableCell>
                        <TableCell>
                          <Textarea
                            value={editDesc}
                            onChange={(ev) => setEditDesc(ev.target.value)}
                            className="bg-zinc-800 border-2 border-[#a2c041] text-white min-h-[48px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => saveEdit(e.id)}
                              className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
                            >
                              <Save className="mr-1" /> Guardar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                            >
                              <X className="mr-1" /> Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={e.id} className="border-zinc-800 text-white">
                        <TableCell>{formatDateTime(e.start_time)}</TableCell>
                        <TableCell>
                          {e.end_time ? (
                            formatDateTime(e.end_time)
                          ) : (
                            <span className="text-[#b4fa74]">en curso</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDuration(e.total_minutes)}</TableCell>
                        <TableCell className="max-w-xs whitespace-pre-wrap">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <span className="flex-1">{e.description || "—"}</span>
                            {e.entry_source === "manual" ? (
                              <span className="px-2 py-1 rounded-md bg-red-600/20 border border-red-500 text-red-300 text-xs font-permanent-marker whitespace-nowrap">
                                Reg. manual
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-md bg-[#a2c041]/20 border border-[#a2c041] text-[#b4fa74] text-xs font-permanent-marker whitespace-nowrap">
                                Reg. automático
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => beginEdit(e)}
                              className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
                            >
                              <Pencil className="mr-1" /> Editar
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                if (confirm("¿Eliminar este registro?"))
                                  onDelete(e.id);
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>


        {(() => {
          const total = sumWeekMinutes(entries);
          const h = Math.floor(total / 60);
          const m = total % 60;
          const prevWeeks = groupPreviousWeeks(entries);
          return (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-zinc-950 border-2 border-[#a2c041]/40 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[#b4fa74] font-permanent-marker text-xl">
                  Total esta semana (lun–dom)
                </div>
                <div className="text-white font-mono text-2xl">
                  {h}h {m}m
                </div>
              </div>
              {prevWeeks.length > 0 && (
                <div className="p-4 rounded-lg bg-zinc-950 border-2 border-[#a2c041]/20">
                  <div className="text-[#b4fa74] font-permanent-marker text-lg mb-2">
                    Semanas anteriores
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {prevWeeks.map((w) => {
                      const wh = Math.floor(w.minutes / 60);
                      const wm = w.minutes % 60;
                      return (
                        <div
                          key={w.start.getTime()}
                          className="py-2 flex items-center justify-between gap-2 flex-wrap"
                        >
                          <div className="text-white/80 font-mono text-sm">
                            {formatARDate(w.start)} – {formatARDate(w.end)}
                          </div>
                          <div className="text-white font-mono text-lg">
                            {wh}h {wm}m
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
};

const EmpleadosPage = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [active, setActive] = useState<ActiveTimers>(loadActive());
  const [tick, setTick] = useState(0);

  // Block indexing
  useEffect(() => {
    document.title = "Empleados — Interno";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // tick every minute for live elapsed display
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("employee_time_entries")
      .select("*")
      .order("start_time", { ascending: false });
    if (error) {
      toast.error("Error cargando registros");
      return;
    }
    setEntries(data as TimeEntry[]);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleStart = async (name: Employee) => {
    const start = new Date().toISOString();
    const { data, error } = await supabase
      .from("employee_time_entries")
      .insert({ employee_name: name, start_time: start })
      .select()
      .single();
    if (error || !data) {
      toast.error("No se pudo iniciar el contador");
      return;
    }
    const next = { ...active, [name]: { id: data.id, start } };
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success(`Contador iniciado para ${name}`);
  };

  const handleStop = (name: Employee) => {
    const next = { ...active };
    delete next[name];
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success(`Contador detenido para ${name}`);
  };

  const handleUpdate = async (id: string, patch: Partial<TimeEntry>) => {
    const { error } = await supabase
      .from("employee_time_entries")
      .update(patch)
      .eq("id", id);
    if (error) {
      toast.error("Error actualizando registro");
      return;
    }
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("employee_time_entries")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Error eliminando registro");
      return;
    }
    // also clear local active if needed
    const next = { ...active };
    (Object.keys(next) as Employee[]).forEach((k) => {
      if (next[k]?.id === id) delete next[k];
    });
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success("Registro eliminado");
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1
            className="font-permanent-marker text-5xl"
            style={{ color: "#b4fa74" }}
          >
            Registro de Horas
          </h1>
          <p className="text-subtitle-styled text-3xl mt-2">
            sistema interno greenhunt
          </p>
        </header>

        <Tabs defaultValue={EMPLOYEES[0]} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-zinc-900 border border-zinc-800 p-1">
            {EMPLOYEES.map((name) => (
              <TabsTrigger
                key={name}
                value={name}
                className="font-permanent-marker text-base data-[state=active]:bg-[#a2c041] data-[state=active]:text-[#611a5a] data-[state=inactive]:text-[#b4fa74] data-[state=inactive]:shadow-[0_0_8px_rgba(180,250,116,0.35)] flex-1 min-w-[100px]"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          {EMPLOYEES.map((name) => {
            const employeeEntries = entries.filter(
              (e) => e.employee_name === name
            );
            const a = active[name];
            const elapsed = a
              ? Math.max(
                  0,
                  Math.round(
                    (Date.now() - new Date(a.start).getTime()) / 60000
                  )
                )
              : 0;
            void tick;
            return (
              <TabsContent key={name} value={name} className="mt-4">
                <EmployeeSection
                  name={name}
                  entries={employeeEntries}
                  active={a}
                  onStart={handleStart}
                  onStop={handleStop}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  elapsed={elapsed}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};


export default EmpleadosPage;
