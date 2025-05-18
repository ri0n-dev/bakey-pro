import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        let body: { username?: string } = {};
        try {
            body = await req.json();
        } catch (_) {
            body = {};
        }
        const username = body?.username;

        if (username) {
            const { data: blockData, error: blockError } = await supabase
                .from("blocks")
                .select("block")
                .eq("username", username)
                .single();

            if (blockError) {
                console.error("Username block fetch error:", blockError);
                return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
            }

            if (blockData) {
                const block = blockData.block;
                if (block && typeof block === 'object') {
                    delete block.uid;
                }
            }
            return new NextResponse(JSON.stringify({ success: true, data: blockData?.block || [] }), { status: 200 });
        }

        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            console.error("Error fetching user:", sessionError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
        }

        const { id } = user;

        const { data: blockData, error: blockError } = await supabase
            .from("blocks")
            .select("block")
            .eq("uid", id)
            .single();

        if (blockError) {
            console.error("Block fetch error:", blockError);
            return new NextResponse(JSON.stringify({ error: blockError.message || "An error occurred while fetching your block" }), { status: blockError.code === "PGRST116" ? 404 : 500 });
        }

        if (blockData) {
            const block = blockData.block;
            if (block && typeof block === 'object') {
                delete block.uid;
            }
        }
        return new NextResponse(JSON.stringify({ success: true, data: blockData?.block || [] }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}