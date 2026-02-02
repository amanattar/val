import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = loginSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            )
        }

        const { username, password } = result.data

        const user = await db.user.findUnique({
            where: { username },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            )
        }

        const session = await getSession()
        session.userId = user.id
        session.username = user.username
        session.isLoggedIn = true
        await session.save()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
