import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { pageId } = body

        if (!pageId) {
            return NextResponse.json({ error: "Page ID required" }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()
        const { error: updateError } = await supabase
            .from('pages')
            .update({
                responded: true,
                response: true,
                response_at: new Date().toISOString(),
            })
            .eq('id', pageId)

        if (updateError) {
            console.error("Response update error:", updateError)
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Response error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
