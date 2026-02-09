import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromCookie } from '@/lib/user-val-session'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPageSchema = z.object({
    valentineName: z.string().min(1, "Name is required"),
})

function slugifyName(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'valentine'
}

function randomSuffix() {
    return Math.random().toString(36).slice(2, 8)
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const user = await getUserFromCookie(supabase)
        if (!user) {
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

        const baseSlug = slugifyName(valentineName)
        let page: { id: string; slug: string } | null = null
        let createPageError: unknown = null

        for (let attempt = 0; attempt < 3; attempt++) {
            const slug = `${baseSlug}-${randomSuffix()}`
            const result = await supabase
                .from('val_pages')
                .insert({
                    valentine_name: valentineName,
                    user_id: user.id,
                    slug,
                })
                .select('id, slug')
                .single()
            createPageError = result.error
            if (result.data) {
                page = result.data
                createPageError = null
                break
            }
        }

        if (createPageError || !page) {
            console.error("Create page error:", createPageError)
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, pageId: page.id, slug: page.slug })
    } catch (error) {
        console.error("Create page error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
