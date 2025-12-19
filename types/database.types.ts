/**
 * Tipos generados automáticamente desde Supabase
 * 
 * Para regenerar estos tipos, ejecuta:
 * npx supabase gen types typescript --project-id TU_PROJECT_ID > types/database.types.ts
 * 
 * O usando la URL del proyecto:
 * npx supabase gen types typescript --project-id TU_PROJECT_ID --schema public > types/database.types.ts
 */

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
            universities: {
                Row: {
                    id: number
                    name: string
                }
                Insert: {
                    name: string
                }
                Update: {
                    name?: string
                }
                Relationships: []
            }
            careers: {
                Row: {
                    id: number
                    name: string
                }
                Insert: {
                    name: string
                }
                Update: {
                    name?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    username: string
                    full_name: string | null
                    headline: string | null
                    university_id: number | null
                    career_id: number | null
                    about: string | null
                    avatar_url: string | null
                    email: string | null
                    career_start_date: string | null
                    career_end_date: string | null
                    custom_university: string | null
                    custom_career: string | null
                    interests: string[] | null
                    social_links: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    full_name?: string | null
                    headline?: string | null
                    university_id?: number | null
                    career_id?: number | null
                    about?: string | null
                    avatar_url?: string | null
                    email?: string | null
                    career_start_date?: string | null
                    career_end_date?: string | null
                    custom_university?: string | null
                    custom_career?: string | null
                    interests?: string[] | null
                    social_links?: Json
                }
                Update: {
                    username?: string
                    full_name?: string | null
                    headline?: string | null
                    university_id?: number | null
                    career_id?: number | null
                    about?: string | null
                    avatar_url?: string | null
                    email?: string | null
                    career_start_date?: string | null
                    career_end_date?: string | null
                    custom_university?: string | null
                    custom_career?: string | null
                    interests?: string[] | null
                    social_links?: Json
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_university_id_fkey"
                        columns: ["university_id"]
                        referencedRelation: "universities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "profiles_career_id_fkey"
                        columns: ["career_id"]
                        referencedRelation: "careers"
                        referencedColumns: ["id"]
                    }
                ]
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    content: string | null
                    cover_image: string | null
                    skills: string[]
                    is_startup: boolean
                    is_featured: boolean
                    type: 'academic' | 'startup' | 'personal'
                    demo_url: string | null
                    repo_url: string | null
                    role: string | null
                    challenges: string | null
                    results: string | null
                    team_members: string | null
                    learnings: string | null
                    gallery_images: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    content?: string | null
                    cover_image?: string | null
                    skills?: string[]
                    is_startup?: boolean
                    is_featured?: boolean
                    type?: 'academic' | 'startup' | 'personal'
                    demo_url?: string | null
                    repo_url?: string | null
                    role?: string | null
                    challenges?: string | null
                    results?: string | null
                    team_members?: string | null
                    learnings?: string | null
                    gallery_images?: string[]
                    created_at?: string
                }
                Update: {
                    title?: string
                    description?: string | null
                    content?: string | null
                    cover_image?: string | null
                    skills?: string[]
                    is_startup?: boolean
                    is_featured?: boolean
                    type?: 'academic' | 'startup' | 'personal'
                    demo_url?: string | null
                    repo_url?: string | null
                    role?: string | null
                    challenges?: string | null
                    results?: string | null
                    team_members?: string | null
                    learnings?: string | null
                    gallery_images?: string[]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            achievements: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    organization: string | null
                    date: string | null
                    category: 'award' | 'certification' | 'course_chair' | 'academic_role'
                    professor_name: string | null
                    distinction: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    organization?: string | null
                    date?: string | null
                    category?: 'award' | 'certification' | 'course_chair' | 'academic_role'
                    professor_name?: string | null
                    distinction?: string | null
                }
                Update: {
                    title?: string
                    organization?: string | null
                    date?: string | null
                    category?: 'award' | 'certification' | 'course_chair' | 'academic_role'
                    professor_name?: string | null
                    distinction?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "achievements_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            experiences: {
                Row: {
                    id: string
                    user_id: string
                    role: string
                    company: string
                    start_date: string
                    end_date: string | null
                    description: string | null
                    type: 'job' | 'internship' | 'volunteering' | 'leadership'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role: string
                    company: string
                    start_date: string
                    end_date?: string | null
                    description?: string | null
                    type?: 'job' | 'internship' | 'volunteering' | 'leadership'
                }
                Update: {
                    role?: string
                    company?: string
                    start_date?: string
                    end_date?: string | null
                    description?: string | null
                    type?: 'job' | 'internship' | 'volunteering' | 'leadership'
                }
                Relationships: [
                    {
                        foreignKeyName: "experiences_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            pivots: {
                Row: {
                    id: string
                    user_id: string
                    challenge: string
                    learning: string
                    skills_learned: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    challenge: string
                    learning: string
                    skills_learned?: string[]
                }
                Update: {
                    challenge?: string
                    learning?: string
                    skills_learned?: string[]
                }
                Relationships: [
                    {
                        foreignKeyName: "pivots_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            testimonials: {
                Row: {
                    id: string
                    user_id: string
                    author_name: string
                    author_role: string | null
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    author_name: string
                    author_role?: string | null
                    content: string
                }
                Update: {
                    author_name?: string
                    author_role?: string | null
                    content?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "testimonials_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            project_type: 'academic' | 'startup' | 'personal'
            achievement_type: 'award' | 'certification' | 'course_chair'
            experience_type: 'job' | 'internship' | 'volunteering' | 'leadership'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types para facilitar el uso
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T]

// Tipos específicos para facilitar el uso
export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>
export type Achievement = Tables<'achievements'>
export type Experience = Tables<'experiences'>
export type Pivot = Tables<'pivots'>
export type Testimonial = Tables<'testimonials'>
export type University = Tables<'universities'>
export type Career = Tables<'careers'>
