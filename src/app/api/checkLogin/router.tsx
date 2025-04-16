import { NextApiResponse, NextApiRequest } from "next";
import { supabase } from "@/libs/supabaseClient"

export default async function getSession(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        if (data) {
            return res.status(200).json({ login: true, data });
        }
    } catch (error) {
        console.error("Error fetching session:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}