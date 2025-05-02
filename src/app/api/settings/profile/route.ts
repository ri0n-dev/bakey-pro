import { supabase, createSupabaseWithToken } from "@/libs/SupabaseClient";

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
        const { name, introduction, location, occupation, contact } = body;

        if (name.length < 1) {
            return new Response(JSON.stringify({ error: "Name must be at least 1 character." }), { status: 400 });
        }

        if (name.length > 50) {
            return new Response(JSON.stringify({ error: "The name has too many characters." }), { status: 400 });
        }

        if (introduction.length > 200) {
            return new Response(JSON.stringify({ error: "The introduction has too many characters." }), { status: 400 });
        }

        if (location.length > 30 || occupation.length > 30 || contact.length > 50) {
            return new Response(JSON.stringify({ error: "Something has too many characters." }), { status: 400 });
        }

        const bioJson = {
            introduction: introduction,
            location: location,
            occupation: occupation,
            contact: contact,
        }

        const { error } = await supabaseWithAuth
            .from("profiles")
            .update({ "name": name, "bio": bioJson })
            .eq("uid", id)
        if (error) {
            console.error("Profile update error:", error);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Update processing error:", error);
        return new Response(JSON.stringify({ error: "Failed to process profile" }), { status: 500 });
    }
}
