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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campaign_analytics: {
        Row: {
          average_response_time_minutes: number | null
          best_performing_template: string | null
          calculated_at: string | null
          callbacks_received: number | null
          campaign_id: string | null
          confused_count: number | null
          cost_metrics: Json | null
          created_at: string | null
          id: string
          interested_count: number | null
          metric_date: string | null
          metric_hour: number | null
          missed_calls_made: number | null
          no_response_count: number | null
          not_interested_count: number | null
          performance_score: number | null
          reconnection_rate: number | null
          response_by_category: Json | null
          response_by_hour: Json | null
          response_by_language: Json | null
          response_by_vendor: Json | null
          sms_responses_received: number | null
          sms_sent: number | null
          total_prospects_contacted: number | null
          total_reconnected: number | null
          worst_performing_template: string | null
        }
        Insert: {
          average_response_time_minutes?: number | null
          best_performing_template?: string | null
          calculated_at?: string | null
          callbacks_received?: number | null
          campaign_id?: string | null
          confused_count?: number | null
          cost_metrics?: Json | null
          created_at?: string | null
          id?: string
          interested_count?: number | null
          metric_date?: string | null
          metric_hour?: number | null
          missed_calls_made?: number | null
          no_response_count?: number | null
          not_interested_count?: number | null
          performance_score?: number | null
          reconnection_rate?: number | null
          response_by_category?: Json | null
          response_by_hour?: Json | null
          response_by_language?: Json | null
          response_by_vendor?: Json | null
          sms_responses_received?: number | null
          sms_sent?: number | null
          total_prospects_contacted?: number | null
          total_reconnected?: number | null
          worst_performing_template?: string | null
        }
        Update: {
          average_response_time_minutes?: number | null
          best_performing_template?: string | null
          calculated_at?: string | null
          callbacks_received?: number | null
          campaign_id?: string | null
          confused_count?: number | null
          cost_metrics?: Json | null
          created_at?: string | null
          id?: string
          interested_count?: number | null
          metric_date?: string | null
          metric_hour?: number | null
          missed_calls_made?: number | null
          no_response_count?: number | null
          not_interested_count?: number | null
          performance_score?: number | null
          reconnection_rate?: number | null
          response_by_category?: Json | null
          response_by_hour?: Json | null
          response_by_language?: Json | null
          response_by_vendor?: Json | null
          sms_responses_received?: number | null
          sms_sent?: number | null
          total_prospects_contacted?: number | null
          total_reconnected?: number | null
          worst_performing_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_attempts: {
        Row: {
          attempt_number: number | null
          attempt_type: string
          call_duration_seconds: number | null
          campaign_id: string | null
          cost_amount: number | null
          cost_currency: string | null
          created_at: string | null
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          message_content: string | null
          phone_to: string | null
          phone_used: string | null
          prospect_id: string
          sent_at: string | null
          status: string | null
          twilio_call_sid: string | null
          twilio_sid: string | null
          twilio_status: string | null
        }
        Insert: {
          attempt_number?: number | null
          attempt_type: string
          call_duration_seconds?: number | null
          campaign_id?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_content?: string | null
          phone_to?: string | null
          phone_used?: string | null
          prospect_id: string
          sent_at?: string | null
          status?: string | null
          twilio_call_sid?: string | null
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Update: {
          attempt_number?: number | null
          attempt_type?: string
          call_duration_seconds?: number | null
          campaign_id?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_content?: string | null
          phone_to?: string | null
          phone_used?: string | null
          prospect_id?: string
          sent_at?: string | null
          status?: string | null
          twilio_call_sid?: string | null
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_attempts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_attempts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_attempts_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_engagement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_attempts_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_campaigns: {
        Row: {
          callback_count: number | null
          campaign_date: string | null
          campaign_name: string
          campaign_type: string | null
          completed_at: string | null
          contacted_count: number | null
          created_at: string | null
          created_by: string | null
          error_log: Json | null
          filters_applied: Json | null
          id: string
          qualified_count: number | null
          response_count: number | null
          settings: Json | null
          sms_reply_count: number | null
          started_at: string | null
          status: string | null
          total_prospects: number | null
          updated_at: string | null
        }
        Insert: {
          callback_count?: number | null
          campaign_date?: string | null
          campaign_name: string
          campaign_type?: string | null
          completed_at?: string | null
          contacted_count?: number | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          filters_applied?: Json | null
          id?: string
          qualified_count?: number | null
          response_count?: number | null
          settings?: Json | null
          sms_reply_count?: number | null
          started_at?: string | null
          status?: string | null
          total_prospects?: number | null
          updated_at?: string | null
        }
        Update: {
          callback_count?: number | null
          campaign_date?: string | null
          campaign_name?: string
          campaign_type?: string | null
          completed_at?: string | null
          contacted_count?: number | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          filters_applied?: Json | null
          id?: string
          qualified_count?: number | null
          response_count?: number | null
          settings?: Json | null
          sms_reply_count?: number | null
          started_at?: string | null
          status?: string | null
          total_prospects?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prospect_responses: {
        Row: {
          ai_analysis: Json | null
          ai_confidence_score: number | null
          campaign_id: string | null
          created_at: string | null
          followup_completed: boolean | null
          id: string
          original_message: string | null
          phone_from: string | null
          processed_at: string | null
          prospect_id: string
          qualification_keywords: string[] | null
          qualification_result: string | null
          received_at: string | null
          requires_followup: boolean | null
          response_content: string | null
          response_type: string
          twilio_sid: string | null
          vendor_notified: boolean | null
          vendor_notified_at: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_confidence_score?: number | null
          campaign_id?: string | null
          created_at?: string | null
          followup_completed?: boolean | null
          id?: string
          original_message?: string | null
          phone_from?: string | null
          processed_at?: string | null
          prospect_id: string
          qualification_keywords?: string[] | null
          qualification_result?: string | null
          received_at?: string | null
          requires_followup?: boolean | null
          response_content?: string | null
          response_type: string
          twilio_sid?: string | null
          vendor_notified?: boolean | null
          vendor_notified_at?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_confidence_score?: number | null
          campaign_id?: string | null
          created_at?: string | null
          followup_completed?: boolean | null
          id?: string
          original_message?: string | null
          phone_from?: string | null
          processed_at?: string | null
          prospect_id?: string
          qualification_keywords?: string[] | null
          qualification_result?: string | null
          received_at?: string | null
          requires_followup?: boolean | null
          response_content?: string | null
          response_type?: string
          twilio_sid?: string | null
          vendor_notified?: boolean | null
          vendor_notified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospect_responses_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_responses_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_responses_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_engagement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_responses_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          address_json: Json | null
          assigned_vendor_id: string | null
          bobex_id: number
          categories_json: Json | null
          company: string | null
          contact_count: number | null
          created_at: string | null
          email: string | null
          firstname: string | null
          id: string
          language: string | null
          last_contact_date: string | null
          last_response_date: string | null
          lastname: string | null
          notes: string | null
          phone: string
          phone2: string | null
          qualification_status: string | null
          status: number | null
          updated_at: string | null
          usergroup: string | null
          vat_number: string | null
        }
        Insert: {
          address_json?: Json | null
          assigned_vendor_id?: string | null
          bobex_id: number
          categories_json?: Json | null
          company?: string | null
          contact_count?: number | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          id?: string
          language?: string | null
          last_contact_date?: string | null
          last_response_date?: string | null
          lastname?: string | null
          notes?: string | null
          phone: string
          phone2?: string | null
          qualification_status?: string | null
          status?: number | null
          updated_at?: string | null
          usergroup?: string | null
          vat_number?: string | null
        }
        Update: {
          address_json?: Json | null
          assigned_vendor_id?: string | null
          bobex_id?: number
          categories_json?: Json | null
          company?: string | null
          contact_count?: number | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          id?: string
          language?: string | null
          last_contact_date?: string | null
          last_response_date?: string | null
          lastname?: string | null
          notes?: string | null
          phone?: string
          phone2?: string | null
          qualification_status?: string | null
          status?: number | null
          updated_at?: string | null
          usergroup?: string | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_performance"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "prospects_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_conversations: {
        Row: {
          campaign_id: string | null
          cost_amount: number | null
          created_at: string | null
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          media_urls: string[] | null
          message_content: string
          message_direction: string
          message_template_used: string | null
          message_variables: Json | null
          phone_from: string | null
          phone_to: string | null
          prospect_id: string
          read_at: string | null
          segments_count: number | null
          sent_at: string | null
          twilio_sid: string | null
          twilio_status: string | null
        }
        Insert: {
          campaign_id?: string | null
          cost_amount?: number | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          message_content: string
          message_direction: string
          message_template_used?: string | null
          message_variables?: Json | null
          phone_from?: string | null
          phone_to?: string | null
          prospect_id: string
          read_at?: string | null
          segments_count?: number | null
          sent_at?: string | null
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Update: {
          campaign_id?: string | null
          cost_amount?: number | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          message_content?: string
          message_direction?: string
          message_template_used?: string | null
          message_variables?: Json | null
          phone_from?: string | null
          phone_to?: string | null
          prospect_id?: string
          read_at?: string | null
          segments_count?: number | null
          sent_at?: string | null
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_conversations_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_engagement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_conversations_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notifications: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_status: string | null
          email_body: string | null
          email_service_id: string | null
          email_subject: string | null
          email_template_used: string | null
          email_to: string | null
          id: string
          notification_method: string | null
          notification_reason: string | null
          notification_type: string
          opened_at: string | null
          priority: string | null
          prospect_id: string
          retry_count: number | null
          sent_at: string | null
          sms_body: string | null
          sms_to: string | null
          vendor_id: string
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          email_body?: string | null
          email_service_id?: string | null
          email_subject?: string | null
          email_template_used?: string | null
          email_to?: string | null
          id?: string
          notification_method?: string | null
          notification_reason?: string | null
          notification_type: string
          opened_at?: string | null
          priority?: string | null
          prospect_id: string
          retry_count?: number | null
          sent_at?: string | null
          sms_body?: string | null
          sms_to?: string | null
          vendor_id: string
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          email_body?: string | null
          email_service_id?: string | null
          email_subject?: string | null
          email_template_used?: string | null
          email_to?: string | null
          id?: string
          notification_method?: string | null
          notification_reason?: string | null
          notification_type?: string
          opened_at?: string | null
          priority?: string | null
          prospect_id?: string
          retry_count?: number | null
          sent_at?: string | null
          sms_body?: string | null
          sms_to?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notifications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_engagement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_performance"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          active: boolean | null
          bobex_id: number
          created_at: string | null
          email: string
          id: string
          name: string
          notification_preferences: Json | null
          phone: string
          total_callbacks_received: number | null
          total_prospects_assigned: number | null
          total_qualified_leads: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          bobex_id: number
          created_at?: string | null
          email: string
          id?: string
          name: string
          notification_preferences?: Json | null
          phone: string
          total_callbacks_received?: number | null
          total_prospects_assigned?: number | null
          total_qualified_leads?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          bobex_id?: number
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notification_preferences?: Json | null
          phone?: string
          total_callbacks_received?: number | null
          total_prospects_assigned?: number | null
          total_qualified_leads?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      campaign_summary: {
        Row: {
          callback_count: number | null
          campaign_date: string | null
          campaign_name: string | null
          completed_at: string | null
          contacted_count: number | null
          duration_minutes: number | null
          id: string | null
          qualification_rate: number | null
          qualified_count: number | null
          response_count: number | null
          response_rate: number | null
          sms_reply_count: number | null
          started_at: string | null
          status: string | null
          total_prospects: number | null
        }
        Insert: {
          callback_count?: number | null
          campaign_date?: string | null
          campaign_name?: string | null
          completed_at?: string | null
          contacted_count?: number | null
          duration_minutes?: never
          id?: string | null
          qualification_rate?: never
          qualified_count?: number | null
          response_count?: number | null
          response_rate?: never
          sms_reply_count?: number | null
          started_at?: string | null
          status?: string | null
          total_prospects?: number | null
        }
        Update: {
          callback_count?: number | null
          campaign_date?: string | null
          campaign_name?: string | null
          completed_at?: string | null
          contacted_count?: number | null
          duration_minutes?: never
          id?: string | null
          qualification_rate?: never
          qualified_count?: number | null
          response_count?: number | null
          response_rate?: never
          sms_reply_count?: number | null
          started_at?: string | null
          status?: string | null
          total_prospects?: number | null
        }
        Relationships: []
      }
      daily_kpi_summary: {
        Row: {
          avg_reconnection_rate: number | null
          metric_date: string | null
          total_callbacks: number | null
          total_confused: number | null
          total_contacted: number | null
          total_interested: number | null
          total_not_interested: number | null
          total_reconnected: number | null
          total_sms_responses: number | null
        }
        Relationships: []
      }
      prospect_engagement: {
        Row: {
          bobex_id: number | null
          company: string | null
          contact_count: number | null
          firstname: string | null
          id: string | null
          language: string | null
          last_contact_date: string | null
          last_response_date: string | null
          lastname: string | null
          phone: string | null
          qualification_status: string | null
          total_attempts: number | null
          total_responses: number | null
          vendor_email: string | null
          vendor_name: string | null
        }
        Relationships: []
      }
      vendor_performance: {
        Row: {
          callbacks: number | null
          interested_prospects: number | null
          not_interested_prospects: number | null
          reconnection_rate: number | null
          total_prospects: number | null
          total_responses: number | null
          vendor_email: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_reconnection_rate: {
        Args: { p_campaign_id: string }
        Returns: number
      }
      get_conversation_thread: {
        Args: { p_limit?: number; p_prospect_id: string }
        Returns: {
          delivered_at: string
          message_content: string
          message_direction: string
          message_id: string
          sent_at: string
          twilio_sid: string
        }[]
      }
      get_next_prospect_batch: {
        Args: {
          p_batch_size?: number
          p_category_id?: number
          p_days_since_contact?: number
          p_language?: string
          p_vendor_id?: string
        }
        Returns: {
          bobex_id: number
          categories: Json
          company: string
          firstname: string
          language: string
          lastname: string
          phone: string
          prospect_id: string
          vendor_email: string
          vendor_id: string
          vendor_name: string
          vendor_phone: string
        }[]
      }
      update_campaign_metrics: {
        Args: { p_campaign_id: string }
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
    Enums: {},
  },
} as const
