import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("leaderboard") // gunakan VIEW leaderboard
      .select("*")
      .limit(100); // ambil top 100 pemain

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leaderboard",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
