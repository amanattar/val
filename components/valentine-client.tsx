"use client"

import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useParams } from 'next/navigation'

export default function ValentineClient({ name, id }: { name: string; id: string }) {
    const [yesPressed, setYesPressed] = useState(false)
    const [yesScale, setYesScale] = useState(1)
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
    const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({})

    const yesBtnRef = useRef<HTMLButtonElement>(null)
    const noBtnRef = useRef<HTMLButtonElement>(null)
    const zoneRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Confetti setup
    useEffect(() => {
        if (!canvasRef.current) return
        const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        })

        if (yesPressed) {
            const end = Date.now() + 1600;

            const frame = () => {
                myConfetti({
                    particleCount: 12,
                    spread: 90,
                    startVelocity: 45,
                    ticks: 180,
                    origin: { x: Math.random(), y: Math.random() * 0.3 }
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();

            setTimeout(() => {
                myConfetti({
                    particleCount: 300,
                    spread: 140,
                    startVelocity: 60,
                    ticks: 220,
                    origin: { x: 0.5, y: 0.55 }
                });
            }, 300);

            // Trigger API call
            fetch('/api/response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageId: id }),
            })
        }
    }, [yesPressed, id])

    // No button running away logic
    const moveNo = (clientX: number, clientY: number) => {
        if (!noBtnRef.current || !zoneRef.current) return;

        const b = noBtnRef.current.getBoundingClientRect();
        const z = zoneRef.current.getBoundingClientRect();

        let dx = (b.left + b.width / 2) - clientX;
        let dy = (b.top + b.height / 2) - clientY;
        let mag = Math.hypot(dx, dy) || 1;
        dx /= mag;
        dy /= mag;

        const distance = 150;
        let newLeft = (b.left - z.left) + dx * distance;
        let newTop = (b.top - z.top) + dy * distance;

        // Clamp within zone
        newLeft = Math.max(0, Math.min(newLeft, z.width - b.width));
        newTop = Math.max(0, Math.min(newTop, z.height - b.height));

        setNoBtnStyle({
            position: 'absolute',
            left: `${newLeft}px`,
            top: `${newTop}px`,
            transform: 'none', // Override the centering transform
        })

        // Grow Yes button
        setYesScale(s => Math.min(2.5, s + 0.1))
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (yesPressed) return;
        if (!noBtnRef.current) return;

        const b = noBtnRef.current.getBoundingClientRect();
        const d = Math.hypot(
            (b.left + b.width / 2) - e.clientX,
            (b.top + b.height / 2) - e.clientY
        );

        // If closer than 140px, move away
        if (d < 140) {
            moveNo(e.clientX, e.clientY);
        }
    }

    // Handle generic clicks on No (if they manage to click it)
    const handleNoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Force move
        if (noBtnRef.current && zoneRef.current) {
            const z = zoneRef.current.getBoundingClientRect();
            const b = noBtnRef.current.getBoundingClientRect();
            moveNo(b.left + b.width / 2, b.top + b.height / 2);
        }
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-screen h-screen pointer-events-none z-[9999]"
            />

            <main className="card backdrop-blur-[10px] bg-white/80 rounded-[22px] p-[26px_22px] w-[min(720px,92vw)] text-center shadow-[0_18px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-700">

                {/* Animal SVG */}
                <svg className="block w-[min(260px,80vw)] mx-auto mb-2 drop-shadow-[0_10px_14px_rgba(0,0,0,0.12)]" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="fur" x1="0" x2="1">
                            <stop offset="0" stopColor="#f7c7a1" />
                            <stop offset="1" stopColor="#f2a97b" />
                        </linearGradient>
                        <linearGradient id="heart" x1="0" x2="1">
                            <stop offset="0" stopColor="#ff4d7d" />
                            <stop offset="1" stopColor="#ff1f68" />
                        </linearGradient>
                    </defs>

                    <path d="M250 50 C250 33 270 25 282 38 C294 25 314 33 314 50 C314 78 282 92 282 106 C282 92 250 78 250 50Z" fill="url(#heart)" />
                    <path d="M90 120 C90 70 140 40 190 60 C240 40 290 70 290 120 C290 180 240 210 190 210 C140 210 90 180 90 120Z" fill="url(#fur)" />
                    <path d="M110 92 L95 55 L140 78 Z" fill="#f2a97b" />
                    <path d="M270 92 L285 55 L240 78 Z" fill="#f2a97b" />
                    <circle cx="160" cy="130" r="8" />
                    <circle cx="220" cy="130" r="8" />
                    <path d="M190 144 C186 144 182 148 182 152 C182 160 190 164 190 170 C190 164 198 160 198 152 C198 148 194 144 190 144Z" fill="#ff7aa2" />
                </svg>

                <h1 className="text-[clamp(26px,4vw,44px)] m-[12px_0_18px] font-sans font-normal">
                    {name}, will you be my valentine?
                </h1>

                {!yesPressed ? (
                    <>
                        <section
                            ref={zoneRef}
                            id="zone"
                            className="relative w-[min(520px,92%)] h-[150px] mx-auto touch-none"
                            onPointerMove={handlePointerMove}
                        >
                            <button
                                ref={yesBtnRef}
                                id="yesBtn"
                                onClick={() => setYesPressed(true)}
                                style={{
                                    transform: `translateY(-50%) scale(${yesScale})`,
                                    left: '18%',
                                }}
                                className="absolute top-1/2 p-[16px_24px] text-[18px] font-extrabold rounded-full border-0 cursor-pointer shadow-[0_10px_24px_rgba(0,0,0,0.14)] select-none transition-transform duration-100 ease-out bg-[#ff3b7a] hover:bg-[#ff1f68] text-white"
                            >
                                Yes
                            </button>

                            <button
                                ref={noBtnRef}
                                id="noBtn"
                                onClick={handleNoClick}
                                style={{
                                    ...noBtnStyle,
                                    left: noBtnStyle.left || '62%',
                                    top: noBtnStyle.top || '50%',
                                    transform: noBtnStyle.transform || 'translateY(-50%)'
                                }}
                                className="absolute p-[16px_24px] text-[18px] font-extrabold rounded-full border-0 cursor-pointer shadow-[0_10px_24px_rgba(0,0,0,0.14)] select-none transition-[top,left] duration-100 ease-out bg-[#e5e7eb] text-[#111827]"
                            >
                                No
                            </button>
                        </section>
                        <div className="mt-[10px] text-[13px] opacity-70">“No” seems a bit shy 😈</div>
                    </>
                ) : (
                    <section className="mt-[18px] animate-in zoom-in duration-300">
                        <h2 className="text-[clamp(30px,4.5vw,46px)] m-[10px_0]">YAY! 🎉</h2>
                        <img
                            className="w-[min(380px,90vw)] mx-auto block"
                            src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
                            alt="Fireworks"
                        />
                    </section>
                )}
            </main>
        </>
    )
}
