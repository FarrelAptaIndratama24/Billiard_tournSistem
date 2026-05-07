import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 👇 TAMBAHKAN BARIS INI (Sesuaikan path-nya jika file supabaseAdmin Anda ada di folder lain)
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getUserSession() {
  const cookieStore = await cookies(); // ← await untuk Next.js 15

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Diperlukan agar token refresh tersimpan
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    },
  );

  // Gunakan getUser() — validasi langsung ke Supabase server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

export async function getUserRole(userId: string): Promise<string | null> {
  // Sekarang supabaseAdmin sudah dikenali karena sudah di-import di atas
  const { data, error } = await supabaseAdmin
    .from("profiles") // ← sesuai schema kamu
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data.role;
}
