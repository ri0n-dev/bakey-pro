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
        const { blocks } = body;

        if (!Array.isArray(blocks)) {
            return new Response(JSON.stringify({ error: "blocks must be an array" }), { status: 400 });
        }

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (typeof block.id !== "string" || block.id.trim() === "") {
                return new Response(JSON.stringify({ error: `Empty or missing 'id' in blocks[${i}]` }), { status: 400 });
            }

            if (!Array.isArray(block.content)) {
                return new Response(JSON.stringify({ error: `Missing or invalid 'content' in blocks[${i}]` }), { status: 400 });
            }
            if (typeof block.lock !== "string") {
                return new Response(JSON.stringify({ error: `Missing or invalid 'lock' in blocks[${i}]` }), { status: 400 });
            }

            if (block.component && typeof block.component !== "string") {
                return new Response(JSON.stringify({ error: `Invalid 'component' in blocks[${i}]` }), { status: 400 });
            }

            if (block.redirect && typeof block.redirect !== "string") {
                return new Response(JSON.stringify({ error: `Invalid 'redirect' in blocks[${i}]` }), { status: 400 });
            }
        }

        const { error: updateError } = await supabaseWithAuth
            .from("blocks")
            .update({ block: blocks })
            .eq("uid", id);

        if (updateError) {
            console.error("Block update error:", updateError);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "An error occurred while updating your block" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}