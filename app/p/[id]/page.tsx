import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import ValentineClient from '@/components/valentine-client'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ValentinePage({ params }: PageProps) {
    const { id } = await params
    const page = await db.page.findUnique({
        where: { id },
    })

    if (!page) {
        notFound()
    }

    // Increment visits (optional but fun)
    await db.page.update({
        where: { id },
        data: { visits: { increment: 1 } },
    })

    return (
        <div className="min-h-[100svh] grid place-items-center bg-[radial-gradient(circle_at_top,var(--bg2),var(--bg1))] font-sans overflow-hidden p-4">
            <ValentineClient name={page.valentineName} id={page.id} />
        </div>
    )
}
