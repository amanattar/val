import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ValentineClient from '@/components/valentine-client'

interface PageProps {
    params: Promise<{ id: string }>
}

function isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export default async function ValentinePage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const lookupColumn = isUuid(id) ? 'id' : 'slug'
    const { data: page, error: pageError } = await supabase
        .from('val_pages')
        .select('id, valentine_name, visits')
        .eq(lookupColumn, id)
        .maybeSingle()

    if (pageError || !page) {
        if (pageError) {
            console.error("Page lookup error:", pageError)
        }
        notFound()
    }

    // Increment visits (optional but fun)
    const { error: visitError } = await supabase
        .from('val_pages')
        .update({ visits: (page.visits ?? 0) + 1 })
        .eq('id', page.id)

    if (visitError) {
        console.error("Visit increment error:", visitError)
    }

    return (
        <div className="min-h-[100svh] grid place-items-center bg-[radial-gradient(circle_at_top,var(--bg2),var(--bg1))] font-sans overflow-hidden p-4">
            <ValentineClient name={page.valentine_name} id={page.id} />
        </div>
    )
}
