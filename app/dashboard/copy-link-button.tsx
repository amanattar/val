"use client"

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyLinkButton({ path }: { path: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        const fullUrl = new URL(path, window.location.origin).toString()
        try {
            await navigator.clipboard.writeText(fullUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch {
            setCopied(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            aria-label={copied ? "Link copied" : "Copy link"}
            title={copied ? "Copied!" : "Copy link"}
        >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
        </button>
    )
}
