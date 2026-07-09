import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const DEFAULT_PASSWORD = "1234";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing auth" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return json({ error: "Invalid session" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const { action, email, password, full_name, user_id } = body ?? {};

    if (action === "create") {
      if (!email) return json({ error: "email required" }, 400);
      const pwd = (password && String(password).length > 0) ? String(password) : DEFAULT_PASSWORD;
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password: pwd,
        email_confirm: true,
        user_metadata: { full_name, must_change_password: true },
      });
      if (error) return json({ error: error.message }, 400);
      if (full_name) {
        await admin.from("profiles").update({ full_name }).eq("id", data.user.id);
      }
      return json({ user: data.user, default_password: pwd });
    }

    if (action === "delete") {
      if (!user_id) return json({ error: "user_id required" }, 400);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "update") {
      if (!user_id) return json({ error: "user_id required" }, 400);
      const patch: Record<string, unknown> = {};
      if (email) patch.email = email;
      if (password) {
        patch.password = password;
        // Admin reset password → force user to change on next login
        patch.user_metadata = { full_name, must_change_password: true };
      } else if (full_name !== undefined) {
        patch.user_metadata = { full_name };
      }
      const { error } = await admin.auth.admin.updateUserById(user_id, patch);
      if (error) return json({ error: error.message }, 400);
      if (full_name !== undefined) {
        await admin.from("profiles").update({ full_name, ...(email ? { email } : {}) }).eq("id", user_id);
      }
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
