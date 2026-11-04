import { useEffect, useRef, useState } from 'react'
import { Monogram } from './Logo'

type Props = {
    photos: string[]
    alt: string
    onOpen?: (index: number) => void
    badge?: string | null
    large?: boolean
    startIndex?: number
}

// Swipeable photo strip: native scroll-snap on phones, arrows on desktop.
export default function StockGallery({ photos, alt, onOpen, badge, large, startIndex = 0 }: Props) {
    const track = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(startIndex)

    useEffect(() => {
        const el = track.current
        if (!el || !startIndex) return
        el.scrollTo({ left: Math.abs(el.clientWidth * startIndex) * (getComputedStyle(el).direction === 'rtl' ? -1 : 1), behavior: 'instant' as ScrollBehavior })
    }, [startIndex])

    const onScroll = () => {
        const el = track.current
        if (!el) return
        setIndex(Math.round(Math.abs(el.scrollLeft) / el.clientWidth))
    }

    const go = (step: number) => {
        const el = track.current
        if (!el) return
        const rtl = getComputedStyle(el).direction === 'rtl'
        const next = Math.max(0, Math.min(photos.length - 1, index + step))
        el.scrollTo({ left: el.clientWidth * next * (rtl ? -1 : 1), behavior: 'smooth' })
    }

    if (photos.length === 0) {
        return <div className={`sg ${large ? 'sg-large' : ''}`}><div className="sg-empty"><Monogram size={64} /></div></div>
    }

    return (
        <div className={`sg ${large ? 'sg-large' : ''}`}>
            <div className="sg-track" ref={track} onScroll={onScroll}>
                {photos.map((src, i) => (
                    <button type="button" className="sg-slide" key={src + i} onClick={() => onOpen?.(i)} tabIndex={onOpen ? 0 : -1} aria-label={`${alt} ${i + 1}/${photos.length}`}>
                        <img src={src} alt={`${alt} ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                    </button>
                ))}
            </div>
            {badge && <span className="stock-badge">{badge}</span>}
            {photos.length > 1 && (
                <>
                    <span className="sg-count num">{index + 1} / {photos.length}</span>
                    <button type="button" className="sg-arrow sg-prev" onClick={() => go(-1)} disabled={index === 0} aria-label="‹">‹</button>
                    <button type="button" className="sg-arrow sg-next" onClick={() => go(1)} disabled={index === photos.length - 1} aria-label="›">›</button>
                </>
            )}
        </div>
    )
}
