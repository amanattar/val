import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

const USER_COOKIE = 'val_user_token'

export type ValUser = {
  id: string
  display_name: string
  session_token: string
}

function randomGuestName() {
  return `Guest-${Math.random().toString(36).slice(2, 6)}`
}

export async function getUserFromCookie(
  supabase: SupabaseClient
): Promise<ValUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_COOKIE)?.value

  if (!token) return null

  const { data, error } = await supabase
    .from('user_val')
    .select('id, display_name, session_token')
    .eq('session_token', token)
    .maybeSingle()

  if (error || !data) return null
  return data as ValUser
}

export async function ensureUserFromCookie(
  supabase: SupabaseClient
): Promise<ValUser> {
  const cookieStore = await cookies()
  const existing = await getUserFromCookie(supabase)
  if (existing) return existing

  const sessionToken = crypto.randomUUID()
  const { data, error } = await supabase
    .from('user_val')
    .insert({
      display_name: randomGuestName(),
      session_token: sessionToken,
    })
    .select('id, display_name, session_token')
    .single()

  if (error || !data) {
    throw new Error('Failed to create local user session')
  }

  cookieStore.set(USER_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return data as ValUser
}
