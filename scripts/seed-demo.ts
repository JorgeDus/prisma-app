/**
 * Seed Script — Universidad Mistral (Demo)
 * =========================================
 * Popula la BD de demo con:
 * - La universidad ficticia "Universidad Mistral"
 * - 18 perfiles de estudiantes ficticios verosímiles
 * - Proyectos, experiencias, logros y habilidades curadas
 * - Una cuenta universitaria para el portal
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/seed-demo.ts
 *
 * Para limpiar:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/seed-demo.ts --cleanup
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌  Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

// ============================================================
// IDENTIDAD DE LA UNIVERSIDAD FICTICIA
// ============================================================
const UNIVERSITY = {
    name: 'Universidad Mistral',
    slug: 'universidad-mistral',
    logo_url: 'public\logo-universidad-mistral.png', // subir el logo generado aquí
    domain: 'mistral.cl',
}

// ============================================================
// CUENTA DEL PORTAL UNIVERSIDAD (para el layout guard)
// ============================================================
const UNIVERSITY_PORTAL_ACCOUNT = {
    email: 'portal@mistral.cl',
    password: 'PrismaDemo2026!',
    full_name: 'Carmen Valdebenito',
    position: 'Directora de Empleabilidad',
}

// ============================================================
// CARRERAS DE LA UNIVERSIDAD MISTRAL
// Nota: las carreras ya existen en la tabla 'careers'.
// Usamos los nombres exactos para hacer el lookup del ID.
// ============================================================
const CAREER_NAMES = [
    'Ingeniería en Informática',
    'Psicología',
    'Diseño',
    'Ingeniería Comercial',
    'Periodismo',
    'Administración Pública',
]

// ============================================================
// TIPOS PARA EL ARRAY DE ESTUDIANTES
// ============================================================
type ExperienceType = 'liderazgo' | 'social' | 'emprendimiento' | 'empleo_sustento' | 'academico' | 'deportivo' | 'creativo' | 'cuidado_vida' | 'practica' | 'otro'
type CareerStatus = 'estudiante_activo' | 'disponible_para_practica' | 'en_practica' | 'buscando_primer_empleo' | 'empleado' | 'empleado_fuera_area' | 'emprendiendo' | 'en_posgrado'
type Gender = 'mujer' | 'hombre' | 'no_binario' | 'otro' | 'prefiero_no_decirlo'

interface StudentProject {
    title: string
    description: string
    type: 'academic' | 'startup' | 'personal'
    hard_skills: string[]
    soft_skills: string[]
    is_featured: boolean
    show_in_timeline: boolean
    role?: string
    challenges?: string
    results?: string
    learnings?: string
}

interface StudentExperience {
    title: string
    organization: string
    type: ExperienceType
    description: string
    hard_skills: string[]
    soft_skills: string[]
    is_current: boolean
    role?: string
    achievements?: string
    sector?: string
    internship_area?: string
}

interface StudentAchievement {
    title: string
    category: 'award' | 'certification' | 'course_chair' | 'academic_role'
    organization: string
}

interface Student {
    username: string
    full_name: string
    headline: string
    about: string
    career: string
    interests: string[]
    email: string
    password: string
    completeness: string
    gender?: Gender
    career_status?: CareerStatus
    career_start_date?: string
    projects: StudentProject[]
    experiences: StudentExperience[]
    achievements: StudentAchievement[]
}

// ============================================================
// ESTUDIANTES FICTICIOS
// Distribución: 4 Ing. Informática, 3 Psicología, 3 Diseño,
//               3 Ing. Comercial, 3 Periodismo, 2 Admin. Pública
// Variedad: 6 completos, 7 medios, 5 básicos
// ============================================================
const STUDENTS: Student[] = [
    // --- Ingeniería en Informática (4 estudiantes) ---
    {
        username: 'demo-mistral-matias',
        full_name: 'Matías Fuentes Soto',
        headline: 'Desarrollador Full Stack · Apasionado por el open source',
        about: 'Estudiante de 4to año de Ingeniería en Informática. Me especializo en desarrollo web moderno con React y Node.js. He participado en dos hackatones universitarios y soy parte del club de programación competitiva de la Mistral.',
        career: 'Ingeniería en Informática',
        interests: ['programación', 'open source', 'machine learning', 'música'],
        email: 'demo-mistral-matias@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'EcoTrack — App de huella de carbono personal',
                description: 'Aplicación móvil que calcula y gamifica la reducción de huella de carbono del usuario. Desarrollada en React Native con backend en Supabase.',
                type: 'startup' as const,
                hard_skills: ['React Native', 'TypeScript', 'Supabase', 'Node.js'],
                soft_skills: ['Trabajo en equipo', 'Liderazgo', 'Comunicación'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Sistema de gestión de inventario para PYME',
                description: 'Sistema web completo para control de inventario, ventas y reportes. Proyecto de práctica profesional.',
                type: 'academic' as const,
                hard_skills: ['Next.js', 'PostgreSQL', 'Docker', 'REST APIs'],
                soft_skills: ['Resolución de problemas', 'Gestión del tiempo'],
                is_featured: false,
                show_in_timeline: true,
            },
            {
                title: 'Bot de alertas sísmicas para Twitter/X',
                description: 'Bot que parsea datos del CSN (Chile) y publica alertas sísmicas automáticas con información útil.',
                type: 'personal' as const,
                hard_skills: ['Python', 'APIs', 'Web Scraping', 'Automatización'],
                soft_skills: ['Iniciativa'],
                is_featured: false,
                show_in_timeline: false,
            },
        ],
        experiences: [
            {
                title: 'Desarrollador Frontend Freelance',
                organization: 'Varios clientes',
                type: 'empleo_sustento' as const,
                description: 'Desarrollo de sitios web y landing pages para emprendedores y PYMEs locales.',
                hard_skills: ['React', 'CSS', 'JavaScript'],
                soft_skills: ['Autonomía', 'Comunicación con clientes'],
                is_current: true,
            },
        ],
        achievements: [
            { title: '1er lugar Hackatón FinTech 2025', category: 'award' as const, organization: 'Banco Estado + Corfo' },
            { title: 'AWS Cloud Practitioner', category: 'certification' as const, organization: 'Amazon Web Services' },
        ],
    },
    {
        username: 'demo-mistral-valentina-r',
        full_name: 'Valentina Rojas Mendoza',
        headline: 'Estudiante de Ingeniería en Informática · UX/UI · Data',
        about: 'Me interesa la intersección entre tecnología y experiencia de usuario. Estoy aprendiendo sobre análisis de datos con Python y me encanta el diseño centrado en las personas.',
        career: 'Ingeniería en Informática',
        interests: ['ux', 'data science', 'diseño'],
        email: 'demo-mistral-valentina-r@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Rediseño UX aplicación municipal de trámites',
                description: 'Rediseño completo del flujo de solicitud de trámites en app municipal basado en investigación con usuarios reales. Incluye prototipado en Figma y pruebas de usabilidad.',
                type: 'academic' as const,
                hard_skills: ['Figma', 'UX Research', 'Prototipado', 'Análisis de datos'],
                soft_skills: ['Empatía', 'Comunicación', 'Pensamiento crítico'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Dashboard de análisis de deserción estudiantil',
                description: 'Análisis de datos educativos con Python y visualización interactiva para identificar factores de riesgo de deserción.',
                type: 'academic' as const,
                hard_skills: ['Python', 'Pandas', 'Matplotlib', 'Machine Learning'],
                soft_skills: ['Análisis crítico', 'Trabajo en equipo'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Monitora de Introducción a la Programación',
                organization: 'Universidad Mistral',
                type: 'academico' as const,
                description: 'Apoyo a estudiantes de primer año en cursos introductorios de programación.',
                hard_skills: ['Python', 'Docencia'],
                soft_skills: ['Paciencia', 'Comunicación pedagógica'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Beca de Excelencia Académica 2024', category: 'award' as const, organization: 'Universidad Mistral' },
        ],
    },
    {
        username: 'demo-mistral-rodrigo-n',
        full_name: 'Rodrigo Navarro Vásquez',
        headline: 'Informática · Seguridad informática · CTF player',
        about: 'Enfocado en ciberseguridad y redes. Participo en competencias CTF (Capture the Flag) a nivel nacional.',
        career: 'Ingeniería en Informática',
        interests: ['ciberseguridad', 'redes', 'ctf'],
        email: 'demo-mistral-rodrigo-n@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Herramienta de auditoría de seguridad en redes Wi-Fi',
                description: 'Script en Python para detectar vulnerabilidades comunes en redes inalámbricas en entornos controlados.',
                type: 'personal' as const,
                hard_skills: ['Python', 'Redes', 'Ciberseguridad', 'Linux'],
                soft_skills: ['Pensamiento analítico'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [
            { title: 'Top 50 CTF Nacional Universitario 2025', category: 'award' as const, organization: 'CCC Chile' },
        ],
    },
    {
        username: 'demo-mistral-ana-villalobos',
        full_name: 'Ana Villalobos Castro',
        headline: 'Informática · 1er año',
        about: '',
        career: 'Ingeniería en Informática',
        interests: ['videojuegos', 'programación'],
        email: 'demo-mistral-ana-v@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'Juego de plataformas 2D en Unity',
                description: 'Primer videojuego desarrollado en Unity como proyecto personal de aprendizaje.',
                type: 'personal' as const,
                hard_skills: ['Unity', 'C#'],
                soft_skills: ['Creatividad', 'Perseverancia'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Psicología (3 estudiantes) ---
    {
        username: 'demo-mistral-sofia-p',
        full_name: 'Sofía Parra Jiménez',
        headline: 'Psicóloga en formación · Salud mental · Investigación',
        about: 'Estudiante de 5to año de Psicología con mención en psicología clínica. Realizo mi práctica en un CESFAM de Santiago donde trabajo con adolescentes y familias en situación de vulnerabilidad. Me apasiona la investigación en salud mental comunitaria.',
        career: 'Psicología',
        interests: ['salud mental', 'investigación', 'meditación', 'escritura'],
        email: 'demo-mistral-sofia-p@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Estudio: Bienestar psicológico en estudiantes universitarios post-pandemia',
                description: 'Investigación cuantitativa con muestra de 312 estudiantes universitarios sobre niveles de ansiedad, burnout y bienestar tras la pandemia. Presentado en congreso estudiantil de psicología.',
                type: 'academic' as const,
                hard_skills: ['Investigación cuantitativa', 'SPSS', 'Metodología científica', 'Análisis estadístico'],
                soft_skills: ['Rigor científico', 'Comunicación académica', 'Empatía'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Taller de habilidades socioemocionales para adolescentes',
                description: 'Diseño e implementación de 12 sesiones de taller en liceo técnico-profesional, con foco en regulación emocional e identidad.',
                type: 'academic' as const,
                hard_skills: ['Psicología educacional', 'Diseño instruccional', 'Facilitación grupal'],
                soft_skills: ['Liderazgo', 'Escucha activa', 'Adaptabilidad'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — CESFAM Villa El Vergel',
                organization: 'CESFAM Villa El Vergel, SSMS',
                type: 'academico' as const,
                description: 'Atención psicológica individual y grupal a adolescentes y familias. Participación en programa de salud mental escolar.',
                hard_skills: ['Psicoterapia', 'Evaluación psicológica', 'Diagnóstico clínico'],
                soft_skills: ['Empatía', 'Contención emocional', 'Trabajo en equipo interdisciplinario'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Mejor ponencia — X Congreso Estudiantil de Psicología', category: 'award' as const, organization: 'SCP Chile' },
        ],
    },
    {
        username: 'demo-mistral-benjamin-a',
        full_name: 'Benjamín Araya Torres',
        headline: 'Psicología organizacional · RRHH · Bienestar laboral',
        about: 'Me interesa la psicología del trabajo y las organizaciones. Estoy desarrollando mi tesis sobre liderazgo transformacional en startups tecnológicas chilenas.',
        career: 'Psicología',
        interests: ['recursos humanos', 'psicología organizacional', 'startups'],
        email: 'demo-mistral-benjamin-a@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Tesis: Liderazgo transformacional en startups chilenas',
                description: 'Investigación cualitativa con entrevistas en profundidad a fundadores y empleados de 8 startups de etapa temprana.',
                type: 'academic' as const,
                hard_skills: ['Investigación cualitativa', 'Análisis de contenido', 'Entrevistas'],
                soft_skills: ['Curiosidad intelectual', 'Comunicación', 'Organización'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Asistente de RRHH',
                organization: 'Constructora Andina SpA',
                type: 'empleo_sustento' as const,
                description: 'Apoyo en procesos de reclutamiento, onboarding y bienestar de los trabajadores.',
                hard_skills: ['Reclutamiento', 'Evaluación de desempeño'],
                soft_skills: ['Organización', 'Comunicación interpersonal'],
                is_current: false,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-isadora-m',
        full_name: 'Isadora Molina Reyes',
        headline: 'Psicología · Voluntariado · Derechos humanos',
        about: '',
        career: 'Psicología',
        interests: ['derechos humanos', 'feminismo', 'teatro'],
        email: 'demo-mistral-isadora-m@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [],
        experiences: [
            {
                title: 'Voluntaria — Línea de crisis telefónica',
                organization: 'Fundación Paréntesis',
                type: 'social' as const,
                description: 'Atención y contención emocional telefónica a personas en crisis.',
                hard_skills: ['Escucha activa', 'Intervención en crisis'],
                soft_skills: ['Empatía', 'Resiliencia', 'Responsabilidad'],
                is_current: true,
            },
        ],
        achievements: [],
    },

    // --- Diseño (3 estudiantes) ---
    {
        username: 'demo-mistral-camila-s',
        full_name: 'Camila Sepúlveda Núñez',
        headline: 'Diseñadora · Branding · Identidad visual · Motion',
        about: 'Diseñadora en 4to año con foco en branding y comunicación visual para instituciones sociales y culturales. He trabajado con ONGs y organizaciones comunitarias en el diseño de su identidad visual.',
        career: 'Diseño',
        interests: ['branding', 'tipografía', 'cine', 'diseño social'],
        email: 'demo-mistral-camila-s@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Identidad visual — Colectivo Feminista Raíz',
                description: 'Sistema de identidad visual completo: logo, paleta, tipografía, aplicaciones en redes sociales y material impreso para colectivo feminista interseccional.',
                type: 'personal' as const,
                hard_skills: ['Adobe Illustrator', 'Branding', 'Diseño editorial', 'Figma'],
                soft_skills: ['Creatividad', 'Escucha activa', 'Trabajo en equipo'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Campaña gráfica — Reciclaje urbano Municipalidad Ñuñoa',
                description: 'Diseño de campaña de comunicación visual para incentivar reciclaje en espacio urbano. Incluye señalética, afiches y piezas digitales.',
                type: 'academic' as const,
                hard_skills: ['Diseño de campaña', 'Ilustración vectorial', 'Diseño de señalética'],
                soft_skills: ['Pensamiento sistémico', 'Comunicación'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Animación — Corto documental sobre artesanas mapuche',
                description: 'Motion graphics y animación para documental universitario sobre tejedoras mapuche de La Araucanía.',
                type: 'academic' as const,
                hard_skills: ['After Effects', 'Motion Design', 'Ilustración'],
                soft_skills: ['Sensibilidad cultural', 'Creatividad'],
                is_featured: false,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Diseñadora freelance',
                organization: 'Autogestión',
                type: 'empleo_sustento' as const,
                description: 'Diseño de identidades visuales, piezas para redes sociales y material gráfico para pequeñas organizaciones.',
                hard_skills: ['Adobe Suite', 'Canva Pro', 'Gestión de cliente'],
                soft_skills: ['Autonomía', 'Puntualidad', 'Adaptabilidad'],
                is_current: true,
            },
        ],
        achievements: [
            { title: '2do lugar — Concurso de Diseño Social SERNAC 2025', category: 'award' as const, organization: 'SERNAC' },
        ],
    },
    {
        username: 'demo-mistral-tomas-l',
        full_name: 'Tomás Larrañaga Vega',
        headline: 'Diseño UX · Producto digital · Startup',
        about: 'Estudiante de diseño con foco en experiencia de usuario y producto digital. Cofundé una startup de tecnología educativa con dos compañeros de informática.',
        career: 'Diseño',
        interests: ['ux', 'startups', 'educación', 'café'],
        email: 'demo-mistral-tomas-l@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'EduPath — Plataforma adaptativa de aprendizaje',
                description: 'Startup de edtech. Diseñé la experiencia completa de usuario: investigación, wireframes, prototipo, sistema de diseño y handoff al equipo de desarrollo.',
                type: 'startup' as const,
                hard_skills: ['Figma', 'UX Research', 'Design Systems', 'Prototipado'],
                soft_skills: ['Liderazgo', 'Entrepreneurship', 'Comunicación'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Co-fundador y Head of Design',
                organization: 'EduPath',
                type: 'emprendimiento' as const,
                description: 'Liderando el diseño de producto en startup de educación adaptativa.',
                hard_skills: ['Product Design', 'Design Strategy'],
                soft_skills: ['Emprendimiento', 'Liderazgo', 'Visión de producto'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-fernanda-o',
        full_name: 'Fernanda Olmedo Pizarro',
        headline: 'Diseño · Ilustración · Primer año',
        about: '',
        career: 'Diseño',
        interests: ['ilustración', 'manga', 'pintura'],
        email: 'demo-mistral-fernanda-o@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'Portafolio de ilustración digital',
                description: 'Serie de ilustraciones digitales con temática fantástica y folklore latinoamericano.',
                type: 'personal' as const,
                hard_skills: ['Procreate', 'Illustrador Digital', 'Composición'],
                soft_skills: ['Creatividad', 'Constancia'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Ingeniería Comercial (3 estudiantes) ---
    {
        username: 'demo-mistral-lucas-t',
        full_name: 'Lucas Tapia Guerrero',
        headline: 'Ing. Comercial · Finanzas · Emprendimiento · Inversiones',
        about: 'Estudiante de Ingeniería Comercial con foco en finanzas corporativas y mercados de capitales. Dirijo el club de inversiones de la Mistral con 40 miembros activos. Estoy desarrollando una tesis sobre el impacto del capital de riesgo en el ecosistema emprendedor chileno.',
        career: 'Ingeniería Comercial',
        interests: ['finanzas', 'inversiones', 'startups', 'trail running'],
        email: 'demo-mistral-lucas-t@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Fondo de inversión estudiantil — Club Mistral Capital',
                description: 'Diseño y gestión de un portafolio simulado de inversiones con $5M CLP en capital real gestionado por estudiantes bajo supervisión académica.',
                type: 'academic' as const,
                hard_skills: ['Análisis financiero', 'Valoración de empresas', 'Excel avanzado', 'Bloomberg Terminal'],
                soft_skills: ['Liderazgo', 'Toma de decisiones bajo incertidumbre', 'Trabajo en equipo'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Consultoría: Plan de expansión para PYME vitivinícola',
                description: 'Análisis estratégico y plan de expansión a mercado asiático para bodega familiar del Valle del Maule.',
                type: 'academic' as const,
                hard_skills: ['Análisis estratégico', 'Investigación de mercado', 'Modelamiento financiero'],
                soft_skills: ['Pensamiento crítico', 'Comunicación ejecutiva'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Presidente Club de Inversiones Mistral Capital',
                organization: 'Universidad Mistral',
                type: 'liderazgo' as const,
                description: 'Dirección del club con 40 miembros. Organización de charlas, análisis de casos y gestión del portafolio estudiantil.',
                hard_skills: ['Gestión organizacional', 'Análisis de inversiones'],
                soft_skills: ['Liderazgo', 'Networking', 'Oratoria'],
                is_current: true,
            },
            {
                title: 'Analista de inversiones Jr. (práctica)',
                organization: 'Banchile Inversiones',
                type: 'academico' as const,
                description: 'Apoyo en análisis de renta fija y elaboración de reportes de mercado.',
                hard_skills: ['Reuters', 'Excel VBA', 'Análisis de renta fija'],
                soft_skills: ['Atención al detalle', 'Trabajo bajo presión'],
                is_current: false,
            },
        ],
        achievements: [
            { title: 'CFA Institute Research Challenge — Finalista nacional', category: 'award' as const, organization: 'CFA Society Chile' },
            { title: 'Beca de Mérito Santander Universidades', category: 'award' as const, organization: 'Banco Santander' },
        ],
    },
    {
        username: 'demo-mistral-paula-ce',
        full_name: 'Paula Cerda Espinoza',
        headline: 'Ingeniería Comercial · Marketing · Contenido digital',
        about: 'Me interesa el marketing digital y la estrategia de contenido. Administro las redes sociales de una startup de moda sustentable mientras estudio.',
        career: 'Ingeniería Comercial',
        interests: ['marketing', 'moda sostenible', 'redes sociales'],
        email: 'demo-mistral-paula-ce@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Estrategia de marketing digital — Startup Hilo Limpio',
                description: 'Diseño e implementación de estrategia de contenido, pauta digital y growth hacking para startup de moda sustentable. Crecimiento de 0 a 8k seguidores en 6 meses.',
                type: 'personal' as const,
                hard_skills: ['Meta Ads', 'Google Analytics', 'Content Strategy', 'Canva'],
                soft_skills: ['Creatividad', 'Orientación a resultados', 'Adaptabilidad'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Social Media Manager',
                organization: 'Hilo Limpio SpA',
                type: 'empleo_sustento' as const,
                description: 'Gestión de redes sociales, creación de contenido y pauta digital.',
                hard_skills: ['Instagram', 'TikTok', 'Estrategia de contenido'],
                soft_skills: ['Creatividad', 'Planificación'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-ignacio-b',
        full_name: 'Ignacio Bravo Medina',
        headline: 'Ingeniería Comercial · 2do año',
        about: '',
        career: 'Ingeniería Comercial',
        interests: ['economía', 'política', 'fútbol'],
        email: 'demo-mistral-ignacio-b@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'Proyecto de microeconomía — Análisis del mercado de avocados',
                description: 'Análisis econométrico del mercado del palta en Chile para curso de Microeconomía II.',
                type: 'academic' as const,
                hard_skills: ['Econometría', 'Excel', 'R'],
                soft_skills: ['Análisis cuantitativo'],
                is_featured: true,
                show_in_timeline: false,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Periodismo (3 estudiantes) ---
    {
        username: 'demo-mistral-josefina-r',
        full_name: 'Josefina Ramírez Aguilera',
        headline: 'Periodista en formación · Periodismo de datos · Investigación',
        about: 'Apasionada del periodismo de investigación y los datos. Trabajo en el periódico universitario de la Mistral y estoy desarrollando un reportaje sobre contratos públicos en Chile usando datos del Portal de Transparencia.',
        career: 'Periodismo',
        interests: ['periodismo de datos', 'transparencia', 'fotografía'],
        email: 'demo-mistral-josefina-r@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: '"El negocio de la sequía" — Reportaje de investigación',
                description: 'Reportaje de investigación sobre empresas que lucran con la crisis hídrica en la Región de Coquimbo. Publicado en el periódico universitario y referenciado por medios regionales.',
                type: 'academic' as const,
                hard_skills: ['Investigación periodística', 'Entrevistas', 'Análisis de datos públicos', 'Redacción'],
                soft_skills: ['Rigor', 'Perseverancia', 'Ética profesional'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Podcast "Norte Grande" — Historias del desierto',
                description: 'Podcast de 8 episodios sobre cultura, historia y comunidades del norte de Chile.',
                type: 'personal' as const,
                hard_skills: ['Producción de audio', 'Guionismo', 'Edición sonora', 'Entrevistas'],
                soft_skills: ['Creatividad', 'Curiosidad', 'Narrativa'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Editora — El Vértice (periódico universitario)',
                organization: 'Universidad Mistral',
                type: 'liderazgo' as const,
                description: 'Dirección editorial del periódico estudiantil. Coordinación de un equipo de 12 periodistas y fotógrafos.',
                hard_skills: ['Edición periodística', 'Gestión editorial', 'SEO'],
                soft_skills: ['Liderazgo', 'Criterio editorial', 'Trabajo en equipo'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Premio CIPER a la Mejor Investigación Universitaria 2025', category: 'award' as const, organization: 'CIPER Chile' },
        ],
    },
    {
        username: 'demo-mistral-pablo-h',
        full_name: 'Pablo Herrera Contreras',
        headline: 'Periodismo · Audiovisual · Redes sociales',
        about: 'Estudiante de periodismo con foco en contenido audiovisual. Produzco videos para YouTube sobre cultura pop chilena.',
        career: 'Periodismo',
        interests: ['cine', 'videos', 'cultura pop'],
        email: 'demo-mistral-pablo-h@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Canal de YouTube "Cultura Coyuntura"',
                description: 'Canal de análisis cultural y político desde una perspectiva generacional. 12k suscriptores, videos de análisis de 10-20 min.',
                type: 'personal' as const,
                hard_skills: ['Producción audiovisual', 'Edición en Premiere', 'Guionismo', 'SEO'],
                soft_skills: ['Comunicación', 'Creatividad', 'Consistencia'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [],
    },
    {
        username: 'demo-mistral-nicole-f',
        full_name: 'Nicole Fuentes Bravo',
        headline: 'Periodismo · 1er año · Comunicación',
        about: '',
        career: 'Periodismo',
        interests: ['escritura', 'música', 'teatro'],
        email: 'demo-mistral-nicole-f@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [],
        experiences: [
            {
                title: 'Community manager — Banda de música local',
                organization: 'Contraluz (banda)',
                type: 'empleo_sustento' as const,
                description: 'Gestión de redes sociales e imagen digital de banda de música indie.',
                hard_skills: ['Redes sociales', 'Redacción'],
                soft_skills: ['Creatividad', 'Responsabilidad'],
                is_current: true,
            },
        ],
        achievements: [],
    },

    // --- Administración Pública (2 estudiantes) ---
    {
        username: 'demo-mistral-andres-q',
        full_name: 'Andrés Quiroga Salinas',
        headline: 'Administración Pública · Políticas sociales · Innovación pública',
        about: 'Estudiante de administración pública con foco en innovación en el Estado. Participé en el programa de gobierno innovador del LABGob (Laboratorio de Gobierno de Chile).',
        career: 'Administración Pública',
        interests: ['política pública', 'innovación', 'datos abiertos'],
        email: 'demo-mistral-andres-q@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Rediseño del proceso de postulación a subsidio habitacional',
                description: 'Proyecto de innovación pública aplicando design thinking para simplificar el proceso de postulación al subsidio DS19. Reducción del 40% en tiempo promedio de trámite.',
                type: 'academic' as const,
                hard_skills: ['Design thinking', 'Investigación usuaria', 'Gestión de proyectos', 'Datos abiertos'],
                soft_skills: ['Empatía', 'Pensamiento sistémico', 'Liderazgo'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Pasante — Laboratorio de Gobierno (LABGob)',
                organization: 'Ministerio de Hacienda, Chile',
                type: 'academico' as const,
                description: 'Apoyo en proyectos de innovación pública y service design para servicios del Estado.',
                hard_skills: ['Innovación pública', 'Facilitación', 'Prototipado de servicios'],
                soft_skills: ['Trabajo en equipo', 'Adaptabilidad', 'Orientación ciudadana'],
                is_current: false,
            },
        ],
        achievements: [
            { title: 'Seleccionado — Programa Gobierno Innovador LABGob 2025', category: 'award' as const, organization: 'LABGob Chile' },
        ],
    },
    {
        username: 'demo-mistral-carolina-z',
        full_name: 'Carolina Zúñiga Morales',
        headline: 'Administración Pública · 3er año',
        about: 'Interesada en políticas de género e inclusión en el sector público.',
        career: 'Administración Pública',
        interests: ['género', 'políticas sociales', 'feminismo'],
        email: 'demo-mistral-carolina-z@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Análisis: Brechas de género en cargos directivos del sector público chileno',
                description: 'Análisis de datos del Sistema de Alta Dirección Pública sobre representación de mujeres en cargos de jefatura.',
                type: 'academic' as const,
                hard_skills: ['Análisis de datos públicos', 'Excel', 'Investigación documental'],
                soft_skills: ['Análisis crítico', 'Redacción académica'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Voluntaria — Observatorio de Género',
                organization: 'Universidad Mistral',
                type: 'social' as const,
                description: 'Recopilación y análisis de datos sobre género en el ámbito universitario.',
                hard_skills: ['Investigación'],
                soft_skills: ['Compromiso social', 'Trabajo en equipo'],
                is_current: true,
            },
        ],
        achievements: [],
    },

    // ============================================================
    // NUEVOS ESTUDIANTES (20 adicionales)
    // ============================================================

    // --- Ingeniería en Informática — 4 nuevos ---
    {
        username: 'demo-mistral-diego-ac',
        full_name: 'Diego Acuña Contreras',
        headline: 'Ingeniería en Informática · Backend · APIs · DevOps',
        about: 'Estudiante de 3er año especializado en backend y arquitectura de microservicios. Actualmente haciendo mi práctica profesional en una fintech. Me apasiona automatizar procesos y construir APIs robustas.',
        career: 'Ingeniería en Informática',
        gender: 'hombre',
        career_status: 'en_practica',
        career_start_date: '2023-03-01',
        interests: ['backend', 'devops', 'ciclismo', 'café'],
        email: 'demo-mistral-diego-ac@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'API de pagos en tiempo real para POS móvil',
                description: 'API RESTful en Node.js para procesamiento de pagos en tiempo real, con soporte para múltiples medios de pago. Integra notificaciones webhooks y auditoría de transacciones.',
                type: 'startup' as const,
                role: 'Backend Developer — Diseño de endpoints, seguridad y despliegue en contenedores',
                challenges: 'El principal desafío fue garantizar la idempotencia de las transacciones bajo condiciones de red inestable en dispositivos móviles.',
                results: 'Sistema procesando +500 transacciones/día en producción con 99.8% de uptime en el primer mes.',
                learnings: 'Profundicé en patrones de retry logic, circuit breakers y manejo de estado en sistemas distribuidos.',
                hard_skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'],
                soft_skills: ['Trabajo en equipo', 'Comunicación técnica', 'Autonomía'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Pipeline CI/CD para microservicios con GitHub Actions',
                description: 'Implementación de pipeline de integración y despliegue continuo para un ecosistema de 5 microservicios, incluyendo pruebas automatizadas, análisis estático y despliegue a staging/producción.',
                type: 'academic' as const,
                role: 'DevOps Engineer — Diseño e implementación del pipeline completo',
                challenges: 'Coordinar el orden de despliegue entre servicios con dependencias entre sí sin generar downtime.',
                results: 'Reducción del tiempo de despliegue de 45 minutos manuales a 8 minutos automatizados.',
                learnings: 'Aprendí sobre estrategias de deployment (blue-green, canary) y la importancia del rollback automatizado.',
                hard_skills: ['GitHub Actions', 'Docker', 'Terraform', 'Bash', 'Jest'],
                soft_skills: ['Planificación', 'Pensamiento sistémico'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Backend Developer',
                organization: 'Paggo Technologies SpA',
                type: 'practica' as const,
                sector: 'Privado',
                internship_area: 'Desarrollo de software',
                role: 'Desarrollador Backend Jr.',
                description: 'Desarrollo y mantención de microservicios en Node.js para plataforma de pagos digitales. Participación en code reviews y reuniones de arquitectura.',
                achievements: 'Reducé el tiempo de respuesta del endpoint de consulta de saldo en 30% mediante caching con Redis.',
                hard_skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
                soft_skills: ['Proactividad', 'Aprendizaje continuo', 'Responsabilidad'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Mención honrosa — Hackatón Fintech Latam 2025', category: 'award' as const, organization: 'Finnovista' },
        ],
    },
    {
        username: 'demo-mistral-karla-vp',
        full_name: 'Karla Valdés Peña',
        headline: 'Informática · Data Engineering · Machine Learning',
        about: 'Apasionada por el análisis de datos a gran escala y los modelos de machine learning aplicados a problemas reales. Trabajo en mi tesis sobre predicción de demanda energética con redes neuronales recurrentes.',
        career: 'Ingeniería en Informática',
        gender: 'mujer',
        career_status: 'disponible_para_practica',
        career_start_date: '2022-03-01',
        interests: ['machine learning', 'datos', 'fotografía', 'tenis'],
        email: 'demo-mistral-karla-vp@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Modelo de predicción de demanda eléctrica — Tesis',
                description: 'Desarrollo de modelo LSTM para predicción horaria de demanda eléctrica en el Sistema Eléctrico Nacional chileno. Entrenado con 5 años de datos históricos del Coordinador Eléctrico Nacional.',
                type: 'academic' as const,
                role: 'Investigadora principal — Preprocesamiento de datos, diseño del modelo y evaluación',
                challenges: 'La alta estacionalidad y la presencia de outliers por eventos climáticos extremos dificultaron la generalización del modelo.',
                results: 'MAPE de 2.3% en horizonte de predicción de 24 horas, superando el baseline en 40%.',
                learnings: 'La ingeniería de features fue más determinante que la arquitectura del modelo; aprendí a priorizar el análisis exploratorio antes de modelar.',
                hard_skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Scikit-learn'],
                soft_skills: ['Rigor científico', 'Pensamiento analítico', 'Perseverancia'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Dashboard de visualización de datos climáticos en tiempo real',
                description: 'Aplicación web que consume APIs de estaciones meteorológicas y presenta visualizaciones interactivas de temperatura, precipitación y viento para 40 comunas de Chile.',
                type: 'personal' as const,
                hard_skills: ['Python', 'Dash/Plotly', 'APIs REST', 'PostgreSQL'],
                soft_skills: ['Autonomía', 'Diseño orientado al usuario'],
                is_featured: false,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Ayudante de Inteligencia Artificial',
                organization: 'Universidad Mistral',
                type: 'academico' as const,
                role: 'Ayudante docente',
                description: 'Corrección de trabajos prácticos y apoyo en laboratorios del curso de IA para estudiantes de 4to año.',
                hard_skills: ['Python', 'Machine Learning', 'Docencia'],
                soft_skills: ['Comunicación pedagógica', 'Paciencia'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Premio investigación estudiantil — Congreso JCCALP 2025', category: 'award' as const, organization: 'JCCALP Chile' },
            { title: 'Google Data Analytics Certificate', category: 'certification' as const, organization: 'Google / Coursera' },
        ],
    },
    {
        username: 'demo-mistral-franco-es',
        full_name: 'Franco Espinoza Salas',
        headline: 'Informática · Ciberseguridad · Redes · Pentesting',
        about: 'Especializado en seguridad ofensiva y análisis de vulnerabilidades. Certificado en ethical hacking y actualmente haciendo práctica en un banco estatal.',
        career: 'Ingeniería en Informática',
        gender: 'hombre',
        career_status: 'en_practica',
        career_start_date: '2021-03-01',
        interests: ['ciberseguridad', 'ctf', 'música electrónica'],
        email: 'demo-mistral-franco-es@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Plataforma de entrenamiento CTF para estudiantes',
                description: 'Plataforma web con desafíos de ciberseguridad categorizados por nivel y área (web, crypto, reverse, forensics). Usada por 80+ estudiantes de la carrera.',
                type: 'personal' as const,
                role: 'Creador y mantención — Frontend, backend y diseño de desafíos',
                results: 'La plataforma fue adoptada por el club de ciberseguridad de la Mistral como herramienta oficial de entrenamiento.',
                hard_skills: ['Python', 'Flask', 'Linux', 'Docker', 'CTF challenges'],
                soft_skills: ['Liderazgo', 'Iniciativa', 'Pedagogía'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Analista de Seguridad',
                organization: 'BancoEstado',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Ciberseguridad',
                role: 'Analista de seguridad Jr.',
                description: 'Participación en evaluaciones de seguridad de aplicaciones internas (DAST/SAST), gestión de vulnerabilidades y apoyo al equipo de SOC.',
                achievements: 'Identifiqué 3 vulnerabilidades XSS en portales internos durante auditoría de aplicaciones web, las cuales fueron remediadas antes del cierre de práctica.',
                hard_skills: ['Burp Suite', 'Nmap', 'OWASP', 'Python scripting', 'SIEM'],
                soft_skills: ['Discreción', 'Atención al detalle', 'Trabajo bajo presión'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'eJPT Certified (eLearnSecurity Junior Penetration Tester)', category: 'certification' as const, organization: 'eLearnSecurity' },
        ],
    },
    {
        username: 'demo-mistral-pilar-mo',
        full_name: 'Pilar Morales Osorio',
        headline: 'Informática · 2do año · App Development',
        about: '',
        career: 'Ingeniería en Informática',
        gender: 'mujer',
        career_status: 'estudiante_activo',
        career_start_date: '2025-03-01',
        interests: ['apps móviles', 'diseño', 'K-pop'],
        email: 'demo-mistral-pilar-mo@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'App de hábitos diarios en React Native',
                description: 'Aplicación móvil para seguimiento de hábitos con notificaciones y estadísticas semanales, desarrollada como proyecto personal de aprendizaje.',
                type: 'personal' as const,
                hard_skills: ['React Native', 'JavaScript', 'Expo'],
                soft_skills: ['Constancia', 'Autodidacta'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Psicología — 3 nuevos ---
    {
        username: 'demo-mistral-constanza-vr',
        full_name: 'Constanza Vargas Ríos',
        headline: 'Psicología Educacional · Evaluación · Neuropsicología',
        about: 'Estudiante de 4to año con mención en psicología educacional. Me especializo en evaluación psicopedagógica de niños con NEE y dificultades de aprendizaje. Actualmente haciendo práctica en colegio municipal de Santiago.',
        career: 'Psicología',
        gender: 'mujer',
        career_status: 'en_practica',
        career_start_date: '2022-03-01',
        interests: ['neuropsicología', 'educación inclusiva', 'cerámica'],
        email: 'demo-mistral-constanza-vr@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Protocolo de detección temprana de dislexia en 1er ciclo básico',
                description: 'Diseño y validación de protocolo de screening para detección de riesgo de dislexia en estudiantes de 1ro a 4to básico. Aplicado en muestra piloto de 60 estudiantes de tres colegios.',
                type: 'academic' as const,
                role: 'Investigadora y psicóloga evaluadora',
                challenges: 'Adaptar los instrumentos estandarizados para contextos de alta vulnerabilidad socioeconómica donde los referentes culturales difieren.',
                results: 'El protocolo mostró sensibilidad del 87% y especificidad del 79% en la muestra piloto.',
                learnings: 'La evaluación psicopedagógica requiere siempre un enfoque contextual y ecosistémico, nunca reduccionista.',
                hard_skills: ['Evaluación psicopedagógica', 'WISC-V', 'Cumanin', 'Análisis estadístico'],
                soft_skills: ['Empatía', 'Rigor científico', 'Comunicación con familias'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Taller de funciones ejecutivas para estudiantes con TDAH',
                description: 'Diseño e implementación de programa de 10 sesiones basado en evidencia para fortalecer planificación, memoria de trabajo e inhibición en niños con TDAH de 8-12 años.',
                type: 'academic' as const,
                hard_skills: ['Psicología educacional', 'Neuropsicología clínica', 'Diseño de programas'],
                soft_skills: ['Paciencia', 'Creatividad', 'Manejo de grupos'],
                is_featured: false,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Psicóloga educacional',
                organization: 'Colegio Municipal Diego Portales, Santiago',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Psicología educacional',
                role: 'Psicóloga practicante',
                description: 'Evaluación psicopedagógica de estudiantes con NEE, diseño de adecuaciones curriculares y trabajo con equipos PIE. Atención de casos individuales y trabajo con familias.',
                achievements: 'Elaboré 14 informes de evaluación psicopedagógica y coordiné 8 reuniones interdisciplinarias con docentes y especialistas.',
                hard_skills: ['Evaluación psicológica', 'Diagnóstico diferencial', 'Coordinación PIE'],
                soft_skills: ['Empatía', 'Trabajo interdisciplinario', 'Gestión del tiempo'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Mejor poster — XII Jornadas de Psicología Educacional', category: 'award' as const, organization: 'SOCHIPE' },
        ],
    },
    {
        username: 'demo-mistral-emilio-cc',
        full_name: 'Emilio Castro Carrasco',
        headline: 'Psicología · Clínica · Psicoanálisis · Masculinidades',
        about: 'Estudiante de psicología con interés en psicología clínica y perspectiva de género aplicada al trabajo con hombres. Voluntario en programa de prevención de violencia de pareja.',
        career: 'Psicología',
        gender: 'hombre',
        career_status: 'estudiante_activo',
        career_start_date: '2022-03-01',
        interests: ['psicoanálisis', 'masculinidades', 'literatura', 'ajedrez'],
        email: 'demo-mistral-emilio-cc@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Estudio cualitativo: Identidad masculina y búsqueda de ayuda psicológica',
                description: 'Investigación con metodología de teoría fundamentada sobre las barreras que enfrentan los hombres para consultar a un psicólogo. 12 entrevistas en profundidad con hombres de 20-35 años.',
                type: 'academic' as const,
                role: 'Investigador principal',
                challenges: 'Generar rapport con participantes que nunca habían hablado con un psicólogo fue el mayor desafío metodológico.',
                hard_skills: ['Investigación cualitativa', 'Teoría fundamentada', 'Atlas.ti', 'Entrevistas'],
                soft_skills: ['Empatía', 'Escucha activa', 'Análisis crítico'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Voluntario — Programa de prevención VIF',
                organization: 'SernamEg',
                type: 'social' as const,
                description: 'Facilitación de talleres de prevención de violencia intrafamiliar con grupos de hombres derivados judicialmente.',
                hard_skills: ['Facilitación grupal', 'Psicoeducación', 'Intervención en violencia'],
                soft_skills: ['Contención', 'Manejo de conflictos', 'Flexibilidad'],
                is_current: false,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-mariana-lb',
        full_name: 'Mariana Lagos Bravo',
        headline: 'Psicología · 1er año',
        about: '',
        career: 'Psicología',
        gender: 'no_binario',
        career_status: 'estudiante_activo',
        career_start_date: '2025-03-01',
        interests: ['arte', 'salud mental', 'música', 'fotografía'],
        email: 'demo-mistral-mariana-lb@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [],
        experiences: [
            {
                title: 'Tallerista de mindfulness — Centro Comunitario',
                organization: 'Junta de Vecinos Villa Esperanza',
                type: 'social' as const,
                description: 'Facilitación de talleres introductorios de mindfulness y respiración consciente para adultos mayores.',
                hard_skills: ['Facilitación', 'Mindfulness'],
                soft_skills: ['Empatía', 'Comunicación'],
                is_current: true,
            },
        ],
        achievements: [],
    },

    // --- Diseño — 3 nuevos ---
    {
        username: 'demo-mistral-javiera-sm',
        full_name: 'Javiera Sobarzo Mansilla',
        headline: 'Diseño · Diseño de servicio · Innovación social · Experiencia ciudadana',
        about: 'Diseñadora en 5to año enfocada en diseño de servicios públicos y experiencia ciudadana. He trabajado con municipios y servicios del Estado en proyectos de co-diseño con comunidades.',
        career: 'Diseño',
        gender: 'mujer',
        career_status: 'disponible_para_practica',
        career_start_date: '2021-03-01',
        interests: ['diseño de servicios', 'innovación pública', 'tejido', 'permacultura'],
        email: 'demo-mistral-javiera-sm@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Co-diseño del nuevo sistema de filas en registro civil',
                description: 'Proyecto de diseño de servicio para rediseñar la experiencia de espera y atención en el Registro Civil de Pudahuel. Incluyó investigación etnográfica, co-diseño con funcionarios y prototipado rápido.',
                type: 'academic' as const,
                role: 'Diseñadora de servicio líder — Investigación, facilitación y prototipado',
                challenges: 'Trabajar con funcionarios públicos resistentes al cambio y lograr que se apropiaran del proceso de diseño participativo.',
                results: 'Las propuestas fueron adoptadas parcialmente por la dirección regional del SRCeI y se implementaron en 2 sucursales piloto.',
                learnings: 'El diseño de servicios públicos requiere gestión del cambio organizacional tanto como diseño de touchpoints físicos y digitales.',
                hard_skills: ['Service Design', 'Investigación etnográfica', 'Figma', 'Miro', 'Facilitación'],
                soft_skills: ['Escucha activa', 'Gestión de stakeholders', 'Adaptabilidad'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Sistema de señalética inclusiva para hospital público',
                description: 'Rediseño del sistema de señalética del Hospital San Borja Arriarán para mejorar orientación de pacientes con baja alfabetización, adultos mayores y personas en situación de discapacidad.',
                type: 'academic' as const,
                role: 'Diseñadora principal — Investigación con usuarios, diseño de sistema y prototipado',
                hard_skills: ['Diseño inclusivo', 'Señalética', 'Tipografía', 'Adobe Illustrator'],
                soft_skills: ['Empatía', 'Pensamiento sistémico'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Diseñadora junior — Proyecto LABGob',
                organization: 'Laboratorio de Gobierno, Ministerio de Hacienda',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Diseño de servicios',
                role: 'Diseñadora de servicios Jr.',
                description: 'Participación en proyecto de rediseño de proceso de postulación a beneficios sociales. Investigación con usuarios, síntesis de hallazgos y prototipado de soluciones.',
                achievements: 'El prototipo de nuevo flujo de postulación redujo las consultas de soporte en 35% durante la prueba piloto.',
                hard_skills: ['Design Thinking', 'Figma', 'Investigación usuaria', 'Facilitación remota'],
                soft_skills: ['Proactividad', 'Trabajo en equipo', 'Comunicación ejecutiva'],
                is_current: false,
            },
        ],
        achievements: [
            { title: '1er lugar — Concurso de Diseño para el Bien Público, Fondart 2025', category: 'award' as const, organization: 'Consejo de la Cultura, Chile' },
        ],
    },
    {
        username: 'demo-mistral-sebastian-ra',
        full_name: 'Sebastián Ramos Alvarado',
        headline: 'Diseño · 3D · Arquitectura de producto · Sustentabilidad',
        about: 'Diseñador enfocado en diseño de producto físico con criterios de sustentabilidad y economía circular. Trabajo con materiales locales y procesos bajos en carbono.',
        career: 'Diseño',
        gender: 'hombre',
        career_status: 'buscando_primer_empleo',
        career_start_date: '2021-03-01',
        interests: ['diseño de producto', 'sustentabilidad', 'senderismo', 'carpintería'],
        email: 'demo-mistral-sebastian-ra@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Mobiliario urbano modular con madera recuperada',
                description: 'Diseño y prototipado de sistema de mobiliario urbano (bancas, luminarias, maceteros) fabricado con madera recuperada de demolición, con uniones sin tornillos para facilitar reparación y reuso.',
                type: 'personal' as const,
                role: 'Diseñador industrial — concepto, modelado 3D y prototipo físico',
                challenges: 'La variabilidad dimensional de la madera recuperada obligó a diseñar tolerancias amplias en las uniones, lo que fue un ejercicio interesante de diseño paramétrico.',
                results: 'Prototipo instalado en patio central de la Universidad Mistral durante 6 meses como piloto.',
                hard_skills: ['Rhino 3D', 'SolidWorks', 'Fabricación en madera', 'Adobe Suite'],
                soft_skills: ['Creatividad', 'Pensamiento circular', 'Resiliencia'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Asistente de diseño — Taller de arquitectura',
                organization: 'Estudio Brea Arquitectos',
                type: 'empleo_sustento' as const,
                description: 'Apoyo en modelado 3D, renders y presentaciones de proyectos de arquitectura residencial.',
                hard_skills: ['Rhino 3D', 'V-Ray', 'SketchUp', 'AutoCAD'],
                soft_skills: ['Puntualidad', 'Atención al detalle'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-amparo-df',
        full_name: 'Amparo Díaz Fuentes',
        headline: 'Diseño · Fotografía · Dirección de arte',
        about: '',
        career: 'Diseño',
        gender: 'mujer',
        career_status: 'estudiante_activo',
        career_start_date: '2024-03-01',
        interests: ['fotografía', 'moda', 'video'],
        email: 'demo-mistral-amparo-df@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'Editorial fotográfica — Artesanas del sur de Chile',
                description: 'Serie fotográfica documental sobre artesanas de Chiloé y sus técnicas textiles ancestrales. Publicada en revista universitaria de artes.',
                type: 'personal' as const,
                hard_skills: ['Fotografía', 'Edición en Lightroom', 'Dirección de arte'],
                soft_skills: ['Sensibilidad cultural', 'Narrativa visual'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Ingeniería Comercial — 3 nuevos ---
    {
        username: 'demo-mistral-nicolas-hv',
        full_name: 'Nicolás Herrera Vargas',
        headline: 'Ingeniería Comercial · Emprendimiento · Economía circular · Agtech',
        about: 'Fundador de una startup de tecnología agrícola para pequeños agricultores. Ganador del fondo SERCOTEC Capital Semilla 2025. Apasionado por cómo la tecnología puede democratizar el acceso a mercados para el campo chileno.',
        career: 'Ingeniería Comercial',
        gender: 'hombre',
        career_status: 'emprendiendo',
        career_start_date: '2021-03-01',
        interests: ['agtech', 'startups', 'agricultura', 'montaña'],
        email: 'demo-mistral-nicolas-hv@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'AgroConecta — Plataforma de conexión entre agricultores y mercados',
                description: 'Startup que conecta a pequeños agricultores de la Región del Maule con compradores institucionales (hoteles, restaurantes, colegios) eliminando intermediarios. Modelo de suscripción mensual para compradores.',
                type: 'startup' as const,
                role: 'Co-fundador y CEO — Estrategia, ventas, fundraising y operaciones',
                challenges: 'La desconfianza digital de los agricultores mayores requirió un modelo híbrido con agentes de campo que digitalizaban las órdenes en terreno.',
                results: 'MRR de $4.2M CLP al cabo de 8 meses. 34 agricultores activos y 12 compradores institucionales. Seleccionados para programa de aceleración Startup Chile.',
                learnings: 'Un marketplace B2B en mercados tradicionales requiere más educación de usuario que tecnología. La confianza se construye de a poco.',
                hard_skills: ['Business Model Canvas', 'Financial Modeling', 'CRM', 'Pitch Deck'],
                soft_skills: ['Liderazgo', 'Resilencia', 'Networking', 'Visión estratégica'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Análisis de cadena de valor del tomate industrial en Chile',
                description: 'Mapeo y análisis económico de la cadena de valor del tomate industrial en la Región del Maule, identificando márgenes por eslabón y oportunidades de mejora para el agricultor.',
                type: 'academic' as const,
                role: 'Investigador y analista económico',
                hard_skills: ['Análisis de cadenas de valor', 'Excel', 'Investigación de campo', 'Entrevistas'],
                soft_skills: ['Análisis crítico', 'Trabajo en equipo', 'Redacción'],
                is_featured: false,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Co-fundador y CEO',
                organization: 'AgroConecta SpA',
                type: 'emprendimiento' as const,
                role: 'CEO',
                description: 'Liderando todos los aspectos del negocio: operaciones, ventas, relación con inversores y gestión del equipo de 4 personas.',
                achievements: 'Ganamos el fondo Capital Semilla SERCOTEC $10M CLP y fuimos seleccionados para Startup Chile en la edición 2025.',
                hard_skills: ['Gestión de startups', 'Ventas B2B', 'Fundraising'],
                soft_skills: ['Liderazgo', 'Toma de decisiones', 'Visión de largo plazo'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Capital Semilla SERCOTEC 2025 — $10M CLP', category: 'award' as const, organization: 'SERCOTEC' },
            { title: 'Seleccionado — Startup Chile S17', category: 'award' as const, organization: 'CORFO / Startup Chile' },
        ],
    },
    {
        username: 'demo-mistral-barbara-at',
        full_name: 'Bárbara Arteaga Torres',
        headline: 'Ingeniería Comercial · Consultoría · Sostenibilidad · ESG',
        about: 'Me interesa la sostenibilidad corporativa y los reportes ESG. Actualmente en práctica en consultora de sostenibilidad, apoyando a empresas en el diseño de estrategias de impacto.',
        career: 'Ingeniería Comercial',
        gender: 'mujer',
        career_status: 'en_practica',
        career_start_date: '2022-03-01',
        interests: ['sostenibilidad', 'esg', 'yoga', 'política climática'],
        email: 'demo-mistral-barbara-at@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Reporte de materialidad ESG — Empresa minera mediana',
                description: 'Diseño y ejecución de proceso de análisis de materialidad doble para empresa minera mediana del norte de Chile, siguiendo estándares GRI 2021. Incluyó encuestas a stakeholders y priorización de temas materiales.',
                type: 'academic' as const,
                role: 'Analista ESG — diseño metodológico, recopilación de datos y redacción de informe',
                hard_skills: ['GRI Standards', 'Análisis de stakeholders', 'Excel', 'Redacción ejecutiva'],
                soft_skills: ['Organización', 'Comunicación', 'Orientación a resultados'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Analista de Sostenibilidad',
                organization: 'Sustentia Consultoría SpA',
                type: 'practica' as const,
                sector: 'Privado',
                internship_area: 'Consultoría en sostenibilidad y ESG',
                role: 'Analista de sostenibilidad Jr.',
                description: 'Apoyo en proyectos de reportes de sostenibilidad GRI y TCFD, gestión de datos de huella de carbono y análisis de brechas para clientes corporativos.',
                achievements: 'Lideré la recopilación de indicadores de alcance 1 y 2 para cliente del retail, logrando el primer reporte de huella de carbono verificado de la empresa.',
                hard_skills: ['GRI', 'Huella de carbono', 'TCFD', 'Excel avanzado'],
                soft_skills: ['Rigor', 'Proactividad', 'Comunicación con clientes'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-cristobal-mn',
        full_name: 'Cristóbal Muñoz Naranjo',
        headline: 'Ingeniería Comercial · 3er año · Economía',
        about: 'Interesado en economía conductual y su aplicación en políticas públicas. Participo en el equipo de debate universitario.',
        career: 'Ingeniería Comercial',
        gender: 'prefiero_no_decirlo',
        career_status: 'estudiante_activo',
        career_start_date: '2023-03-01',
        interests: ['economía conductual', 'debate', 'podcasts', 'running'],
        email: 'demo-mistral-cristobal-mn@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [
            {
                title: 'Experimento de economía conductual en ahorro universitario',
                description: 'Experimento de campo con 200 estudiantes para evaluar el efecto de nudges en el comportamiento de ahorro. Diseñado para el curso de Economía del Comportamiento.',
                type: 'academic' as const,
                hard_skills: ['Diseño experimental', 'Stata', 'Econometría'],
                soft_skills: ['Rigor científico', 'Análisis cuantitativo'],
                is_featured: true,
                show_in_timeline: false,
            },
        ],
        experiences: [],
        achievements: [],
    },

    // --- Periodismo — 3 nuevos ---
    {
        username: 'demo-mistral-valentina-cm',
        full_name: 'Valentina Castro Molina',
        headline: 'Periodismo · Comunicación estratégica · Relaciones públicas',
        about: 'Periodista en formación con foco en comunicación corporativa y relaciones públicas. He trabajado en el área de comunicaciones de un ministerio y en una agencia de RRPP privada.',
        career: 'Periodismo',
        gender: 'mujer',
        career_status: 'buscando_primer_empleo',
        career_start_date: '2021-03-01',
        interests: ['comunicación estratégica', 'marketing', 'viajes', 'idiomas'],
        email: 'demo-mistral-valentina-cm@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Plan de comunicación de crisis — Simulación empresa farmacéutica',
                description: 'Diseño de plan integral de comunicación de crisis para escenario simulado de alerta sanitaria en empresa farmacéutica. Incluye protocolo de vocería, mensajes clave, matriz de stakeholders y hoja de ruta por etapas.',
                type: 'academic' as const,
                role: 'Gestora de comunicaciones — diseño del plan, redacción y presentación ejecutiva',
                results: 'El plan fue evaluado con nota máxima y presentado en clase magistral como caso de estudio para cursos futuros.',
                hard_skills: ['Comunicación de crisis', 'Relaciones públicas', 'Redacción', 'PowerPoint'],
                soft_skills: ['Pensamiento estratégico', 'Comunicación bajo presión', 'Liderazgo'],
                is_featured: true,
                show_in_timeline: true,
            },
            {
                title: 'Podcast "Habla con Ella" — Mujeres en ciencia y tecnología',
                description: 'Podcast de entrevistas a mujeres chilenas destacadas en STEM. 6 episodios publicados con promedio de 800 reproducciones por episodio.',
                type: 'personal' as const,
                role: 'Conductora, productora y editora',
                hard_skills: ['Producción de audio', 'Entrevistas', 'Edición en Audacity', 'Distribución de podcasts'],
                soft_skills: ['Comunicación', 'Curiosidad', 'Gestión de proyectos'],
                is_featured: false,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Comunicaciones institucionales',
                organization: 'Ministerio de Ciencia, Tecnología, Conocimiento e Innovación',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Comunicaciones',
                role: 'Periodista practicante',
                description: 'Redacción de comunicados de prensa, coordinación de entrevistas con medios, apoyo en redes sociales institucionales y cobertura de eventos del sector.',
                achievements: 'Redacté 12 comunicados de prensa distribuidos a medios nacionales y gestioné la cobertura de 3 lanzamientos de programas del ministerio.',
                hard_skills: ['Redacción periodística', 'Gestión de redes sociales', 'Edición fotográfica', 'Atención a medios'],
                soft_skills: ['Organización', 'Trabajo en equipo', 'Proactividad'],
                is_current: false,
            },
            {
                title: 'Ejecutiva de cuentas Jr.',
                organization: 'Agencia Nada Comunicaciones',
                type: 'empleo_sustento' as const,
                description: 'Gestión de relaciones con medios de comunicación, elaboración de dossiers de prensa y seguimiento de publicaciones para clientes corporativos.',
                hard_skills: ['RRPP', 'Clipping de medios', 'Redacción', 'CRM'],
                soft_skills: ['Multitasking', 'Orientación al cliente', 'Comunicación'],
                is_current: true,
            },
        ],
        achievements: [
            { title: '2do lugar — Concurso Universitario de Comunicación Estratégica 2025', category: 'award' as const, organization: 'Universidad Diego Portales' },
        ],
    },
    {
        username: 'demo-mistral-mateo-gb',
        full_name: 'Mateo González Bustos',
        headline: 'Periodismo · Deportivo · Transmisión en vivo · Narración',
        about: 'Fanático del deporte y la narración deportiva. Trabajo como comentarista voluntario en radio universitaria y coordino la cobertura periodística de competencias atléticas.',
        career: 'Periodismo',
        gender: 'hombre',
        career_status: 'estudiante_activo',
        career_start_date: '2023-03-01',
        interests: ['fútbol', 'atletismo', 'narración', 'radio'],
        email: 'demo-mistral-mateo-gb@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Cobertura en vivo — Campeonato Universitario de Atletismo 2025',
                description: 'Producción y transmisión en vivo del Campeonato Universitario de Atletismo de la ANUF. Narración de 12 horas de competencia distribuidas por streaming y radio.',
                type: 'personal' as const,
                role: 'Narrador principal y coordinador de producción',
                hard_skills: ['Narración deportiva', 'Producción de radio', 'Streaming', 'OBS Studio'],
                soft_skills: ['Comunicación en tiempo real', 'Manejo de imprevistos', 'Trabajo en equipo'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Comentarista — Radio Mistral FM',
                organization: 'Universidad Mistral',
                type: 'liderazgo' as const,
                role: 'Comentarista y conductor',
                description: 'Conducción del programa deportivo semanal "La Última Jugada" y cobertura en directo de eventos deportivos universitarios.',
                hard_skills: ['Locución', 'Edición de audio', 'Producción radial'],
                soft_skills: ['Comunicación', 'Espontaneidad', 'Responsabilidad'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-antonia-re',
        full_name: 'Antonia Reyes Espinoza',
        headline: 'Periodismo · 2do año · Escritura creativa',
        about: '',
        career: 'Periodismo',
        gender: 'mujer',
        career_status: 'estudiante_activo',
        career_start_date: '2025-03-01',
        interests: ['escritura', 'cine', 'feminismo'],
        email: 'demo-mistral-antonia-re@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [],
        experiences: [
            {
                title: 'Editora — Revista estudiantil "Umbral"',
                organization: 'Universidad Mistral',
                type: 'liderazgo' as const,
                description: 'Edición de textos y coordinación de la revista literaria estudiantil de la facultad de humanidades.',
                hard_skills: ['Edición de textos', 'Redacción'],
                soft_skills: ['Atención al detalle', 'Criterio estético'],
                is_current: true,
            },
        ],
        achievements: [],
    },

    // --- Administración Pública — 4 nuevos ---
    {
        username: 'demo-mistral-daniela-fp',
        full_name: 'Daniela Flores Pereira',
        headline: 'Administración Pública · Gestión municipal · Participación ciudadana',
        about: 'Apasionada por la gestión pública local y los mecanismos de participación ciudadana. Mi tesis analiza la implementación de presupuestos participativos en municipios rurales de la Araucanía.',
        career: 'Administración Pública',
        gender: 'mujer',
        career_status: 'en_practica',
        career_start_date: '2022-03-01',
        interests: ['gestión municipal', 'participación ciudadana', 'pueblos originarios', 'cerámica'],
        email: 'demo-mistral-daniela-fp@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Tesis: Presupuestos participativos en municipios mapuche-rurales',
                description: 'Investigación comparada de la implementación de presupuestos participativos en 4 municipios con alta población mapuche en la Araucanía. Análisis de representación, participación diferenciada y pertinencia cultural.',
                type: 'academic' as const,
                role: 'Investigadora principal',
                challenges: 'El acceso a datos cualitativos en comunidades rurales con desconfianza hacia instituciones académicas externas requirió un largo proceso de construcción de confianza y respeto de protocolos culturales.',
                results: 'Resultados presentados en Congreso Chileno de Ciencia Política 2025 y en proceso de publicación en revista indexada.',
                learnings: 'La gestión pública intercultural exige metodologías de investigación que incorporen los valores y la cosmovisión de las comunidades, no solo sus demandas.',
                hard_skills: ['Investigación cualitativa', 'Políticas públicas', 'Análisis documental', 'Entrevistas'],
                soft_skills: ['Sensibilidad intercultural', 'Rigor académico', 'Empatía'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Práctica profesional — Gestión y participación ciudadana',
                organization: 'Municipalidad de Padre Las Casas',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Gestión pública y participación ciudadana',
                role: 'Profesional practicante DIDECO',
                description: 'Apoyo en el diseño y ejecución del proceso de consulta ciudadana para el Plan de Desarrollo Comunal. Coordinación de talleres participativos en juntas de vecinos y comunidades indígenas.',
                achievements: 'Coordiné 6 talleres de participación con más de 200 vecinos y elaboré el informe de sistematización de propuestas que fue presentado al Concejo Municipal.',
                hard_skills: ['Gestión pública', 'Facilitación participativa', 'Redacción de informes', 'Diagnóstico territorial'],
                soft_skills: ['Empatía intercultural', 'Trabajo en terreno', 'Organización'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Seleccionada — Programa de Liderazgo Público ANEF 2025', category: 'award' as const, organization: 'ANEF Chile' },
        ],
    },
    {
        username: 'demo-mistral-rodrigo-pa',
        full_name: 'Rodrigo Pizarro Araya',
        headline: 'Administración Pública · Regulación · Competencia · Derecho económico',
        about: 'Interesado en la regulación económica y el derecho de la competencia. Hice una pasantía en la Fiscalía Nacional Económica y actualmente soy ayudante ad-honorem de Economía Pública en la Mistral.',
        career: 'Administración Pública',
        gender: 'hombre',
        career_status: 'disponible_para_practica',
        career_start_date: '2022-03-01',
        interests: ['regulación', 'derecho económico', 'hockey', 'cocina'],
        email: 'demo-mistral-rodrigo-pa@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'high',
        projects: [
            {
                title: 'Análisis de concentración de mercado en el sector retail farmacéutico chileno',
                description: 'Estudio de concentración y conductas anticompetitivas en el mercado farmacéutico chileno post-fusión Cruz Verde-Salcobrand. Análisis con índices HHI y revisión de resoluciones de la FNE.',
                type: 'academic' as const,
                role: 'Investigador principal',
                challenges: 'La asimetría de información pública disponible sobre participación de mercado requirió triangular fuentes de distintos organismos reguladores.',
                results: 'El estudio fue citado en un seminario de regulación organizado por la FNE y el TDLC.',
                hard_skills: ['Análisis económico', 'Derecho de la competencia', 'Stata', 'Análisis documental'],
                soft_skills: ['Rigor analítico', 'Redacción técnica', 'Curiosidad intelectual'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Pasante — División de Estudios Económicos',
                organization: 'Fiscalía Nacional Económica (FNE)',
                type: 'practica' as const,
                sector: 'Público',
                internship_area: 'Regulación económica y libre competencia',
                role: 'Pasante de investigación económica',
                description: 'Apoyo en el análisis de expedientes de investigación por conductas anticompetitivas. Revisión de literatura económica, elaboración de memorandos y asistencia a audiencias ante el TDLC.',
                achievements: 'Elaboré un análisis de la estructura del mercado de los combustibles que fue incorporado a un informe sectorial publicado por la FNE.',
                hard_skills: ['Análisis de mercados', 'Economía industrial', 'Redacción de informes', 'Stata'],
                soft_skills: ['Discreción', 'Rigor', 'Trabajo en equipo'],
                is_current: false,
            },
            {
                title: 'Ayudante de Economía Pública',
                organization: 'Universidad Mistral',
                type: 'academico' as const,
                role: 'Ayudante ad-honorem',
                description: 'Apoyo en clases y corrección de evaluaciones del curso de Economía Pública para alumnos de 3er año.',
                hard_skills: ['Economía pública', 'Bienes públicos', 'Externalidades'],
                soft_skills: ['Comunicación pedagógica', 'Responsabilidad'],
                is_current: true,
            },
        ],
        achievements: [
            { title: 'Premio Excelencia Académica — Facultad de Gobierno', category: 'award' as const, organization: 'Universidad Mistral' },
        ],
    },
    {
        username: 'demo-mistral-tamara-so',
        full_name: 'Tamara Soto Ortega',
        headline: 'Administración Pública · 3er año · Políticas de equidad',
        about: 'Me interesa el diseño de políticas públicas orientadas a la equidad de género y la inclusión.',
        career: 'Administración Pública',
        gender: 'no_binario',
        career_status: 'estudiante_activo',
        career_start_date: '2023-03-01',
        interests: ['políticas de género', 'inclusión', 'danza', 'teatro'],
        email: 'demo-mistral-tamara-so@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'medium',
        projects: [
            {
                title: 'Propuesta de política pública de cuidados para trabajadoras informales',
                description: 'Diseño de propuesta de política pública de subsidio a cuidados para mujeres en situación de informalidad laboral, con análisis de viabilidad fiscal y comparación de experiencias internacionales.',
                type: 'academic' as const,
                hard_skills: ['Diseño de políticas públicas', 'Análisis presupuestario', 'Investigación documental'],
                soft_skills: ['Perspectiva de género', 'Redacción académica', 'Análisis crítico'],
                is_featured: true,
                show_in_timeline: true,
            },
        ],
        experiences: [
            {
                title: 'Monitora — Programa de Inclusión Estudiantil',
                organization: 'Universidad Mistral',
                type: 'social' as const,
                description: 'Acompañamiento y tutoría a estudiantes de primer año provenientes de colegios municipalizados en proceso de adaptación universitaria.',
                hard_skills: ['Acompañamiento estudiantil', 'Gestión de grupos'],
                soft_skills: ['Empatía', 'Escucha activa', 'Liderazgo pedagógico'],
                is_current: true,
            },
        ],
        achievements: [],
    },
    {
        username: 'demo-mistral-sebastian-lc',
        full_name: 'Sebastián Leiva Campos',
        headline: 'Administración Pública · 1er año',
        about: '',
        career: 'Administración Pública',
        gender: 'hombre',
        career_status: 'estudiante_activo',
        career_start_date: '2025-03-01',
        interests: ['política', 'historia', 'videojuegos'],
        email: 'demo-mistral-sebastian-lc@prisma-demo.com',
        password: 'Demo2026!',
        completeness: 'basic',
        projects: [],
        experiences: [
            {
                title: 'Delegado de carrera — Administración Pública',
                organization: 'Universidad Mistral',
                type: 'liderazgo' as const,
                description: 'Representante de los estudiantes de primer año ante el Centro de Estudiantes de la carrera.',
                hard_skills: ['Representación estudiantil'],
                soft_skills: ['Comunicación', 'Iniciativa'],
                is_current: true,
            },
        ],
        achievements: [],
    },
]


// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

async function getOrCreateUniversity(): Promise<number> {
    const { data: existing } = await supabase
        .from('universities')
        .select('id')
        .eq('name', UNIVERSITY.name)
        .single()

    if (existing) {
        console.log(`  ✓ Universidad existente: ID ${existing.id}`)
        return existing.id
    }

    const { data: created, error } = await supabase
        .from('universities')
        .insert({
            name: UNIVERSITY.name,
            slug: UNIVERSITY.slug,
            logo_url: UNIVERSITY.logo_url,
            domain: UNIVERSITY.domain,
        })
        .select('id')
        .single()

    if (error || !created) throw new Error(`Error creando universidad: ${error?.message}`)
    console.log(`  ✓ Universidad creada: ID ${created.id}`)
    return created.id
}

async function getCareerIds(): Promise<Map<string, number>> {
    const { data: careers, error } = await supabase
        .from('careers')
        .select('id, name')
        .in('name', CAREER_NAMES)

    if (error) throw new Error(`Error buscando carreras: ${error.message}`)

    const map = new Map<string, number>()
    careers?.forEach(c => map.set(c.name, c.id))

    // Crear carreras que no existan
    for (const name of CAREER_NAMES) {
        if (!map.has(name)) {
            const { data, error: insertError } = await supabase
                .from('careers')
                .insert({ name })
                .select('id')
                .single()
            if (insertError || !data) throw new Error(`Error creando carrera ${name}: ${insertError?.message}`)
            map.set(name, data.id)
            console.log(`  ✓ Carrera creada: ${name}`)
        }
    }

    return map
}

async function seedStudent(student: typeof STUDENTS[0], universityId: number, careerIds: Map<string, number>) {
    const careerId = careerIds.get(student.career)

    // 1. Crear auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: student.email,
        password: student.password,
        email_confirm: true,
        user_metadata: {
            full_name: student.full_name,
        },
    })

    if (authError) {
        if (authError.message.includes('already been registered')) {
            console.log(`  ⚠️  Usuario ya existe: ${student.email}`)
            return
        }
        throw new Error(`Error creando auth user ${student.email}: ${authError.message}`)
    }

    const userId = authData.user.id

    // 2. Actualizar perfil (el trigger handle_new_user ya lo creó)
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            username: student.username,
            full_name: student.full_name,
            headline: student.headline || null,
            about: student.about || null,
            university_id: universityId,
            career_id: careerId || null,
            interests: student.interests,
            hidden_from_explore: true,
            ...(student.gender ? { gender: student.gender } : {}),
            ...(student.career_status ? { career_status: student.career_status } : {}),
            ...(student.career_start_date ? { career_start_date: student.career_start_date } : {}),
        })
        .eq('id', userId)

    if (profileError) throw new Error(`Error actualizando perfil ${student.username}: ${profileError.message}`)

    // 3. Crear proyectos
    for (const project of student.projects) {
        const { error } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                title: project.title,
                description: project.description,
                type: project.type,
                hard_skills: project.hard_skills,
                soft_skills: project.soft_skills,
                is_featured: project.is_featured,
                show_in_timeline: project.show_in_timeline,
                is_startup: project.type === 'startup',
                ...(project.role ? { role: project.role } : {}),
                ...(project.challenges ? { challenges: project.challenges } : {}),
                ...(project.results ? { results: project.results } : {}),
                ...(project.learnings ? { learnings: project.learnings } : {}),
            })
        if (error) console.warn(`    ⚠️  Error en proyecto "${project.title}": ${error.message}`)
    }

    // 4. Crear experiencias
    for (const exp of student.experiences) {
        const { error } = await supabase
            .from('experiences')
            .insert({
                user_id: userId,
                title: exp.title,
                organization: exp.organization,
                type: exp.type,
                description: exp.description,
                hard_skills: exp.hard_skills,
                soft_skills: exp.soft_skills,
                is_current: exp.is_current,
                start_date: exp.is_current ? '2024-03-01' : '2023-03-01',
                end_date: exp.is_current ? null : '2024-12-31',
                show_in_timeline: true,
                ...(exp.role ? { role: exp.role } : {}),
                ...(exp.achievements ? { achievements: exp.achievements } : {}),
                ...(exp.sector ? { sector: exp.sector } : {}),
                ...(exp.internship_area ? { internship_area: exp.internship_area } : {}),
            })
        if (error) console.warn(`    ⚠️  Error en experiencia "${exp.title}": ${error.message}`)
    }

    // 5. Crear logros
    for (const achievement of student.achievements) {
        const { error } = await supabase
            .from('achievements')
            .insert({
                user_id: userId,
                title: achievement.title,
                category: achievement.category,
                organization: achievement.organization,
                date: '2025-01-01',
            })
        if (error) console.warn(`    ⚠️  Error en logro "${achievement.title}": ${error.message}`)
    }

    console.log(`  ✓ ${student.full_name} (${student.career}) — ${student.projects.length} proyectos, ${student.experiences.length} experiencias`)
}

async function createUniversityPortalAccount(universityId: number) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: UNIVERSITY_PORTAL_ACCOUNT.email,
        password: UNIVERSITY_PORTAL_ACCOUNT.password,
        email_confirm: true,
        app_metadata: {
            role: 'university',
            university_id: universityId,
        },
    })

    if (authError) {
        if (authError.message.includes('already been registered')) {
            console.log(`  ⚠️  Cuenta portal ya existe: ${UNIVERSITY_PORTAL_ACCOUNT.email}`)
            return
        }
        throw new Error(`Error creando cuenta portal: ${authError.message}`)
    }

    const { error: accountError } = await supabase
        .from('university_accounts')
        .insert({
            user_id: authData.user.id,
            university_id: universityId,
            role: 'owner',
            full_name: UNIVERSITY_PORTAL_ACCOUNT.full_name,
            position: UNIVERSITY_PORTAL_ACCOUNT.position,
            is_active: true,
        })

    if (accountError) throw new Error(`Error creando university_account: ${accountError.message}`)

    console.log(`  ✓ Cuenta portal: ${UNIVERSITY_PORTAL_ACCOUNT.email} / ${UNIVERSITY_PORTAL_ACCOUNT.password}`)
}

// ============================================================
// CLEANUP
// ============================================================
async function cleanup() {
    console.log('\n🧹 Limpiando datos demo...\n')

    const demoEmails = [
        ...STUDENTS.map(s => s.email),
        UNIVERSITY_PORTAL_ACCOUNT.email,
    ]

    // Borrar usuarios de auth (el CASCADE se encarga de profiles y datos relacionados)
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const demoUsers = (users as any[]).filter((u: any) => demoEmails.includes(u.email ?? ''))

    for (const user of demoUsers) {
        const { error } = await supabase.auth.admin.deleteUser(user.id)
        if (error) console.warn(`  ⚠️  Error borrando ${user.email}: ${error.message}`)
        else console.log(`  ✓ Borrado: ${user.email}`)
    }

    // Borrar universidad demo
    const { error: uniError } = await supabase
        .from('universities')
        .delete()
        .eq('name', UNIVERSITY.name)

    if (uniError) console.warn(`  ⚠️  Error borrando universidad: ${uniError.message}`)
    else console.log(`  ✓ Universidad Mistral eliminada`)

    console.log('\n✅ Cleanup completo')
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    const isCleanup = process.argv.includes('--cleanup')

    if (isCleanup) {
        await cleanup()
        return
    }

    console.log('\n🎓 Creando Universidad Mistral (Demo)...\n')

    console.log('1. Universidad...')
    const universityId = await getOrCreateUniversity()

    console.log('\n2. Carreras...')
    const careerIds = await getCareerIds()

    console.log('\n3. Cuenta del portal universitario...')
    await createUniversityPortalAccount(universityId)

    console.log('\n4. Estudiantes demo...')
    for (const student of STUDENTS) {
        await seedStudent(student, universityId, careerIds)
    }

    console.log(`
✅ ¡Seed completo!

📊 Resumen:
   • Universidad: ${UNIVERSITY.name}
   • Estudiantes: ${STUDENTS.length}
   • Carreras representadas: ${CAREER_NAMES.length}

🔑 Acceso al portal:
   URL:      https://demo.tuprisma.com/university
   Email:    ${UNIVERSITY_PORTAL_ACCOUNT.email}
   Password: ${UNIVERSITY_PORTAL_ACCOUNT.password}

🧹 Para limpiar los datos demo:
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/seed-demo.ts --cleanup
`)
}

main().catch(err => {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
})
