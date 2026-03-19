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
// ESTUDIANTES FICTICIOS
// Distribución: 4 Ing. Informática, 3 Psicología, 3 Diseño,
//               3 Ing. Comercial, 3 Periodismo, 2 Admin. Pública
// Variedad: 6 completos, 7 medios, 5 básicos
// ============================================================
const STUDENTS = [
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
            hidden_from_explore: true, // Perfiles demo no aparecen en Explorar
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
    const demoUsers = users.filter(u => demoEmails.includes(u.email ?? ''))

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
