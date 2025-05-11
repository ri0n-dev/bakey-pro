import { supabase } from "@/libs/SupabaseClient";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { uid } = body;

        if (!uid) {
            return new Response(JSON.stringify({ error: "Missing UID" }), { status: 400 })
        }

        const { data: blockData, error: blockError } = await supabase
            .from("blocks")
            .select("block")
            .eq("uid", uid)
            .single();

        if (blockError && blockError.code !== "PGRST116") {
            console.error("Block fetch error:", blockError);
            return new Response(JSON.stringify({ error: "An error occurred while fetching your block" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: blockData?.block }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}