import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import type { HeroScene } from '../three/HeroScene'

// Full-bleed WebGL layer behind the hero text. Loads three.js lazily, pauses when off screen,
// follows the scroll, and falls back to nothing if WebGL is not available.
export default function Hero3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ready, setReady] = useState(false)
    const { isRTL } = useLanguage()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        let scene: HeroScene | null = null
        let cancelled = false
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const host = canvas.parentElement as HTMLElement

        const onScroll = () => {
            if (!scene) return
            const rect = host.getBoundingClientRect()
            scene.setScroll(Math.max(0, -rect.top) / Math.max(1, rect.height))
        }

        const observer = new IntersectionObserver(([entry]) => scene?.setActive(entry.isIntersecting), { threshold: 0 })

        import('../three/HeroScene')
            .then(({ createHeroScene }) => {
                if (cancelled) return
                try {
                    scene = createHeroScene(canvas, { reducedMotion, mirror: isRTL })
                    observer.observe(host)
                    window.addEventListener('scroll', onScroll, { passive: true })
                    onScroll()
                    setReady(true)
                } catch (err) {
                    console.warn('3D hero unavailable:', err)
                }
            })
            .catch(err => console.warn('3D hero failed to load:', err))

        return () => {
            cancelled = true
            observer.disconnect()
            window.removeEventListener('scroll', onScroll)
            scene?.destroy()
        }
    }, [isRTL])

    return <canvas ref={canvasRef} className={`hero-canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
}
