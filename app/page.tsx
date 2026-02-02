import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,var(--bg2),var(--bg1))] p-6 text-center font-sans overflow-hidden">
      <main className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          Valentine's <br /> Response Tracker
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Create a personalized valentine request page for your special someone and get notified when they say <b className="text-pink-600">YES!</b>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-rose-500/30"
          >
            Create Your Page
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 text-lg font-bold rounded-full border border-gray-200 transition-all hover:scale-105 shadow-md"
          >
            Login
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-400">
          100% Free & Open Source
        </div>
      </main>
    </div>
  )
}
