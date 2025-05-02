import { supabase, createSupabaseWithToken } from "@/libs/SupabaseClient";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const authorizationHeader = req.headers.get("authorization");
        const accessToken = authorizationHeader?.replace("Bearer ", "");
        if (!accessToken) {
            return new Response(JSON.stringify({ error: "Unauthorized: Missing access token" }), { status: 401 });
        }

        const supabaseWithAuth = createSupabaseWithToken(accessToken);

        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
        if (userError || !user) {
            console.error("Error fetching user:", userError);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
        }

        const { id } = user;

        const { data: profileData, error: profileError } = await supabaseWithAuth
            .from("profiles")
            .select("*")
            .eq("uid", id)
            .single();

        if (profileError && profileError.code !== "PGRST116") {
            console.error("Profile fetch error:", profileError);
            return new Response(JSON.stringify({ error: "An error occurred while fetching your profile" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: profileData }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}