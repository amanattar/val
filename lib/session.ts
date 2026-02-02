import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export const sessionOptions = {
    password: process.env.COOKIE_PASSWORD as string,
    cookieName: 'valentine_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

export interface SessionData {
    userId: number
    username: string
    isLoggedIn: boolean
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    return session
}
