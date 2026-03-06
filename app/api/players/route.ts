import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserRole } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseFromRequest(req: Request) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  );
}

/* ======================
   GET PLAYERS
   Semua user boleh lihat
====================== */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ======================
   CREATE PLAYER
   ADMIN ONLY
====================== */
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseFromRequest(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);

    if (role !== "admin") {
      return NextResponse.json(
        { error: "hanya admin yang bisa membuat pemain" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { full_name, nickname, avatar_url } = body;

    const { data, error } = await supabaseAdmin
      .from("players")
      .insert({
        full_name,
        nickname,
        avatar_url,
        wins: 0,
        losses: 0,
        matches_played: 0,
        total_points: 0,
      })
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ======================
   UPDATE PLAYER
   ADMIN ONLY
====================== */
export async function PUT(req: Request) {
  try {
    const supabase = getSupabaseFromRequest(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);

    if (role !== "admin") {
      return NextResponse.json(
        { error: "hanya admin yang bisa mengupdate pemain" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const { player_id, full_name, nickname, avatar_url } = body;

    const { data, error } = await supabaseAdmin
      .from("players")
      .update({
        full_name,
        nickname,
        avatar_url,
      })
      .eq("id", player_id)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ======================
   DELETE PLAYER
   ADMIN ONLY
====================== */
export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseFromRequest(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);

    if (role !== "admin") {
      return NextResponse.json(
        { error: "hanya admin yang bisa menghapus pemain" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const { player_id } = body;

    const { error } = await supabaseAdmin
      .from("players")
      .delete()
      .eq("id", player_id);

    if (error) throw error;

    return NextResponse.json({
      message: "player telah dihapus",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
