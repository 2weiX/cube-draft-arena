export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      drafts: {
        Row: {
          completed_at: string | null
          created_at: string
          cube_name: string | null
          current_round: number
          description: string | null
          id: string
          name: string
          players: string[]
          seating: string[]
          started_at: string | null
          status: string
          total_rounds: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          cube_name?: string | null
          current_round?: number
          description?: string | null
          id?: string
          name: string
          players: string[]
          seating: string[]
          started_at?: string | null
          status: string
          total_rounds: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          cube_name?: string | null
          current_round?: number
          description?: string | null
          id?: string
          name?: string
          players?: string[]
          seating?: string[]
          started_at?: string | null
          status?: string
          total_rounds?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          completed_at: string | null
          created_at: string
          draft_id: string
          id: string
          player1: string
          player1_score: number
          player2: string
          player2_score: number
          result: string
          round: number
          round_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          draft_id: string
          id?: string
          player1: string
          player1_score?: number
          player2: string
          player2_score?: number
          result: string
          round: number
          round_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          draft_id?: string
          id?: string
          player1?: string
          player1_score?: number
          player2?: string
          player2_score?: number
          result?: string
          round?: number
          round_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_fkey"
            columns: ["player1"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_fkey"
            columns: ["player2"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      player_draft_stats: {
        Row: {
          created_at: string
          draft_id: string
          draws: number
          game_win_percentage: number
          id: string
          losses: number
          match_win_percentage: number
          player_id: string
          points: number
          updated_at: string
          wins: number
        }
        Insert: {
          created_at?: string
          draft_id: string
          draws?: number
          game_win_percentage?: number
          id?: string
          losses?: number
          match_win_percentage?: number
          player_id: string
          points?: number
          updated_at?: string
          wins?: number
        }
        Update: {
          created_at?: string
          draft_id?: string
          draws?: number
          game_win_percentage?: number
          id?: string
          losses?: number
          match_win_percentage?: number
          player_id?: string
          points?: number
          updated_at?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_draft_stats_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_draft_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar: string | null
          created_at: string
          draws: number
          id: string
          losses: number
          name: string
          ranking: number
          wins: number
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          draws?: number
          id?: string
          losses?: number
          name: string
          ranking?: number
          wins?: number
        }
        Update: {
          avatar?: string | null
          created_at?: string
          draws?: number
          id?: string
          losses?: number
          name?: string
          ranking?: number
          wins?: number
        }
        Relationships: []
      }
      rounds: {
        Row: {
          completed: boolean
          created_at: string
          draft_id: string
          id: string
          number: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          draft_id: string
          id?: string
          number: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          draft_id?: string
          id?: string
          number?: number
        }
        Relationships: [
          {
            foreignKeyName: "rounds_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_tweets: {
        Row: {
          author_id: string
          author_name: string
          author_profile_image: string | null
          author_username: string
          created_at: string
          from_account: string
          id: string
          like_count: number | null
          media: Json | null
          quote_count: number | null
          relationship_type: string
          reply_count: number | null
          retweet_count: number | null
          text: string
          tweet_id: string
        }
        Insert: {
          author_id: string
          author_name: string
          author_profile_image?: string | null
          author_username: string
          created_at: string
          from_account: string
          id?: string
          like_count?: number | null
          media?: Json | null
          quote_count?: number | null
          relationship_type: string
          reply_count?: number | null
          retweet_count?: number | null
          text: string
          tweet_id: string
        }
        Update: {
          author_id?: string
          author_name?: string
          author_profile_image?: string | null
          author_username?: string
          created_at?: string
          from_account?: string
          id?: string
          like_count?: number | null
          media?: Json | null
          quote_count?: number | null
          relationship_type?: string
          reply_count?: number | null
          retweet_count?: number | null
          text?: string
          tweet_id?: string
        }
        Relationships: []
      }
      tracked_twitter_accounts: {
        Row: {
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          name: string | null
          profile_image_url: string | null
          twitter_id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          name?: string | null
          profile_image_url?: string | null
          twitter_id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          name?: string | null
          profile_image_url?: string | null
          twitter_id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      twitter_relationships: {
        Row: {
          created_at: string | null
          from_account: string
          id: string
          relationship_type: string
          to_account: string
        }
        Insert: {
          created_at?: string | null
          from_account: string
          id?: string
          relationship_type: string
          to_account: string
        }
        Update: {
          created_at?: string | null
          from_account?: string
          id?: string
          relationship_type?: string
          to_account?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
