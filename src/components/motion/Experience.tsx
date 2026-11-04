import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { onPageProgress } from '../../lib/smoothScroll'
import type { World } from '../../three/World'

// The persistent 3D world behind every page. Loaded lazily; if WebGL fails the page stays fully usable.
export default function Experience() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const worldRef = useRef<World | null>(null)
    const [ready, setReady] = useState(false)
    const { isRTL } = useLanguage()
    const { pathname } = useLocation()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        let cancelled = false
        let unsubscribe = () => {}
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const onVisibility = () => worldRef.current?.setActive(!document.hidden)

        import('../../three/World')
            .then(({ createWorld }) => {
                if (cancelled) return
                try {
                    worldRef.current = createWorld(canvas, { reducedMotion, mirror: isRTL })
                    unsubscribe = onPageProgress(p => worldRef.current?.setProgress(p))
                    document.addEventListener('visibilitychange', onVisibility)
                    setReady(true)
                } catch (err) {
                    console.warn('3D world unavailable:', err)
                }
            })
            .catch(err => console.warn('3D world failed to load:', err))

        return () => {
            cancelled = true
            unsubscribe()
            document.removeEventListener('visibilitychange', onVisibility)
            worldRef.current?.destroy()
            worldRef.current = null
        }
    }, [isRTL])

    // Every page starts its own journey from the monogram
    useEffect(() => { worldRef.current?.jumpTo(0) }, [pathname])

    return <canvas ref={canvasRef} className={`experience ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
}
