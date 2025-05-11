import { supabase } from "@/libs/SupabaseClient";

export async function GET(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const fileUrl = url.searchParams.get("url");

    if (!fileUrl) {
        return new Response("Missing url parameter", { status: 400 });
    }

    const [bucket, ...filePathParts] = fileUrl.split("/");
    const filePath = filePathParts.join("/");

    if (!bucket || filePathParts.length === 0) {
        return new Response("Invalid url parameter", { status: 400 });
    }

    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    if (error || !data) {
        return new Response("Not found", { status: 404 });
    }

    const extension = filePath.split(".").pop();
    const mineTypes: Record<string, string> = {
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        gif: "image/gif"
    };

    const contentType = mineTypes[extension ?? ""] || "application/octet-stream";

    return new Response(data, { headers: {"Content-Type": contentType} });
}