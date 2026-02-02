"use client"

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
            <LogOut size={20} />
        </button>
    )
}
