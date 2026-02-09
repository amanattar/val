import { createServerSupabaseClient } from '@/lib/supabase/server'
import { clearSessionFromCookie } from '@/lib/user-val-session'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = await createServerSupabaseClient()
    await clearSessionFromCookie(supabase)
    return NextResponse.json({ success: true })
}
