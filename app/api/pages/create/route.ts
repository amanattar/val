import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPageSchema = z.object({
    valentineName: z.string().min(1, "Name is required"),
})

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const result = createPageSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { valentineName } = result.data

        const page = await db.page.create({
            data: {
                valentineName,
                creatorId: session.userId,
            },
        })

        return NextResponse.json({ success: true, pageId: page.id })
    } catch (error) {
        console.error("Create page error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
