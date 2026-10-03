import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { identifier } = await req.json();
    if (typeof identifier !== "string") return json({ email: null }, 200);

    const value = identifier.trim();
    if (value.length < 2 || value.length > 120) return json({ email: null }, 200);

    if (value.includes("@")) return json({ email: value.toLowerCase() });

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return json({ email: null }, 500);

    const admin = createClient(url, serviceKey);
    const escaped = value.replace(/[\\%_]/g, (character) => `\\${character}`);
    const { data, error } = await admin
      .from("profiles")
      .select("email")
      .ilike("full_name", escaped)
      .limit(2);

    if (error || !data || data.length !== 1 || !data[0]?.email) return json({ email: null });
    return json({ email: data[0].email });
  } catch (error) {
    console.error("resolve-login error", error);
    return json({ email: null });
  }
});
