import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPER_EMAIL = "inigoloperena@gmail.com";
const SUPER_PASSWORD = "Fosforito31";
const SUPER_NAME = "Íñigo";

const MEMBERS = [
  { name: "Lucas" },
  { name: "Pablo" },
  { name: "Andrea" },
  { name: "Isvara" },
  { name: "Joaquina" },
  { name: "Yessica" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const results: unknown[] = [];

    // Super admin
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const has = (email: string) => existing.users.some((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!has(SUPER_EMAIL)) {
      const { data, error } = await admin.auth.admin.createUser({
        email: SUPER_EMAIL,
        password: SUPER_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: SUPER_NAME },
      });
      if (error) results.push({ email: SUPER_EMAIL, error: error.message });
      else {
        await admin.from("profiles").update({ full_name: SUPER_NAME }).eq("id", data.user.id);
        results.push({ email: SUPER_EMAIL, created: true });
      }
    } else {
      results.push({ email: SUPER_EMAIL, exists: true });
    }

    // Members
    for (const m of MEMBERS) {
      const email = `${m.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@imagine.local`;
      if (has(email)) { results.push({ email, exists: true }); continue; }
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password: "Imagine2025!",
        email_confirm: true,
        user_metadata: { full_name: m.name },
      });
      if (error) { results.push({ email, error: error.message }); continue; }
      await admin.from("profiles").update({ full_name: m.name }).eq("id", data.user.id);
      results.push({ email, created: true });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
