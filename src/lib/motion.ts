import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds "is-visible" to elements with [data-reveal] as they scroll into view.
// Content stays visible if JavaScript or IntersectionObserver is missing.
export const useScrollReveal = () => {
    useEffect(() => {
        if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
        const root = document.documentElement
        root.classList.add('reveal-ready')
        const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
            })
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
        items.forEach(item => {
            // Anything already on screen shows at once, so the first view is never empty.
            if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add('is-visible')
            else observer.observe(item)
        })
        return () => {
            observer.disconnect()
            root.classList.remove('reveal-ready')
        }
    }, [])
}

// Counts a number up once its element is on screen. Returns the ref and the current text.
export const useCountUp = (target: number, durationMs = 1400) => {
    const ref = useRef<HTMLElement>(null)
    const [value, setValue] = useState(prefersReducedMotion() ? target : 0)

    useEffect(() => {
        if (prefersReducedMotion() || !ref.current || !('IntersectionObserver' in window)) {
            setValue(target)
            return
        }
        let frame = 0
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()
            const start = performance.now()
            const tick = (now: number) => {
                const progress = Math.min(1, (now - start) / durationMs)
                const eased = 1 - Math.pow(1 - progress, 3)
                setValue(Math.round(target * eased))
                if (progress < 1) frame = requestAnimationFrame(tick)
            }
            frame = requestAnimationFrame(tick)
        }, { threshold: 0.4 })
        observer.observe(ref.current)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [target, durationMs])

    return { ref, value }
}
