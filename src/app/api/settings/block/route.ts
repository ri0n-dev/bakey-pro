import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();

        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            console.error("Error fetching user:", sessionError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
        }

        const { id } = user;
        const { blocks } = body;

        if (!Array.isArray(blocks)) {
            return new NextResponse(JSON.stringify({ error: "blocks must be an array" }), { status: 400 });
        }

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (typeof block.id !== "string" || block.id.trim() === "") {
                return new NextResponse(JSON.stringify({ error: `Empty or missing 'id' in blocks[${i}]` }), { status: 400 });
            }

            if (!Array.isArray(block.content)) {
                return new NextResponse(JSON.stringify({ error: `Missing or invalid 'content' in blocks[${i}]` }), { status: 400 });
            }
            if (typeof block.lock !== "string") {
                return new NextResponse(JSON.stringify({ error: `Missing or invalid 'lock' in blocks[${i}]` }), { status: 400 });
            }

            if (block.component && typeof block.component !== "string") {
                return new NextResponse(JSON.stringify({ error: `Invalid 'component' in blocks[${i}]` }), { status: 400 });
            }

            if (block.redirect && typeof block.redirect !== "string") {
                return new NextResponse(JSON.stringify({ error: `Invalid 'redirect' in blocks[${i}]` }), { status: 400 });
            }
        }

        const { error: updateError } = await supabase
            .from("blocks")
            .update({ block: blocks })
            .eq("uid", id);

        if (updateError) {
            console.error("Block update error:", updateError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "An error occurred while updating your block" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}