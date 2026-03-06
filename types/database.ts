export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          nickname: string | null;
          avatar_url: string | null;
          total_points: number;
          matches_played: number;
          wins: number;
          losses: number;
        };
        Insert: {
          id?: string; // Terisi otomatis (UUID) jika tidak diisi
          created_at?: string;
          full_name: string;
          nickname?: string | null;
          avatar_url?: string | null;
          total_points?: number;
          matches_played?: number;
          wins?: number;
          losses?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          total_points?: number;
          matches_played?: number;
          wins?: number;
          losses?: number;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          created_at: string;
          match_date: string;
          player1_id: string;
          player2_id: string;
          winner_id: string | null;
          player1_score: number;
          player2_score: number;
          status: "scheduled" | "ongoing" | "completed";
        };
        Insert: {
          id?: string;
          created_at?: string;
          match_date: string;
          player1_id: string;
          player2_id: string;
          winner_id?: string | null;
          player1_score?: number;
          player2_score?: number;
          status?: "scheduled" | "ongoing" | "completed";
        };
        Update: {
          id?: string;
          created_at?: string;
          match_date?: string;
          player1_id?: string;
          player2_id?: string;
          winner_id?: string | null;
          player1_score?: number;
          player2_score?: number;
          status?: "scheduled" | "ongoing" | "completed";
        };
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey";
            columns: ["player1_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_player2_id_fkey";
            columns: ["player2_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_winner_id_fkey";
            columns: ["winner_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      // Jika nanti Anda membuat view untuk Leaderboard, bisa masuk ke sini
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
