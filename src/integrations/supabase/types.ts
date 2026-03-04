export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          contact_designation: string | null
          contact_name: string | null
          created_at: string | null
          gst_number: string | null
          gst_verified: boolean | null
          id: string
          industry: string | null
          is_verified: boolean | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          wallet_balance: number | null
        }
        Insert: {
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          contact_designation?: string | null
          contact_name?: string | null
          created_at?: string | null
          gst_number?: string | null
          gst_verified?: boolean | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          wallet_balance?: number | null
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          contact_designation?: string | null
          contact_name?: string | null
          created_at?: string | null
          gst_number?: string | null
          gst_verified?: boolean | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          wallet_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          approved_submissions: number | null
          brand_id: string | null
          brief_url: string | null
          content_guidelines: string | null
          cpm_rate: number
          created_at: string | null
          description: string
          do_list: string[] | null
          dont_list: string[] | null
          end_date: string | null
          escrowed_amount: number | null
          hashtags: string[] | null
          id: string
          language_tags: string[] | null
          max_creators: number | null
          min_followers: number | null
          min_reliability_score: number | null
          niche_tags: string[] | null
          platform: Database["public"]["Enums"]["platform_type"]
          platform_fee_percent: number | null
          razorpay_order_id: string | null
          spent_amount: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          total_budget: number
          total_submissions: number | null
          total_verified_views: number | null
          updated_at: string | null
        }
        Insert: {
          approved_submissions?: number | null
          brand_id?: string | null
          brief_url?: string | null
          content_guidelines?: string | null
          cpm_rate: number
          created_at?: string | null
          description: string
          do_list?: string[] | null
          dont_list?: string[] | null
          end_date?: string | null
          escrowed_amount?: number | null
          hashtags?: string[] | null
          id?: string
          language_tags?: string[] | null
          max_creators?: number | null
          min_followers?: number | null
          min_reliability_score?: number | null
          niche_tags?: string[] | null
          platform: Database["public"]["Enums"]["platform_type"]
          platform_fee_percent?: number | null
          razorpay_order_id?: string | null
          spent_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          total_budget: number
          total_submissions?: number | null
          total_verified_views?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_submissions?: number | null
          brand_id?: string | null
          brief_url?: string | null
          content_guidelines?: string | null
          cpm_rate?: number
          created_at?: string | null
          description?: string
          do_list?: string[] | null
          dont_list?: string[] | null
          end_date?: string | null
          escrowed_amount?: number | null
          hashtags?: string[] | null
          id?: string
          language_tags?: string[] | null
          max_creators?: number | null
          min_followers?: number | null
          min_reliability_score?: number | null
          niche_tags?: string[] | null
          platform?: Database["public"]["Enums"]["platform_type"]
          platform_fee_percent?: number | null
          razorpay_order_id?: string | null
          spent_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title?: string
          total_budget?: number
          total_submissions?: number | null
          total_verified_views?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          approved_submissions: number | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_verified: boolean | null
          bio: string | null
          bio_verification_code: string | null
          bio_verified: boolean | null
          bio_verified_at: string | null
          campaigns_completed: number | null
          created_at: string | null
          id: string
          ig_connected: boolean | null
          ig_followers: number | null
          ig_user_id: string | null
          ig_username: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          language: string[] | null
          location: string | null
          niche: string[] | null
          pan_number: string | null
          pan_verified: boolean | null
          pending_earnings: number | null
          reliability_score: number | null
          total_earned: number | null
          total_submissions: number | null
          total_views_generated: number | null
          updated_at: string | null
          upi_id: string | null
          upi_verified: boolean | null
          user_id: string | null
          wallet_balance: number | null
          yt_channel_id: string | null
          yt_channel_name: string | null
          yt_connected: boolean | null
          yt_subscribers: number | null
        }
        Insert: {
          approved_submissions?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_verified?: boolean | null
          bio?: string | null
          bio_verification_code?: string | null
          bio_verified?: boolean | null
          bio_verified_at?: string | null
          campaigns_completed?: number | null
          created_at?: string | null
          id?: string
          ig_connected?: boolean | null
          ig_followers?: number | null
          ig_user_id?: string | null
          ig_username?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          language?: string[] | null
          location?: string | null
          niche?: string[] | null
          pan_number?: string | null
          pan_verified?: boolean | null
          pending_earnings?: number | null
          reliability_score?: number | null
          total_earned?: number | null
          total_submissions?: number | null
          total_views_generated?: number | null
          updated_at?: string | null
          upi_id?: string | null
          upi_verified?: boolean | null
          user_id?: string | null
          wallet_balance?: number | null
          yt_channel_id?: string | null
          yt_channel_name?: string | null
          yt_connected?: boolean | null
          yt_subscribers?: number | null
        }
        Update: {
          approved_submissions?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_verified?: boolean | null
          bio?: string | null
          bio_verification_code?: string | null
          bio_verified?: boolean | null
          bio_verified_at?: string | null
          campaigns_completed?: number | null
          created_at?: string | null
          id?: string
          ig_connected?: boolean | null
          ig_followers?: number | null
          ig_user_id?: string | null
          ig_username?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          language?: string[] | null
          location?: string | null
          niche?: string[] | null
          pan_number?: string | null
          pan_verified?: boolean | null
          pending_earnings?: number | null
          reliability_score?: number | null
          total_earned?: number | null
          total_submissions?: number | null
          total_views_generated?: number | null
          updated_at?: string | null
          upi_id?: string | null
          upi_verified?: boolean | null
          user_id?: string | null
          wallet_balance?: number | null
          yt_channel_id?: string | null
          yt_channel_name?: string | null
          yt_connected?: boolean | null
          yt_subscribers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          bank_account_number: string | null
          bank_ifsc: string | null
          created_at: string | null
          creator_id: string | null
          failure_reason: string | null
          gross_amount: number
          id: string
          initiated_at: string | null
          net_amount: number
          payment_method: string
          period_end: string | null
          period_start: string | null
          processed_at: string | null
          razorpay_fund_account_id: string | null
          razorpay_payout_id: string | null
          status: Database["public"]["Enums"]["payout_status"] | null
          tds_amount: number | null
          tds_percent: number | null
          upi_id: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string | null
          creator_id?: string | null
          failure_reason?: string | null
          gross_amount: number
          id?: string
          initiated_at?: string | null
          net_amount: number
          payment_method: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          razorpay_fund_account_id?: string | null
          razorpay_payout_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          tds_amount?: number | null
          tds_percent?: number | null
          upi_id?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string | null
          creator_id?: string | null
          failure_reason?: string | null
          gross_amount?: number
          id?: string
          initiated_at?: string | null
          net_amount?: number
          payment_method?: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          razorpay_fund_account_id?: string | null
          razorpay_payout_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          tds_amount?: number | null
          tds_percent?: number | null
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          apify_last_verified: string | null
          apify_run_id: string | null
          approved_at: string | null
          approved_by: string | null
          campaign_id: string | null
          content_url: string
          created_at: string | null
          creator_id: string | null
          earned_amount: number | null
          flag_reason: string | null
          id: string
          ig_media_id: string | null
          initial_views: number | null
          is_flagged: boolean | null
          last_synced_at: string | null
          last_synced_views: number | null
          platform: Database["public"]["Enums"]["platform_type"]
          rejection_reason: string | null
          status: Database["public"]["Enums"]["submission_status"] | null
          updated_at: string | null
          verified_views: number | null
          view_sync_count: number | null
          view_velocity_score: number | null
          yt_video_id: string | null
        }
        Insert: {
          apify_last_verified?: string | null
          apify_run_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          content_url: string
          created_at?: string | null
          creator_id?: string | null
          earned_amount?: number | null
          flag_reason?: string | null
          id?: string
          ig_media_id?: string | null
          initial_views?: number | null
          is_flagged?: boolean | null
          last_synced_at?: string | null
          last_synced_views?: number | null
          platform: Database["public"]["Enums"]["platform_type"]
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          updated_at?: string | null
          verified_views?: number | null
          view_sync_count?: number | null
          view_velocity_score?: number | null
          yt_video_id?: string | null
        }
        Update: {
          apify_last_verified?: string | null
          apify_run_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          content_url?: string
          created_at?: string | null
          creator_id?: string | null
          earned_amount?: number | null
          flag_reason?: string | null
          id?: string
          ig_media_id?: string | null
          initial_views?: number | null
          is_flagged?: boolean | null
          last_synced_at?: string | null
          last_synced_views?: number | null
          platform?: Database["public"]["Enums"]["platform_type"]
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          updated_at?: string | null
          verified_views?: number | null
          view_sync_count?: number | null
          view_velocity_score?: number | null
          yt_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          is_suspended: boolean | null
          phone: string | null
          phone_verified: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          suspension_reason: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          is_suspended?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_suspended?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      view_snapshots: {
        Row: {
          created_at: string | null
          delta_views: number
          earned_this_snapshot: number | null
          id: string
          source: string | null
          submission_id: string | null
          views_at_snapshot: number
        }
        Insert: {
          created_at?: string | null
          delta_views: number
          earned_this_snapshot?: number | null
          id?: string
          source?: string | null
          submission_id?: string | null
          views_at_snapshot: number
        }
        Update: {
          created_at?: string | null
          delta_views?: number
          earned_this_snapshot?: number | null
          id?: string
          source?: string | null
          submission_id?: string | null
          views_at_snapshot?: number
        }
        Relationships: [
          {
            foreignKeyName: "view_snapshots_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          razorpay_payment_id: string | null
          reference_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          razorpay_payment_id?: string | null
          reference_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          razorpay_payment_id?: string | null
          reference_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _auth_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      campaign_status:
        | "draft"
        | "pending_payment"
        | "active"
        | "paused"
        | "completed"
        | "cancelled"
      kyc_status: "pending" | "submitted" | "verified" | "rejected"
      notification_type:
        | "campaign_live"
        | "views_milestone"
        | "payout_sent"
        | "campaign_ending"
        | "kyc_approved"
        | "kyc_rejected"
        | "submission_approved"
        | "submission_rejected"
      payout_status: "pending" | "processing" | "paid" | "failed"
      platform_type: "youtube" | "instagram" | "both"
      submission_status: "pending_review" | "approved" | "rejected" | "tracking"
      transaction_type:
        | "deposit"
        | "spend"
        | "refund"
        | "payout"
        | "platform_fee"
      user_role: "creator" | "brand" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: [
        "draft",
        "pending_payment",
        "active",
        "paused",
        "completed",
        "cancelled",
      ],
      kyc_status: ["pending", "submitted", "verified", "rejected"],
      notification_type: [
        "campaign_live",
        "views_milestone",
        "payout_sent",
        "campaign_ending",
        "kyc_approved",
        "kyc_rejected",
        "submission_approved",
        "submission_rejected",
      ],
      payout_status: ["pending", "processing", "paid", "failed"],
      platform_type: ["youtube", "instagram", "both"],
      submission_status: ["pending_review", "approved", "rejected", "tracking"],
      transaction_type: [
        "deposit",
        "spend",
        "refund",
        "payout",
        "platform_fee",
      ],
      user_role: ["creator", "brand", "admin"],
    },
  },
} as const
