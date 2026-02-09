import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromCookie } from '@/lib/user-val-session'
import { redirect } from 'next/navigation'
import CreatePageForm from './create-form'
import { ExternalLink, Heart } from 'lucide-react'
import CopyLinkButton from './copy-link-button'
import LogoutButton from './logout-button'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    const supabase = await createServerSupabaseClient()
    const user = await getUserFromCookie(supabase)
    if (!user) {
        redirect('/login')
    }
    let pages: {
        id: string
        slug: string | null
        valentine_name: string
        responded: boolean
        response_at: string | null
        created_at: string
    }[] | null = []
    let pagesError: unknown = null

    const query = await supabase
        .from('val_pages')
        .select('id, slug, valentine_name, responded, response_at, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    pages = query.data
    pagesError = query.error

    if (pagesError) {
        console.error("Dashboard pages error:", pagesError)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
                <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                    Valentine's Tracker
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                    <span className="text-gray-600 text-sm sm:text-base truncate">Hi, {user.display_name}</span>
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
                        {!pages || pages.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                                You haven't created any pages yet.
                            </div>
                        ) : (
                            pages.map((page) => {
                                const sharePath = `/p/${page.slug ?? page.id}`
                                return (
                                <div key={page.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between transition hover:shadow-md">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{page.valentine_name}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <a
                                                href={sharePath}
                                                target="_blank"
                                                className="text-sm text-blue-500 hover:underline flex items-center gap-1 break-all"
                                            >
                                                {sharePath} <ExternalLink size={12} />
                                            </a>
                                            <CopyLinkButton path={sharePath} />
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-400">Created {new Date(page.created_at).toLocaleDateString()}</span>
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
                                        {page.responded && page.response_at && (
                                            <span className="text-xs text-gray-400 mt-1">
                                                at {new Date(page.response_at).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
