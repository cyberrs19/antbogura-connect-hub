import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Identify requesting user (JWT)
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

    const {
      data: { user: requestingUser },
      error: userError,
    } = await anonClient.auth.getUser();

    if (userError || !requestingUser) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return new Response(JSON.stringify({ success: false, error: "Missing targetUserId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get requester role
    const { data: requesterRoleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    const requesterRole = requesterRoleRow?.role || "user";

    // Get target role
    const { data: targetRoleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .single();

    const targetRole = targetRoleRow?.role || "user";

    // Permissions: admin can delete anyone; manager can delete only users
    if (requesterRole === "admin") {
      // ok
    } else if (requesterRole === "manager") {
      if (targetRole !== "user") {
        return new Response(JSON.stringify({ success: false, error: "You cannot delete admin/manager users" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
    } else {
      return new Response(JSON.stringify({ success: false, error: "You do not have permission to delete users" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Prevent self-delete
    if (requestingUser.id === targetUserId) {
      return new Response(JSON.stringify({ success: false, error: "You cannot delete your own account" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Cleanup app tables first (best effort)
    await supabase.from("profiles").delete().eq("user_id", targetUserId);
    await supabase.from("user_roles").delete().eq("user_id", targetUserId);
    await supabase.from("device_sessions").delete().eq("user_id", targetUserId);
    await supabase.from("trusted_devices").delete().eq("user_id", targetUserId);
    await supabase.from("recovery_codes").delete().eq("user_id", targetUserId);

    // Delete auth user (this prevents future logins)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);
    if (deleteError) {
      return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
