import { createElement, useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react'
import { useLocation } from 'react-router-dom'

// First-visit loader: a counter to 100, then the curtain lifts.
export function Loader() {
    const [count, setCount] = useState(0)
    const [done, setDone] = useState(false)
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(true); return }
        const start = performance.now()
        let frame = 0
        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / 1300)
            setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))))
            if (p < 1) frame = requestAnimationFrame(tick)
            else window.setTimeout(() => setDone(true), 250)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [])
    return (
        <div className={`loader ${done ? 'is-done' : ''}`} aria-hidden="true">
            <span className="loader-brand latin">WAHID AUTO</span>
            <span className="loader-count latin num">{String(count).padStart(3, '0')}</span>
            <span className="loader-bar" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
    )
}

// A curtain that wipes across on every route change.
export function PageTransition() {
    const { pathname } = useLocation()
    const [key, setKey] = useState(0)
    const first = useRef(true)
    useEffect(() => {
        if (first.current) { first.current = false; return }
        setKey(k => k + 1)
    }, [pathname])
    return key ? <div key={key} className="curtain" aria-hidden="true" /> : null
}

// Custom cursor: a dot and a ring that follow the mouse and grow over anything clickable.
export function Cursor() {
    const dot = useRef<HTMLDivElement>(null)
    const ring = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return
        document.documentElement.classList.add('has-cursor')
        const pos = { x: -100, y: -100, rx: -100, ry: -100 }
        let frame = 0
        const move = (e: PointerEvent) => {
            pos.x = e.clientX; pos.y = e.clientY
            const target = e.target as HTMLElement
            const hot = target.closest('a, button, select, input, textarea, label, [role="button"]')
            ring.current?.classList.toggle('is-hot', Boolean(hot))
        }
        const loop = () => {
            pos.rx += (pos.x - pos.rx) * 0.16
            pos.ry += (pos.y - pos.ry) * 0.16
            if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
            if (ring.current) ring.current.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`
            frame = requestAnimationFrame(loop)
        }
        window.addEventListener('pointermove', move, { passive: true })
        frame = requestAnimationFrame(loop)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('pointermove', move)
            document.documentElement.classList.remove('has-cursor')
        }
    }, [])
    return (
        <>
            <div ref={ring} className="cursor-ring" aria-hidden="true" />
            <div ref={dot} className="cursor-dot" aria-hidden="true" />
        </>
    )
}

// Headline that reveals word by word when it enters the screen. Content is in the DOM from the start.
export function SplitText({ text, as = 'h2', className = '', delay = 0 }: { text: string; as?: ElementType; className?: string; delay?: number }) {
    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el || !('IntersectionObserver' in window)) { setVisible(true); return }
        if (el.getBoundingClientRect().top < window.innerHeight) { setVisible(true); return }
        const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.2 })
        io.observe(el)
        return () => io.disconnect()
    }, [])
    let index = 0
    const lines = text.split('\n')
    return createElement(as, { ref, className: `split ${visible ? 'is-in' : ''} ${className}`, 'aria-label': text.replace(/\n/g, ' ') },
        lines.map((line, li) => (
            <span className="split-line" key={li} aria-hidden="true">
                {line.split(' ').map((word, wi) => (
                    <span className="split-mask" key={wi}>
                        <span className="split-word" style={{ transitionDelay: `${delay + (index++) * 45}ms` }}>{word}</span>{' '}
                    </span>
                ))}
            </span>
        )))
}

// Paragraph whose words light up as you scroll through it (driven by --p from the scroll engine).
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
    const words = text.split(' ')
    return (
        <p className={`scrub ${className}`} data-progress aria-label={text}>
            {words.map((w, i) => (
                <span key={i} aria-hidden="true" style={{ '--i': (i / words.length).toFixed(3) } as CSSProperties}>{w} </span>
            ))}
        </p>
    )
}
