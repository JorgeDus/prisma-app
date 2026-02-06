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
            user_careers: {
                Row: {
                    id: string
                    user_id: string
                    career_id: number | null
                    custom_career: string | null
                    institution: string | null
                    start_year: number | null
                    end_year: number | null
                    is_current: boolean
                    is_primary: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    career_id?: number | null
                    custom_career?: string | null
                    institution?: string | null
                    start_year?: number | null
                    end_year?: number | null
                    is_current?: boolean
                    is_primary?: boolean
                }
                Update: {
                    career_id?: number | null
                    custom_career?: string | null
                    institution?: string | null
                    start_year?: number | null
                    end_year?: number | null
                    is_current?: boolean
                    is_primary?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "user_careers_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_careers_career_id_fkey"
                        columns: ["career_id"]
                        referencedRelation: "careers"
                        referencedColumns: ["id"]
                    }
                ]
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
                    featured_items: { id: string; type: 'project' | 'experience' }[] | null
                    is_paused: boolean
                    paused_at: string | null
                    deletion_requested_at: string | null
                    deletion_token: string | null
                    has_completed_tour: boolean
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
                    featured_items?: { id: string; type: 'project' | 'experience' }[] | null
                    is_paused?: boolean
                    paused_at?: string | null
                    deletion_requested_at?: string | null
                    deletion_token?: string | null
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
                    featured_items?: { id: string; type: 'project' | 'experience' }[] | null
                    is_paused?: boolean
                    paused_at?: string | null
                    deletion_requested_at?: string | null
                    deletion_token?: string | null
                    has_completed_tour?: boolean
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
                    hard_skills: string[]
                    soft_skills: string[]
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
                    show_in_timeline: boolean
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
                    hard_skills?: string[]
                    soft_skills?: string[]
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
                    show_in_timeline?: boolean
                    created_at?: string
                }
                Update: {
                    title?: string
                    description?: string | null
                    content?: string | null
                    cover_image?: string | null
                    hard_skills?: string[]
                    soft_skills?: string[]
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
                    show_in_timeline?: boolean
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
                    end_date: string | null
                    is_current: boolean | null
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
                    end_date?: string | null
                    is_current?: boolean | null
                    category?: 'award' | 'certification' | 'course_chair' | 'academic_role'
                    professor_name?: string | null
                    distinction?: string | null
                }
                Update: {
                    title?: string
                    organization?: string | null
                    date?: string | null
                    end_date?: string | null
                    is_current?: boolean | null
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
                    title: string
                    organization: string | null
                    role: string | null
                    type: 'liderazgo' | 'social' | 'emprendimiento' | 'empleo_sustento' | 'academico' | 'deportivo' | 'creativo' | 'cuidado_vida' | 'otro'
                    description: string | null
                    achievements: string | null
                    value_reflection: string | null
                    start_date: string | null
                    end_date: string | null
                    is_current: boolean | null
                    cover_image: string | null
                    gallery_images: string[] | null
                    hard_skills: string[] | null
                    soft_skills: string[] | null
                    is_featured: boolean | null
                    show_in_timeline: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    organization?: string | null
                    role?: string | null
                    type: 'liderazgo' | 'social' | 'emprendimiento' | 'empleo_sustento' | 'academico' | 'deportivo' | 'creativo' | 'cuidado_vida' | 'otro'
                    description?: string | null
                    achievements?: string | null
                    value_reflection?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean | null
                    cover_image?: string | null
                    gallery_images?: string[] | null
                    hard_skills?: string[] | null
                    soft_skills?: string[] | null
                    is_featured?: boolean | null
                    show_in_timeline?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    title?: string
                    organization?: string | null
                    role?: string | null
                    type?: 'liderazgo' | 'social' | 'emprendimiento' | 'empleo_sustento' | 'academico' | 'deportivo' | 'creativo' | 'cuidado_vida' | 'otro'
                    description?: string | null
                    achievements?: string | null
                    value_reflection?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean | null
                    cover_image?: string | null
                    gallery_images?: string[] | null
                    hard_skills?: string[] | null
                    soft_skills?: string[] | null
                    is_featured?: boolean | null
                    show_in_timeline?: boolean | null
                    updated_at?: string
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
            languages: {
                Row: {
                    id: string
                    user_id: string
                    language: string
                    level: 'Nativo / Bilingüe' | 'Avanzado (C1-C2)' | 'Intermedio (B1-B2)' | 'Básico (A1-A2)'
                    institution: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    language: string
                    level?: 'Nativo / Bilingüe' | 'Avanzado (C1-C2)' | 'Intermedio (B1-B2)' | 'Básico (A1-A2)'
                    institution?: string | null
                }
                Update: {
                    language?: string
                    level?: 'Nativo / Bilingüe' | 'Avanzado (C1-C2)' | 'Intermedio (B1-B2)' | 'Básico (A1-A2)'
                    institution?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "languages_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            connections: {
                Row: {
                    id: string
                    sender_id: string
                    receiver_id: string
                    status: 'pending' | 'accepted' | 'rejected'
                    message: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sender_id: string
                    receiver_id: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    message?: string | null
                }
                Update: {
                    status?: 'pending' | 'accepted' | 'rejected'
                    message?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "connections_sender_id_fkey"
                        columns: ["sender_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "connections_receiver_id_fkey"
                        columns: ["receiver_id"]
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
            experience_type: 'liderazgo' | 'social' | 'emprendimiento' | 'empleo_sustento' | 'academico' | 'deportivo' | 'creativo' | 'cuidado_vida' | 'otro'
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
export type Language = Tables<'languages'>
export type University = Tables<'universities'>
export type Career = Tables<'careers'>
export type UserCareer = Tables<'user_careers'>
export type Connection = Tables<'connections'>
