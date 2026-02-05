import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPageSchema = z.object({
    valentineName: z.string().min(1, "Name is required"),
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const result = createPageSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { valentineName } = result.data

        const { data: page, error: createPageError } = await supabase
            .from('pages')
            .insert({
                valentine_name: valentineName,
                creator_id: user.id,
            })
            .select('id')
            .single()

        if (createPageError || !page) {
            console.error("Create page error:", createPageError)
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, pageId: page.id })
    } catch (error) {
        console.error("Create page error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
