import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ValentineClient from '@/components/valentine-client'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ValentinePage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('id, valentine_name, visits')
        .eq('id', id)
        .maybeSingle()

    if (pageError || !page) {
        if (pageError) {
            console.error("Page lookup error:", pageError)
        }
        notFound()
    }

    // Increment visits (optional but fun)
    const { error: visitError } = await supabase
        .from('pages')
        .update({ visits: (page.visits ?? 0) + 1 })
        .eq('id', id)

    if (visitError) {
        console.error("Visit increment error:", visitError)
    }

    return (
        <div className="min-h-[100svh] grid place-items-center bg-[radial-gradient(circle_at_top,var(--bg2),var(--bg1))] font-sans overflow-hidden p-4">
            <ValentineClient name={page.valentine_name} id={page.id} />
        </div>
    )
}
