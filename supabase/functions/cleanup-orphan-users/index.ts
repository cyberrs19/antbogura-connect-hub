import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("Cleanup-orphan-users function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify requesting user is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "No authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requestingUser } } = await anonClient.auth.getUser();
    if (!requestingUser) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check admin role
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    if (roleRow?.role !== "admin") {
      return new Response(JSON.stringify({ success: false, error: "Admin only" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get specific user ID to delete from request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "Missing userId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Deleting orphan user:", userId);

    // Clean up any remaining data
    await supabase.from("profiles").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("device_sessions").delete().eq("user_id", userId);
    await supabase.from("trusted_devices").delete().eq("user_id", userId);
    await supabase.from("recovery_codes").delete().eq("user_id", userId);

    // Delete auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error("Delete error:", deleteError.message);
      return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("Orphan user deleted successfully");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
