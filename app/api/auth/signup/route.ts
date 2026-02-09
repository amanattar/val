import { createServerSupabaseClient } from '@/lib/supabase/server'
import { hashPassword } from '@/lib/password'
import { setSessionCookie } from '@/lib/user-val-session'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
    displayName: z.string().min(1, "Name is required").max(80, "Name is too long"),
    email: z.string().email("Valid email is required"),
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

        const { displayName, email, password } = result.data

        const supabase = await createServerSupabaseClient()
        const passwordHash = await hashPassword(password)
        const sessionToken = crypto.randomUUID()
        const { data, error } = await supabase
            .from('user_val')
            .insert({
                display_name: displayName,
                email: email.toLowerCase(),
                password_hash: passwordHash,
                session_token: sessionToken,
            })
            .select('id')
            .single()

        if (error) {
            const maybeError = error as { code?: string; message?: string }
            if (maybeError.code === '23505') {
                return NextResponse.json({ error: "Email already exists" }, { status: 409 })
            }
            if (maybeError.code === '42501') {
                return NextResponse.json(
                    { error: "Database permissions not configured. Run supabase/rls.sql." },
                    { status: 400 }
                )
            }
            if (maybeError.code === '42703') {
                return NextResponse.json(
                    { error: "Database schema is outdated. Run supabase/schema.sql." },
                    { status: 400 }
                )
            }
            return NextResponse.json(
                { error: maybeError.message ?? "Signup failed" },
                { status: 400 }
            )
        }

        if (!data?.id) {
            return NextResponse.json({ error: "Signup failed" }, { status: 400 })
        }

        await setSessionCookie(sessionToken)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
