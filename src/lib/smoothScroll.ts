import { useEffect } from 'react'

// Smooth, eased page scrolling on desktop mice and trackpads (Lenis-style), plus scroll-linked
// motion for any element with data-speed. Touch devices and reduced-motion keep native scrolling.
export const useSmoothScroll = (pathname: string) => {
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const finePointer = window.matchMedia('(pointer: fine)').matches
        let target = window.scrollY
        let current = window.scrollY
        let frame = 0
        let smoothing = false

        const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

        const parallax = () => {
            if (reduced) return
            const items = document.querySelectorAll<HTMLElement>('[data-speed]')
            const vh = window.innerHeight
            items.forEach(el => {
                const speed = Number(el.dataset.speed) || 0
                const rect = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect()
                const offset = (rect.top + rect.height / 2 - vh / 2) * speed
                el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
            })
        }

        const tick = () => {
            current += (target - current) * 0.1
            if (Math.abs(target - current) < 0.5) {
                current = target
                smoothing = false
            }
            window.scrollTo(0, current)
            parallax()
            if (smoothing) frame = requestAnimationFrame(tick)
        }

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.defaultPrevented) return
            // Let inner scrollable areas (menus, tables) scroll themselves
            const scroller = (e.target as HTMLElement).closest('[data-native-scroll], .nav-mobile, select, textarea')
            if (scroller) return
            e.preventDefault()
            if (!smoothing) target = current = window.scrollY
            target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * (e.deltaMode === 1 ? 32 : 1)))
            if (!smoothing) {
                smoothing = true
                frame = requestAnimationFrame(tick)
            }
        }

        const onNativeScroll = () => {
            if (!smoothing) {
                target = current = window.scrollY
                parallax()
            }
        }

        parallax()
        window.addEventListener('scroll', onNativeScroll, { passive: true })
        window.addEventListener('resize', parallax)
        if (!reduced && finePointer) window.addEventListener('wheel', onWheel, { passive: false })

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('scroll', onNativeScroll)
            window.removeEventListener('resize', parallax)
        }
    }, [pathname])
}
