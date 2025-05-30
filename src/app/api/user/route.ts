import { NextRequest, NextResponse } from "next/server";
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
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("username", username)
                .single();

            if (profileError) {
                console.error("Username profile fetch error:", profileError);
                return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
            }

            if (profileData) {
                delete profileData.uid;
            }
            return new NextResponse(JSON.stringify({ success: true, data: profileData }), { status: 200 });
        }

        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            console.error("Error fetching user:", sessionError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
        }

        const { id } = user;

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("uid", id)
            .single();

        if (profileError) {
            console.error("Profile fetch error:", profileError);
            return new NextResponse(JSON.stringify({ error: "An error occurred while fetching your profile" }), { status: 500 });
        }

        if (profileData) {
            delete profileData.uid;
        }
        return new NextResponse(JSON.stringify({ success: true, data: profileData }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}