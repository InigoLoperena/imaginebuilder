import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: list, error: le } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (le) return new Response(JSON.stringify({ error: le.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const user = list.users.find(u => (u.email ?? "").toLowerCase() === "inigoloperena@gmail.com");
  if (!user) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const { error } = await admin.auth.admin.updateUserById(user.id, { password: "Fosforito31", email_confirm: true });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ ok: true, id: user.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
