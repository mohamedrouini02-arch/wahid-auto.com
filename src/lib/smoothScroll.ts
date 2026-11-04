import { useEffect } from 'react'

// One scroll engine for the whole site:
// - eased wheel scrolling on desktop (touch and reduced motion keep native scrolling)
// - every frame: page progress for the 3D world, [data-speed] parallax,
//   [data-progress] elements get --p (0 entering, 1 leaving),
//   [data-pin] sticky sections get --p across their scroll length,
//   [data-hscroll] tracks slide horizontally while their section is pinned.

type Listener = (progress: number) => void
const listeners = new Set<Listener>()
export const onPageProgress = (fn: Listener) => { listeners.add(fn); return () => { listeners.delete(fn) } }

const clamp = (v: number) => Math.max(0, Math.min(1, v))

export const useSmoothScroll = (pathname: string) => {
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const finePointer = window.matchMedia('(pointer: fine)').matches
        let target = window.scrollY
        let current = window.scrollY
        let smoothing = false
        let frame = 0

        const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

        const update = () => {
            const vh = window.innerHeight
            const y = window.scrollY
            const pageProgress = clamp(y / maxScroll())
            listeners.forEach(fn => fn(pageProgress))
            document.documentElement.style.setProperty('--page-p', pageProgress.toFixed(4))

            if (!reduced) {
                document.querySelectorAll<HTMLElement>('[data-speed]').forEach(el => {
                    const rect = (el.parentElement ?? el).getBoundingClientRect()
                    const offset = (rect.top + rect.height / 2 - vh / 2) * (Number(el.dataset.speed) || 0)
                    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
                })
            }
            document.querySelectorAll<HTMLElement>('[data-progress]').forEach(el => {
                const rect = el.getBoundingClientRect()
                el.style.setProperty('--p', clamp((vh - rect.top) / (vh + rect.height)).toFixed(4))
            })
            document.querySelectorAll<HTMLElement>('[data-pin]').forEach(el => {
                const rect = el.getBoundingClientRect()
                const p = clamp(-rect.top / Math.max(1, rect.height - vh))
                el.style.setProperty('--p', p.toFixed(4))
                const track = el.querySelector<HTMLElement>('[data-hscroll]')
                if (track) {
                    const distance = Math.max(0, track.scrollWidth - track.clientWidth)
                    const dir = document.documentElement.dir === 'rtl' ? 1 : -1
                    track.style.transform = `translate3d(${(dir * p * distance).toFixed(1)}px, 0, 0)`
                }
            })
        }

        const tick = () => {
            current += (target - current) * 0.09
            if (Math.abs(target - current) < 0.4) { current = target; smoothing = false }
            window.scrollTo(0, current)
            update()
            if (smoothing) frame = requestAnimationFrame(tick)
        }

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.defaultPrevented) return
            if ((e.target as HTMLElement).closest('[data-native-scroll], select, textarea, .menu-overlay')) return
            if (document.body.style.overflow === 'hidden') return
            e.preventDefault()
            if (!smoothing) target = current = window.scrollY
            target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * (e.deltaMode === 1 ? 32 : 1)))
            if (!smoothing) { smoothing = true; frame = requestAnimationFrame(tick) }
        }

        const onNativeScroll = () => {
            if (!smoothing) { target = current = window.scrollY; update() }
        }

        update()
        // Layout settles after images and fonts: refresh a few times
        const settle = [100, 600, 1500].map(ms => window.setTimeout(update, ms))
        window.addEventListener('scroll', onNativeScroll, { passive: true })
        window.addEventListener('resize', update)
        if (!reduced && finePointer) window.addEventListener('wheel', onWheel, { passive: false })

        return () => {
            cancelAnimationFrame(frame)
            settle.forEach(clearTimeout)
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('scroll', onNativeScroll)
            window.removeEventListener('resize', update)
        }
    }, [pathname])
}
