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
      documents: {
        Row: {
          content: Json
          created_at: string
          id: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          team_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
  }
}
