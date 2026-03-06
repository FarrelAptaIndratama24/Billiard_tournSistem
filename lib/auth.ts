import { supabaseAdmin } from "./supabaseAdmin";

export async function getUserRole(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data.role;
}
