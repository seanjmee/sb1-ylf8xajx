export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          goal: string | null
          race_type: string | null
          fitness_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          goal?: string | null
          race_type?: string | null
          fitness_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          goal?: string | null
          race_type?: string | null
          fitness_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      strava_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string
          expires_at?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: string
          distance: number
          duration: number
          date: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          distance: number
          duration: number
          date: string
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          distance?: number
          duration?: number
          date?: string
          source?: string
          created_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          created_at: string
          title: string
          gpt_prompt: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          title: string
          gpt_prompt: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          title?: string
          gpt_prompt?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          date: string
          type: string
          duration: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          date: string
          type: string
          duration: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          date?: string
          type?: string
          duration?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: string
          status: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: string
          status: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: string
          status?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      [_ in string]: unknown
    }
    Enums: {
      [_ in string]: unknown
    }
  }
}