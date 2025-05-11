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
        const { file } = body;

        if (!file) {
            return new Response(JSON.stringify({ error: "Missing File" }), { status: 400 })
        }

        const sharp = require("sharp");
        const buffer = Buffer.from(file, "base64");
        const resizedBuffer = await sharp(buffer)
            .resize(256, 256)
            .jpeg({ quality: 80 })
            .toBuffer();

        const { error: uploadError } = await supabaseWithAuth.storage
            .from("icons")
            .upload(`${id}.jpeg`, resizedBuffer, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return new Response(JSON.stringify({ error: "Failed to upload icon" }), { status: 500 });
        }

        const iconUrlWithDate = `/api/image?url=icons/${id}.jpeg&t=${Date.now()}`;
        const { error } = await supabaseWithAuth
            .from("profiles")
            .update({ "icon": iconUrlWithDate })
            .eq("uid", id)
        if (error) {
            console.error("Profile update error:", error);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Upload processing error:", error);
        return new Response(JSON.stringify({ error: "Failed to process image" }), { status: 500 });
    }
}
