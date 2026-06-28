import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut, Upload } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  published: boolean;
  created_at: string;
}

const emptyForm = {
  id: "",
  slug: "",
  title: "",
  description: "",
  content: "",
  cover_image_url: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  published: false,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const SistemaInternoPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [session]);

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin]);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setPosts((data as BlogPost[]) || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (error) toast.error(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
  };

  const beginEdit = (p: BlogPost) => {
    setForm({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      content: p.content || "",
      cover_image_url: p.cover_image_url || "",
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
      meta_keywords: p.meta_keywords || "",
      published: p.published,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm((f) => ({ ...f, cover_image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Imagen subida");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Título y descripción son obligatorios");
      return;
    }
    const slug = (form.slug || slugify(form.title)).trim();
    if (!slug) {
      toast.error("Slug inválido");
      return;
    }
    setSaving(true);
    const payload = {
      slug,
      title: form.title.trim(),
      description: form.description.trim(),
      content: form.content || null,
      cover_image_url: form.cover_image_url || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      meta_keywords: form.meta_keywords || null,
      published: form.published,
    };
    const { error } = editing && form.id
      ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Artículo actualizado" : "Artículo creado");
    resetForm();
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Eliminado");
    loadPosts();
  };

  // ---------- Render ----------

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Sistema Interno</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="pwd">Contraseña</Label>
                <Input
                  id="pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button type="submit" disabled={signingIn} className="w-full">
                {signingIn ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Verificando permisos…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-center">
          Tu cuenta ({session.user.email}) no tiene permisos de administrador.
        </p>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sistema Interno · Blog</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60 hidden sm:inline">
              {session.user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>{editing ? "Editar artículo" : "Nuevo artículo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Título *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        title: e.target.value,
                        slug: editing ? f.slug : slugify(e.target.value),
                      }))
                    }
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label>Slug (URL)</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                    }
                    placeholder="mi-articulo"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <Label>Descripción corta * (también usada como meta description si la dejas vacía)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={2}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <Label>Imagen de portada</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={form.cover_image_url}
                    onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                    placeholder="https://…"
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 cursor-pointer text-sm hover:bg-zinc-700">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Subiendo…" : "Subir"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                {form.cover_image_url && (
                  <img
                    src={form.cover_image_url}
                    alt="preview"
                    className="mt-3 max-h-48 rounded-md border border-zinc-700"
                  />
                )}
              </div>

              <div>
                <Label>Contenido (HTML permitido, opcional)</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={10}
                  className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Meta title (SEO)</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label>Meta keywords (separadas por comas)</Label>
                  <Input
                    value={form.meta_keywords}
                    onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <Label>Meta description (SEO)</Label>
                <Textarea
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  rows={2}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                <Label>Publicado</Label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear artículo"}
                </Button>
                {editing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Artículos ({posts.length})</CardTitle>
            <Button size="sm" variant="outline" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" /> Nuevo
            </Button>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-white/60">Aún no hay artículos.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {posts.map((p) => (
                  <li key={p.id} className="py-3 flex items-center gap-3">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-800 rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{p.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            p.published ? "bg-green-700" : "bg-zinc-700"
                          }`}
                        >
                          {p.published ? "Publicado" : "Borrador"}
                        </span>
                      </div>
                      <div className="text-xs text-white/60 truncate">/blog/{p.slug}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => beginEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SistemaInternoPage;
