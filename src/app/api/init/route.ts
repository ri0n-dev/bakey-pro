import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            console.error("Error fetching user:", sessionError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
        }

        const { id, user_metadata } = user;

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("uid", id)
            .single();

        if (profileError && profileError.code !== "PGRST116") {
            console.error("Profile fetch error:", profileError);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "An error occurred while fetching your profile" }), { status: 500 });
        }

        if (profileData) {
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        }

        let uploadedAvatarUrl = "";
        if (user_metadata.avatar_url) {
            const Response = await fetch(user_metadata.avatar_url)
            const arrayBuffer = await Response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const file = `${id}.jpg`;

            const { error: storageError } = await supabase
                .storage
                .from("icons")
                .upload(file, buffer, { contentType: "image/jpeg", upsert: true });

            if (storageError) {
                console.error("Storage upload error:", storageError);
                await supabase.auth.signOut();
                return new NextResponse(JSON.stringify({ error: "Failed to upload avatar" }), { status: 500 });
            } else {
                const { data: publicUrl } = supabase
                    .storage
                    .from("icons")
                    .getPublicUrl(file);
                uploadedAvatarUrl = publicUrl.publicUrl;
            }
        }

        const initialProfileData = {
            uid: id,
            name: user_metadata.name || "name",
            username: "",
            icon: uploadedAvatarUrl || user_metadata.avatar_url || "",
            header: "",
            bio: {
                introduction: "",
                location: "",
                occupation: "",
                contact: "",
            }
        };

        const { error: profileErrorInsert } = await supabase
            .from("profiles")
            .insert(initialProfileData);
        if (profileErrorInsert) {
            console.error("Profile insert error:", profileErrorInsert);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to insert profile" }), { status: 500 });
        }

        const initialBlockData = {
            uid: id,
            block: [
                {
                    "id": "1",
                    "type": "IconLink",
                    "icon": "SiDiscord",
                    "string": "Discord",
                    "image": "",
                    "redirect": "",
                    "lock": ""
                },
                {
                    "id": "2",
                    "type": "IconLink",
                    "icon": "SiX",
                    "string": "X",
                    "image": "",
                    "redirect": "",
                    "lock": ""
                }
            ],
        };

        const { error: blockErrorInsert } = await supabase
            .from("blocks")
            .insert(initialBlockData);
        if (blockErrorInsert) {
            console.error("Block insert error:", blockErrorInsert);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Failed to insert block" }), { status: 500 });
        }

        const initialThemeData = {
            uid: id,
            theme: "#ffffff, #D8D8D8, #202020",
            style: "fill, rounded-2xl"
        };

        const { error: themeErrorInsert } = await supabase
            .from("themes")
            .insert(initialThemeData);
        if (themeErrorInsert) {
            console.error("Theme insert error:", themeErrorInsert);
            await supabase.auth.signOut();
            return new NextResponse(JSON.stringify({ error: "Failed to insert theme" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}