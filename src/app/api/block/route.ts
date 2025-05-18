import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { uid } = body;

        if (!uid) {
            return new NextResponse(JSON.stringify({ error: "Missing UID" }), { status: 400 })
        }

        const { data: blockData, error: blockError } = await supabase
            .from("blocks")
            .select("block")
            .eq("uid", uid)
            .single();

        if (blockError) {
            console.error("Block fetch error:", blockError);
            return new NextResponse(JSON.stringify({ error: blockError.message || "An error occurred while fetching your block" }), { status: blockError.code === "PGRST116" ? 404 : 500 });
        }

        return new NextResponse(JSON.stringify({ success: true, data: blockData?.block || [] }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}