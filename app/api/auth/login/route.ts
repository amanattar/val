import { createServerSupabaseClient } from '@/lib/supabase/server'
import { verifyPassword } from '@/lib/password'
import { createSessionForUser } from '@/lib/user-val-session'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email("Valid email is required"),
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

        const { email, password } = result.data

        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase
            .from('user_val')
            .select('id, password_hash')
            .eq('email', email.toLowerCase())
            .maybeSingle()

        if (error || !data) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const ok = await verifyPassword(password, data.password_hash)
        if (!ok) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        await createSessionForUser(supabase, data.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
