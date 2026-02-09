import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

const USER_COOKIE = 'val_user_token'

export type ValUser = {
  id: string
  display_name: string
  email: string
  session_token: string
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  }
}

export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(USER_COOKIE, sessionToken, cookieOptions())
}

export async function getUserFromCookie(
  supabase: SupabaseClient
): Promise<ValUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_COOKIE)?.value

  if (!token) return null

  const { data, error } = await supabase
    .from('user_val')
    .select('id, display_name, email, session_token')
    .eq('session_token', token)
    .maybeSingle()

  if (error || !data) return null
  return data as ValUser
}

export async function createSessionForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const sessionToken = crypto.randomUUID()
  const { error } = await supabase
    .from('user_val')
    .update({ session_token: sessionToken })
    .eq('id', userId)

  if (error) {
    throw new Error('Failed to create user session')
  }

  await setSessionCookie(sessionToken)
  return sessionToken
}

export async function clearSessionFromCookie(supabase: SupabaseClient) {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_COOKIE)?.value
  if (token) {
    await supabase
      .from('user_val')
      .update({ session_token: crypto.randomUUID() })
      .eq('session_token', token)
  }
  cookieStore.delete(USER_COOKIE)
}
