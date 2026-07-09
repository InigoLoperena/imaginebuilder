import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const NEW_PASSWORD = "123456";
const SKIP_EMAIL = "inigoloperena@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const results: unknown[] = [];
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      for (const u of data.users) {
        if ((u.email ?? "").toLowerCase() === SKIP_EMAIL) {
          results.push({ email: u.email, skipped: true });
          continue;
        }
        const { error: uErr } = await admin.auth.admin.updateUserById(u.id, {
          password: NEW_PASSWORD,
          user_metadata: { ...(u.user_metadata ?? {}), must_change_password: true },
        });
        results.push({ email: u.email, ok: !uErr, error: uErr?.message });
      }
      if (data.users.length < 200) break;
      page++;
    }

    return new Response(JSON.stringify({ ok: true, count: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
