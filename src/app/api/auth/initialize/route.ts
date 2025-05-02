import { supabase, createSupabaseWithToken } from "@/libs/SupabaseClient";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
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

        const { id, user_metadata } = user;

        const { data: profileData, error: profileError } = await supabaseWithAuth
            .from("profiles")
            .select("*")
            .eq("uid", id)
            .single();

        if (profileError && profileError.code !== "PGRST116") {
            console.error("Profile fetch error:", profileError);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "An error occurred while fetching your profile" }), { status: 500 });
        }

        if (profileData) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        const sharp = require("sharp");
        let uploadedAvatarUrl = "";
        if (user_metadata.avatar_url) {
            const response = await fetch(user_metadata.avatar_url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const resizedBuffer = await sharp(buffer)
                .resize(256, 256)
                .jpeg({ quality: 80 })
                .toBuffer();

            const fileName = `${user.id}.jpg`;

            const { error: storageError } = await supabase
                .storage
                .from("icons")
                .upload(fileName, resizedBuffer, { contentType: "image/jpeg", upsert: true });

            if (storageError) {
                console.error("Storage upload error:", storageError);
                await supabase.auth.signOut();
                return new Response(JSON.stringify({ error: "Failed to upload avatar" }), { status: 500 });
            } else {
                const { data: publicUrl } = supabase
                    .storage
                    .from("icons")
                    .getPublicUrl(fileName);
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

        const { error: profileErrorInsert } = await supabaseWithAuth
            .from("profiles")
            .insert(initialProfileData);
        if (profileErrorInsert) {
            console.error("Profile insert error:", profileErrorInsert);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to insert profile" }), { status: 500 });
        }

        const initialBlockData = {
            uid: id,
            data: {
                "blocks": [
                    {
                        "id": "1",
                        "type": "IconLink",
                        "icon": "SiDiscord",
                        "title": "Discord",
                        "image": "",
                        "redirect": "",
                    },
                    {
                        "id": "2",
                        "type": "IconLink",
                        "icon": "SiX",
                        "title": "X",
                        "image": "",
                        "redirect": "",
                    }
                ]
            },
        };

        const { error: blockErrorInsert } = await supabaseWithAuth
            .from("blocks")
            .insert(initialBlockData);
        if (blockErrorInsert) {
            console.error("Block insert error:", blockErrorInsert);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to insert block" }), { status: 500 });
        }

        const initialThemeData = {
            uid: id,
            theme: "#ffffff, #D8D8D8, #202020",
            style: "fill, rounded-2xl"
        };

        const { error: themeErrorInsert } = await supabaseWithAuth
            .from("themes")
            .insert(initialThemeData);
        if (themeErrorInsert) {
            console.error("Theme insert error:", themeErrorInsert);
            await supabase.auth.signOut();
            return new Response(JSON.stringify({ error: "Failed to insert theme" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        await supabase.auth.signOut();
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}