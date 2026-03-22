import { redirect } from 'next/navigation'

export default async function LegacyProjectRoute(props: { params: Promise<{ username: string; id: string }> }) {
    const params = await props.params
    // Redirige permanentemente (308) a la ruta correcta para mantener SEO y enlaces antiguos vivos
    redirect(`/${params.username}/proyectos/${params.id}`)
}
