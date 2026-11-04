import { useEffect, useRef } from 'react'

// Two faint waving flags behind the whole site: Korea (where the cars come from)
// and Algeria (where they arrive). Drawn once to an offscreen canvas, then
// redrawn as vertical strips offset by a travelling sine wave, with soft
// light/shadow on each fold. Capped at 30 fps, paused when the tab is hidden,
// static when the visitor prefers reduced motion.

const OW = 600
const OH = 400

const drawKorea = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, OW, OH)
    const cx = OW / 2, cy = OH / 2, r = OH / 4
    const a = Math.atan2(OH, OW)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(a)
    ctx.fillStyle = '#0047A0'
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#CD2E3A'
    ctx.beginPath()
    ctx.arc(0, 0, r, Math.PI, 0, false)
    ctx.arc(r / 2, 0, r / 2, 0, Math.PI, true)
    ctx.arc(-r / 2, 0, r / 2, 0, Math.PI, false)
    ctx.closePath(); ctx.fill()
    ctx.restore()

    const bw = OH / 24, gap = OH / 48, len = OH / 4, brk = OH / 48
    const start = r + OH / 16
    // [angle, bars from the centre outwards: true = solid]
    const trigrams: [number, boolean[]][] = [
        [Math.PI + a, [true, true, true]],
        [a, [false, false, false]],
        [-a, [false, true, false]],
        [Math.PI - a, [true, false, true]],
    ]
    ctx.fillStyle = '#111111'
    for (const [angle, bars] of trigrams) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle)
        bars.forEach((solid, k) => {
            const x = start + k * (bw + gap)
            if (solid) ctx.fillRect(x, -len / 2, bw, len)
            else {
                ctx.fillRect(x, -len / 2, bw, len / 2 - brk / 2)
                ctx.fillRect(x, brk / 2, bw, len / 2 - brk / 2)
            }
        })
        ctx.restore()
    }
}

const starPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, rot: number) => {
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? outer : inner
        const ang = rot + (i * Math.PI) / 5
        const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
}

const drawAlgeria = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#006233'
    ctx.fillRect(0, 0, OW / 2, OH)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(OW / 2, 0, OW / 2, OH)
    ctx.fillStyle = '#D21034'
    ctx.beginPath()
    ctx.arc(OW / 2 + 12, OH / 2, OH / 4, 0, Math.PI * 2)
    ctx.moveTo(OW / 2 + 32 + OH / 5, OH / 2)
    ctx.arc(OW / 2 + 32, OH / 2, OH / 5, 0, Math.PI * 2)
    ctx.fill('evenodd')
    starPath(ctx, OW / 2 + 48, OH / 2, OH / 8, OH / 20, Math.PI)
    ctx.fill()
}

type Flag = { canvas: HTMLCanvasElement; source: HTMLCanvasElement; phase: number }

const makeSource = (draw: (ctx: CanvasRenderingContext2D) => void) => {
    const c = document.createElement('canvas')
    c.width = OW; c.height = OH
    const ctx = c.getContext('2d')
    if (ctx) draw(ctx)
    return c
}

export default function WavingFlags() {
    const root = useRef<HTMLDivElement>(null)
    const korea = useRef<HTMLCanvasElement>(null)
    const algeria = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!korea.current || !algeria.current || !root.current) return
        const flags: Flag[] = [
            { canvas: korea.current, source: makeSource(drawKorea), phase: 0 },
            { canvas: algeria.current, source: makeSource(drawAlgeria), phase: 1.7 },
        ]
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const small = window.matchMedia('(max-width: 760px)').matches
        const strips = small ? 36 : 56
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

        const resize = () => {
            for (const f of flags) {
                const { width, height } = f.canvas.getBoundingClientRect()
                f.canvas.width = Math.max(1, Math.round(width * dpr))
                f.canvas.height = Math.max(1, Math.round(height * dpr))
            }
        }

        const render = (t: number) => {
            for (const f of flags) {
                const ctx = f.canvas.getContext('2d')
                if (!ctx) continue
                const cw = f.canvas.width, ch = f.canvas.height
                const amp = ch * 0.045
                const fw = cw, fh = ch - amp * 2.4
                const top = (ch - fh) / 2
                const sw = fw / strips
                ctx.clearRect(0, 0, cw, ch)
                for (let i = 0; i < strips; i++) {
                    const u = i / strips
                    const grow = 0.3 + 0.7 * u
                    const wave = t * 1.6 + f.phase - u * 5.2
                    const dy = Math.sin(wave) * amp * grow + Math.sin(wave * 0.5 + 1) * amp * 0.25
                    const x = i * sw
                    ctx.drawImage(f.source, u * OW, 0, OW / strips + 0.5, OH, x, top + dy, sw + 0.8, fh)
                    const shade = Math.cos(wave) * grow
                    ctx.fillStyle = shade > 0 ? `rgba(255,255,255,${0.10 * shade})` : `rgba(0,0,0,${0.32 * -shade})`
                    ctx.fillRect(x, top + dy, sw + 0.8, fh)
                }
            }
        }

        // Brighter in the hero, calmer further down; a slow sway follows the scroll.
        const onScroll = () => {
            const el = root.current
            if (!el) return
            const vh = window.innerHeight || 1
            const p = Math.min(1, window.scrollY / vh)
            el.style.setProperty('--flags-o', String(1 - 0.4 * p))
            el.style.setProperty('--flags-y', `${Math.sin(window.scrollY / 1400) * 28}px`)
        }

        resize()
        onScroll()
        window.addEventListener('resize', resize)
        window.addEventListener('scroll', onScroll, { passive: true })

        let raf = 0
        let last = 0
        const start = performance.now()
        const loop = (now: number) => {
            raf = requestAnimationFrame(loop)
            if (document.hidden || now - last < 33) return
            last = now
            render((now - start) / 1000)
        }
        if (reduced) render(0.8)
        else raf = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <div className="flags-bg" ref={root} aria-hidden="true">
            <canvas className="flag-wave flag-kr" ref={korea} />
            <canvas className="flag-wave flag-dz" ref={algeria} />
        </div>
    )
}
