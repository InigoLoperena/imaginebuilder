import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const mustChange = (user.user_metadata as { must_change_password?: boolean })?.must_change_password;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (p1.length < 6) return toast.error("Mínimo 6 caracteres");
    if (p1 !== p2) return toast.error("Las contraseñas no coinciden");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({
      password: p1,
      data: { ...user.user_metadata, must_change_password: false },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Contraseña actualizada");
    navigate("/app", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Cambiar contraseña</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mustChange
            ? "Por seguridad, establece una nueva contraseña que solo tú conozcas."
            : "Introduce tu nueva contraseña."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="p1">Nueva contraseña</Label>
            <Input id="p1" type="password" value={p1} onChange={(e) => setP1(e.target.value)} required autoFocus />
          </div>
          <div>
            <Label htmlFor="p2">Repetir contraseña</Label>
            <Input id="p2" type="password" value={p2} onChange={(e) => setP2(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
