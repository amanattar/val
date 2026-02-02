import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = signupSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { username, password } = result.data

        const existingUser = await db.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        })

        const session = await getSession()
        session.userId = user.id
        session.username = user.username
        session.isLoggedIn = true
        await session.save()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
