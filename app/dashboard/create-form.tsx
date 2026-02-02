"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePageForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const valentineName = formData.get('valentineName')

        const res = await fetch('/api/pages/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valentineName }),
        })

        if (res.ok) {
            const data = await res.json()
            // Optional: Copy link or show success
            router.refresh()
            // Reset form
            const form = e.target as HTMLFormElement
            form.reset()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Valentine's Name</label>
                <input
                    name="valentineName"
                    type="text"
                    placeholder="e.g. Nirali"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition"
            >
                {loading ? "Creating..." : "Create Page"}
            </button>
        </form>
    )
}
