import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/SupabaseServer";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const supabase = await createClient()
    const url = new URL(req.url);
    const fileUrl = url.searchParams.get("url");

    if (!fileUrl) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    const [bucket, ...filePathParts] = fileUrl.split("/");
    const filePath = filePathParts.join("/");

    if (!bucket || filePathParts.length === 0) {
        return new NextResponse("Invalid url parameter", { status: 400 });
    }

    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    if (error || !data) {
        return new NextResponse("Not found", { status: 404 });
    }

    const extension = filePath.split(".").pop();
    const mineTypes: Record<string, string> = {
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        gif: "image/gif"
    };

    const contentType = mineTypes[extension ?? ""] || "application/octet-stream";

    return new NextResponse(data, { headers: {"Content-Type": contentType} });
}