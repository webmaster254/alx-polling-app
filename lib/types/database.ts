// Database types for Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
          expires_at: string | null
          is_active: boolean
          allow_multiple_votes: boolean
          total_votes: number
          is_anonymous: boolean
          settings: Record<string, any>
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          is_active?: boolean
          allow_multiple_votes?: boolean
          total_votes?: number
          is_anonymous?: boolean
          settings?: Record<string, any>
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          is_active?: boolean
          allow_multiple_votes?: boolean
          total_votes?: number
          is_anonymous?: boolean
          settings?: Record<string, any>
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          position: number
          votes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          position: number
          votes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          position?: number
          votes_count?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string
          created_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id: string
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_vote: {
        Args: {
          poll_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      get_poll_results: {
        Args: {
          poll_uuid: string
        }
        Returns: {
          option_id: string
          option_text: string
          option_position: number
          votes_count: number
          percentage: number
        }[]
      }
      validate_and_cast_vote: {
        Args: {
          poll_uuid: string
          option_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      create_sample_poll: {
        Args: {
          creator_id: string
          poll_title: string
          poll_description: string
          options: string[]
          allow_multiple?: boolean
          expires_in_days?: number
        }
        Returns: string
      }
      simulate_votes_for_poll: {
        Args: {
          target_poll_id: string
          voter_id: string
          num_votes?: number
        }
        Returns: boolean
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

// Type helpers for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertPoll = Database['public']['Tables']['polls']['Insert']
export type InsertPollOption = Database['public']['Tables']['poll_options']['Insert']
export type InsertVote = Database['public']['Tables']['votes']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdatePoll = Database['public']['Tables']['polls']['Update']
export type UpdatePollOption = Database['public']['Tables']['poll_options']['Update']
export type UpdateVote = Database['public']['Tables']['votes']['Update']

// Extended types for application use
export interface PollWithOptions extends Poll {
  poll_options: PollOption[]
  profiles: Profile
}

export interface PollWithResults extends Poll {
  poll_options: (PollOption & {
    percentage: number
  })[]
  profiles: Profile
}

export interface PollResult {
  option_id: string
  option_text: string
  option_position: number
  votes_count: number
  percentage: number
}