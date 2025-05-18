import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const supabase = await createClient()

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.error("Sign out error:", signOutError);
            return new NextResponse(JSON.stringify({ error: "An error occurred while signing out" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}