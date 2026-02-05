"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Signup() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [info, setInfo] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setInfo("")

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const json = await res.json()

        if (!res.ok) {
            setError(json.error)
            setLoading(false)
        } else if (json.requiresEmailConfirmation) {
            setInfo("Check your email to confirm your account before logging in.")
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,var(--bg2),var(--bg1))] p-6">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/50"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {info && <p className="text-green-600 text-sm text-center">{info}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-pink-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}
