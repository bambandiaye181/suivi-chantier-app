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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}