import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("Delete-user function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    console.log("Creating service role client");
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Identify requesting user (JWT)
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    console.log("Auth header value:", authHeader ? authHeader.substring(0, 50) + "..." : "none");
    
    if (!authHeader) {
      console.log("No authorization header");
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
      console.log("User error:", userError?.message);
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("Requesting user:", requestingUser.id);

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      console.log("Missing targetUserId");
      return new Response(JSON.stringify({ success: false, error: "Missing targetUserId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Target user to delete:", targetUserId);

    // Get requester role
    const { data: requesterRoleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    const requesterRole = requesterRoleRow?.role || "user";
    console.log("Requester role:", requesterRole);

    // Get target role
    const { data: targetRoleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .single();

    const targetRole = targetRoleRow?.role || "user";
    console.log("Target role:", targetRole);

    // Permissions: admin can delete anyone; manager can delete only users
    if (requesterRole === "admin") {
      console.log("Admin permission granted");
    } else if (requesterRole === "manager") {
      if (targetRole !== "user") {
        console.log("Manager cannot delete admin/manager");
        return new Response(JSON.stringify({ success: false, error: "You cannot delete admin/manager users" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
    } else {
      console.log("Permission denied for role:", requesterRole);
      return new Response(JSON.stringify({ success: false, error: "You do not have permission to delete users" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Prevent self-delete
    if (requestingUser.id === targetUserId) {
      console.log("Self-delete attempted");
      return new Response(JSON.stringify({ success: false, error: "You cannot delete your own account" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Cleanup app tables first (best effort)
    console.log("Cleaning up profiles...");
    const { error: profileError } = await supabase.from("profiles").delete().eq("user_id", targetUserId);
    if (profileError) console.log("Profile delete error:", profileError.message);

    console.log("Cleaning up user_roles...");
    const { error: rolesError } = await supabase.from("user_roles").delete().eq("user_id", targetUserId);
    if (rolesError) console.log("Roles delete error:", rolesError.message);

    console.log("Cleaning up device_sessions...");
    const { error: sessionsError } = await supabase.from("device_sessions").delete().eq("user_id", targetUserId);
    if (sessionsError) console.log("Sessions delete error:", sessionsError.message);

    console.log("Cleaning up trusted_devices...");
    const { error: devicesError } = await supabase.from("trusted_devices").delete().eq("user_id", targetUserId);
    if (devicesError) console.log("Devices delete error:", devicesError.message);

    console.log("Cleaning up recovery_codes...");
    const { error: codesError } = await supabase.from("recovery_codes").delete().eq("user_id", targetUserId);
    if (codesError) console.log("Codes delete error:", codesError.message);

    // Delete auth user (this prevents future logins)
    console.log("Deleting auth user...");
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);
    if (deleteError) {
      console.log("Auth delete error:", deleteError.message);
      return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("User deleted successfully:", targetUserId);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
