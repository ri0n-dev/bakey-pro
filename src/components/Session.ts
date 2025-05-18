import { redirect } from "next/navigation";
import { createClient } from "@/libs/SupabaseServer";

export async function Session() {
    const supabase = await createClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !user) {
        await supabase.auth.signOut();
        redirect("/login/");
    }
}

export async function SessionReverse() {
    const supabase = await createClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();

    if (!sessionError && user) {
        redirect("/admin/");
    }
}
