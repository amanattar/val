import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { pageId } = body

        if (!pageId) {
            return NextResponse.json({ error: "Page ID required" }, { status: 400 })
        }

        await db.page.update({
            where: { id: pageId },
            data: {
                responded: true,
                response: true,
                responseAt: new Date(),
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Response error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
