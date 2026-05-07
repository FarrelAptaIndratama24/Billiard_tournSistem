import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// Pastikan path import ini mengarah ke file tempat Anda membuat fungsi getUserSession & getUserRole
import { getUserSession, getUserRole } from "@/lib/auth";

/* ======================
   GET MATCHES
====================== */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("matches")
    .select(
      `
      id,
      match_date,
      status,
      player1_score,
      player2_score,
      player1:player1_id ( id, full_name, nickname ),
      player2:player2_id ( id, full_name, nickname ),
      winner:winner_id ( id, full_name, nickname )
    `,
    )
    .order("match_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ======================
   CREATE MATCH (ADMIN)
====================== */
export async function POST(req: Request) {
  try {
    // 1. GUNAKAN getUserSession() UNTUK MEMBACA DARI COOKIES
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);

    if (role !== "admin") {
      return NextResponse.json(
        { error: "hanya admin yang bisa membuat pertandingan" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { player1_id, player2_id, player1_name, player2_name, match_date } =
      body;

    let p1 = player1_id;
    let p2 = player2_id;

    /* ======================
       CONVERT NAME → UUID
    ====================== */
    if (!p1 && player1_name) {
      const { data } = await supabaseAdmin
        .from("players")
        .select("id")
        .ilike("full_name", player1_name)
        .single();

      if (!data) {
        return NextResponse.json(
          { error: `Player ${player1_name} tidak ditemukan` },
          { status: 404 },
        );
      }
      p1 = data.id;
    }

    if (!p2 && player2_name) {
      const { data } = await supabaseAdmin
        .from("players")
        .select("id")
        .ilike("full_name", player2_name)
        .single();

      if (!data) {
        return NextResponse.json(
          { error: `Player ${player2_name} tidak ditemukan` },
          { status: 404 },
        );
      }
      p2 = data.id;
    }

    if (!p1 || !p2) {
      return NextResponse.json(
        { error: "Player tidak valid" },
        { status: 400 },
      );
    }

    if (p1 === p2) {
      return NextResponse.json(
        { error: "Player tidak boleh sama" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("matches")
      .insert({
        player1_id: p1,
        player2_id: p2,
        match_date,
        status: "scheduled",
        player1_score: 0,
        player2_score: 0,
      })
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ======================
   UPDATE MATCH RESULT (ADMIN ONLY)
====================== */
export async function PUT(req: Request) {
  try {
    // 2. GUNAKAN getUserSession() DI SINI JUGA
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);

    if (role !== "admin") {
      return NextResponse.json(
        { error: "hanya admin yang bisa mengupdate pertandingan" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { match_id, player1_score, player2_score } = body;

    if (player1_score < 0 || player2_score < 0) {
      return NextResponse.json({ error: "Score tidak valid" }, { status: 400 });
    }

    const { data: match, error: matchError } = await supabaseAdmin
      .from("matches")
      .select("player1_id, player2_id, status")
      .eq("id", match_id)
      .single();

    if (matchError || !match) {
      return NextResponse.json(
        { error: "Match tidak ditemukan" },
        { status: 404 },
      );
    }

    if (match.status === "completed") {
      return NextResponse.json(
        { error: "Match sudah selesai" },
        { status: 400 },
      );
    }

    let winner_id;
    if (player1_score > player2_score) {
      winner_id = match.player1_id;
    } else if (player2_score > player1_score) {
      winner_id = match.player2_id;
    } else {
      return NextResponse.json(
        { error: "Pertandingan tidak boleh seri" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("matches")
      .update({
        player1_score,
        player2_score,
        winner_id,
        status: "completed",
      })
      .eq("id", match_id)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
