import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreatePageForm from './create-form'
import { LogOut, ExternalLink, Heart } from 'lucide-react'
import LogoutButton from './logout-button'

export default async function Dashboard() {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
        redirect('/login')
    }

    const pages = await db.page.findMany({
        where: { creatorId: session.userId },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                    Valentine's Tracker
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Hi, {session.username}</span>
                    <LogoutButton />
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6 md:p-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Valentines</h1>
                    <p className="text-gray-500">Create new pages and track their responses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Create New Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Create New Page</h2>
                        <CreatePageForm />
                    </div>

                    {/* List Pages */}
                    <div className="md:col-span-2 space-y-4">
                        {pages.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                                You haven't created any pages yet.
                            </div>
                        ) : (
                            pages.map((page) => (
                                <div key={page.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{page.valentineName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <a
                                                href={`/p/${page.id}`}
                                                target="_blank"
                                                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                            >
                                                /p/{page.id} <ExternalLink size={12} />
                                            </a>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-400">Created {new Date(page.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        {page.responded ? (
                                            <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                                                <Heart size={14} fill="currentColor" /> Said YES!
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">Waiting...</span>
                                        )}
                                        {page.responded && page.responseAt && (
                                            <span className="text-xs text-gray-400 mt-1">
                                                at {new Date(page.responseAt).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
