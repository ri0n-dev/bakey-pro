import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/SupabaseClient";

export async function POST(req: NextRequest) {
    const supabase = createClient();

    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { uid } = body;

        if (!uid) {
            return new NextResponse(JSON.stringify({ error: "Missing UID" }), { status: 400 })
        }

        const { data: themeData, error: themeError } = await supabase
            .from("themes")
            .select("theme, style")
            .eq("uid", uid)
            .single();

        if (themeError && themeError.code !== "PGRST116") {
            console.error("Theme fetch error:", themeError);
            return new NextResponse(JSON.stringify({ error: "An error occurred while fetching your theme" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true, data: themeData }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}