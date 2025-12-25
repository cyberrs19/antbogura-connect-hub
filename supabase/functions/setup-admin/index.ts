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
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "admin@admin.com";
    const adminPassword = "admin123";

    // Check if admin user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(
      (u) => u.email === adminEmail
    );

    let userId: string;

    if (existingAdmin) {
      userId = existingAdmin.id;
      console.log("Admin user already exists:", userId);
    } else {
      // Create admin user
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
        });

      if (createError) {
        throw new Error(`Failed to create admin user: ${createError.message}`);
      }

      userId = newUser.user.id;
      console.log("Admin user created:", userId);
    }

    // Check if admin role already assigned
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (!existingRole) {
      // Assign admin role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });

      if (roleError) {
        throw new Error(`Failed to assign admin role: ${roleError.message}`);
      }
      console.log("Admin role assigned");
    } else {
      console.log("Admin role already assigned");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user setup complete",
        email: adminEmail,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Setup error:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
