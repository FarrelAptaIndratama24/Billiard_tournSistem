// src/services/playerService.ts
import { supabase } from "@/lib/supabaseClient";

export const getPlayers = async () => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching players:", error);
    throw error;
  }

  return data;
};
