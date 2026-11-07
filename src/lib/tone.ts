import { useEffect } from 'react'

// Orbit-style page tone: every <section data-tone="dark|light" data-scene="..."> sets the page
// colours and the background scene's camera while it sits in the middle of the screen.
// body[data-tone] drives the CSS tokens, body[data-scene] the RouteScene camera, and the
// active section gets [data-active-section] so the scene can frame its [data-anchor] box.
export function useTone(pathname: string) {
    useEffect(() => {
        const body = document.body
        let frame = 0, active: Element | null = null
        const update = () => {
            frame = 0
            const mid = window.innerHeight * 0.5
            const sections = Array.from(document.querySelectorAll('main [data-tone], footer[data-tone]'))
            const hit = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid }) || null
            if (hit === active) return
            active?.removeAttribute('data-active-section')
            active = hit
            hit?.setAttribute('data-active-section', '')
            body.dataset.tone = hit?.getAttribute('data-tone') || 'dark'
            body.dataset.scene = hit?.getAttribute('data-scene') || 'quiet'
        }
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
        // pages render after the route change; check again once they have
        const t1 = window.setTimeout(update, 60), t2 = window.setTimeout(update, 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        update()
        return () => {
            window.clearTimeout(t1); window.clearTimeout(t2); cancelAnimationFrame(frame)
            window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll)
            active?.removeAttribute('data-active-section')
        }
    }, [pathname])
}
