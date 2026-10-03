import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MIN_PASSWORD_LENGTH = 12;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function validPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= MIN_PASSWORD_LENGTH;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!url || !serviceKey || !anonKey) return json({ error: "Server configuration error" }, 500);

    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(url, serviceKey);
    const { data: isAdmin, error: roleError } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const { action, email, password, full_name, user_id } = body ?? {};

    if (action === "create") {
      if (typeof email !== "string" || !email.includes("@")) return json({ error: "Valid email required" }, 400);
      if (!validPassword(password)) {
        return json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, 400);
      }

      const { data, error } = await admin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: { full_name: typeof full_name === "string" ? full_name.trim() : "", must_change_password: true },
      });
      if (error) return json({ error: error.message }, 400);

      if (typeof full_name === "string") {
        await admin.from("profiles").update({
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
        }).eq("id", data.user.id);
      }

      return json({ user: { id: data.user.id, email: data.user.email } });
    }

    if (action === "delete") {
      if (typeof user_id !== "string") return json({ error: "user_id required" }, 400);
      if (user_id === userData.user.id) return json({ error: "You cannot delete your own admin account here" }, 400);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "update") {
      if (typeof user_id !== "string") return json({ error: "user_id required" }, 400);
      if (password !== undefined && !validPassword(password)) {
        return json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, 400);
      }

      const { data: existing, error: existingError } = await admin.auth.admin.getUserById(user_id);
      if (existingError || !existing.user) return json({ error: "User not found" }, 404);

      const patch: Record<string, unknown> = {};
      if (typeof email === "string" && email.includes("@")) patch.email = email.trim().toLowerCase();
      if (typeof password === "string") patch.password = password;

      if (typeof full_name === "string" || typeof password === "string") {
        patch.user_metadata = {
          ...(existing.user.user_metadata ?? {}),
          ...(typeof full_name === "string" ? { full_name: full_name.trim() } : {}),
          ...(typeof password === "string" ? { must_change_password: true } : {}),
        };
      }

      const { error } = await admin.auth.admin.updateUserById(user_id, patch);
      if (error) return json({ error: error.message }, 400);

      const profilePatch: Record<string, string> = {};
      if (typeof full_name === "string") profilePatch.full_name = full_name.trim();
      if (typeof email === "string" && email.includes("@")) profilePatch.email = email.trim().toLowerCase();
      if (Object.keys(profilePatch).length > 0) {
        await admin.from("profiles").update(profilePatch).eq("id", user_id);
      }
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("admin-create-user error", error);
    return json({ error: "Unexpected server error" }, 500);
  }
});
