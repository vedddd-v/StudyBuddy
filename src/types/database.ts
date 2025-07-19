export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          academic_level: string;
          bio: string | null;
          phone: string;
          rating: number;
          total_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar_url?: string | null;
          academic_level: string;
          bio?: string | null;
          phone: string;
          rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          academic_level?: string;
          bio?: string | null;
          phone?: string;
          rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          skill_level: string;
          can_help: boolean;
          needs_help: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          skill_level: string;
          can_help?: boolean;
          needs_help?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          skill_level?: string;
          can_help?: boolean;
          needs_help?: boolean;
          created_at?: string;
        };
      };
      help_requests: {
        Row: {
          id: string;
          user_id: string;
          subject_name: string;
          subject_category: string;
          title: string;
          description: string;
          urgency: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_name: string;
          subject_category: string;
          title: string;
          description: string;
          urgency: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_name?: string;
          subject_category?: string;
          title?: string;
          description?: string;
          urgency?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      help_responses: {
        Row: {
          id: string;
          request_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string;
          message?: string;
          created_at?: string;
        };
      };
      tutoring_sessions: {
        Row: {
          id: string;
          tutor_id: string;
          student_id: string;
          subject_name: string;
          subject_category: string;
          scheduled_at: string;
          duration: number;
          status: string;
          meeting_link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tutor_id: string;
          student_id: string;
          subject_name: string;
          subject_category: string;
          scheduled_at: string;
          duration: number;
          status?: string;
          meeting_link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tutor_id?: string;
          student_id?: string;
          subject_name?: string;
          subject_category?: string;
          scheduled_at?: string;
          duration?: number;
          status?: string;
          meeting_link?: string | null;
          created_at?: string;
        };
      };
      study_groups: {
        Row: {
          id: string;
          name: string;
          description: string;
          subject_name: string;
          subject_category: string;
          max_members: number;
          created_by: string;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          subject_name: string;
          subject_category: string;
          max_members: number;
          created_by: string;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          subject_name?: string;
          subject_category?: string;
          max_members?: number;
          created_by?: string;
          is_private?: boolean;
          created_at?: string;
        };
      };
      study_group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          session_id: string | null;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          reviewee_id: string;
          session_id?: string | null;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          session_id?: string | null;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}