import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
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
        const { username } = body;

        if (!username) {
            return new NextResponse(JSON.stringify({ error: "Missing Username" }), { status: 400 })
        }

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ username })
            .eq("uid", id)

        if (updateError) {
            console.error("Profile update error:", updateError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "An error occurred while updating your profile" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}