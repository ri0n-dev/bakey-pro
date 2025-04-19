import { supabase, createSupabaseWithToken } from "@/libs/supabaseClient";
import { error } from "console";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();

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
        const { username } = body;

        if (!username) {
            return new Response(JSON.stringify({ error: "Missing Username" }), { status: 400 })
        }

        const { error: updateError } = await supabaseWithAuth
            .from("profiles")
            .update({ username })
            .eq("uid", id)

        if (updateError) {
            console.error("Profile update error:", updateError);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "An error occurred while updating your profile" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}