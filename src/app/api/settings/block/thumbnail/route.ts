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
        const { file, blockId } = body;

        if (!file || !blockId) {
            return new Response(JSON.stringify({ error: "Missing File or blockId" }), { status: 400 });
        }

        const sharp = require("sharp");
        const buffer = Buffer.from(file, "base64");
        const resizedBuffer = await sharp(buffer)
            .resize(50, 50, { fit: "cover" })
            .png()
            .toBuffer();

        const folderPath = `${id}`;
        const filePrefix = `${blockId}-`;

        const { data: existingFiles, error: listError } = await supabaseWithAuth
            .storage
            .from("blocks")
            .list(folderPath);

        if (listError) {
            console.error("List error:", listError);
            return new Response(JSON.stringify({ error: "Failed to list files" }), { status: 500 });
        }

        const matchingFiles = existingFiles
            ?.filter(file => file.name.startsWith(filePrefix))
            .map(file => `${folderPath}/${file.name}`) || [];

        if (matchingFiles.length > 0) {
            const { error: deleteError } = await supabaseWithAuth
                .storage
                .from("blocks")
                .remove(matchingFiles);

            if (deleteError) {
                console.error("Delete error:", deleteError);
                return new Response(JSON.stringify({ error: "Failed to delete existing files" }), { status: 500 });
            }
        }

        let index = 1;
        let finalFilename = `${filePrefix}${index}.jpeg`;

        while (existingFiles?.some(file => file.name === finalFilename)) {
            index++;
            finalFilename = `${filePrefix}${index}.jpeg`;
        }

        const { error: uploadError } = await supabaseWithAuth.storage
            .from("blocks")
            .upload(`${folderPath}/${finalFilename}`, resizedBuffer, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return new Response(JSON.stringify({ error: "Failed to upload image" }), { status: 500 });
        }

        const imageUrl = `/api/image/?url=blocks/${folderPath}/${finalFilename}&t=${Date.now()}`;
        return new Response(JSON.stringify({ success: true, url: imageUrl }), { status: 200 });

    } catch (error) {
        console.error("Upload processing error:", error);
        return new Response(JSON.stringify({ error: "Failed to process image" }), { status: 500 });
    }
}
