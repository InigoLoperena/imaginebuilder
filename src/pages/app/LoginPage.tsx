import { useState, FormEvent } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    const to = (location.state as { from?: { pathname: string } })?.from?.pathname || "/app";
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const value = username.trim();
      if (!value) {
        toast.error("Introduce tu nombre de usuario");
        return;
      }
      const { data, error: rErr } = await supabase.functions.invoke("resolve-login", {
        body: { identifier: value },
      });
      if (rErr || !data?.email) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }
      const { error } = await signIn(data.email as string, password);
      if (error) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }
      navigate("/app", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Entrar</h1>
        <p className="text-sm text-muted-foreground mb-6">Venture Builder</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Andrea"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
