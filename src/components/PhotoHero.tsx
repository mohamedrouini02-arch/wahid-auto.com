import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SplitText } from './motion/Shell'

// Light, photo-led hero: the headline, one real car cut out of its photo, and the same pinned
// labels the videos use (dot + line + white card). Scrolling drives the car away and lifts the type.
// The hero writes its scroll progress (0 → 1) into --p; everything else is CSS.

type Lang = 'ar' | 'fr'

const copy = {
    ar: {
        meta: 'من كوريا والصين إلى الجزائر', index: 'وحيد أوتو / 01',
        title: 'من طلبك\nحتى المفاتيح\n*في يدك.*',
        lead: 'نختارو السيارة معاك، نفحصوها، نشحنوها ونتكفلو بالأوراق. تعرف السعر النهائي قبل ما تخلص.',
        order: 'اطلب سيارتك', stock: 'السيارات المتوفرة',
        pins: [
            { t: 'مفحوصة قبل الشراء', s: 'صور وتقرير' },
            { t: 'سعر نهائي مكتوب', s: 'قبل أي دفع' },
            { t: 'كوريا ← الجزائر', s: 'شحن وجمركة علينا' },
        ],
        car: 'KIA SPORTAGE',
        brands: ['كيا', 'هيونداي', 'رينو', 'جيلي'],
        scroll: 'مرّر',
    },
    fr: {
        meta: 'Corée · Chine → Algérie', index: 'Wahid Auto / 01',
        title: 'De votre commande\naux clés\n*dans votre main.*',
        lead: 'Nous choisissons la voiture avec vous, l’inspectons, l’expédions et gérons les papiers. Vous connaissez le prix final avant de payer.',
        order: 'Commander', stock: 'Voitures disponibles',
        pins: [
            { t: 'Inspectée avant achat', s: 'Photos et rapport' },
            { t: 'Prix final écrit', s: 'Avant tout paiement' },
            { t: 'Corée → Algérie', s: 'Transport et douane inclus' },
        ],
        car: 'KIA SPORTAGE',
        brands: ['Kia', 'Hyundai', 'Renault', 'Geely'],
        scroll: 'Défiler',
    },
}

export default function PhotoHero({ language, isRTL }: { language: Lang; isRTL: boolean }) {
    const tx = copy[language]
    const Arrow = isRTL ? ArrowLeft : ArrowRight
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        let frame = 0
        const update = () => {
            frame = 0
            const r = el.getBoundingClientRect()
            const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.85)))
            el.style.setProperty('--p', p.toFixed(4))
        }
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
    }, [])

    return (
        <section className="px-hero" ref={ref} data-tone="light" data-scene="photo">
            <div className="px-inner">
                <div className="px-meta eyebrow">
                    <span><span className="live-dot" /> {tx.meta}</span>
                    <span className="latin">{tx.index}</span>
                </div>

                <div className="px-main">
                <div className="px-title-wrap">
                    <SplitText as="h1" className="px-title" text={tx.title} delay={900} />
                </div>

                <div className="px-stage">
                    <span className="px-word latin" aria-hidden="true">WAHID</span>
                    <div className="px-car">
                        <span className="px-shadow" aria-hidden="true" />
                        <img src="/cars/cutouts/kia-sportage.webp" alt="Kia Sportage" width={1573} height={864} decoding="async" />
                        <span className="px-plate latin" aria-hidden="true">{tx.car}</span>
                        {tx.pins.map((pin, i) => (
                            <span className={`px-pin px-pin-${i + 1}`} key={pin.t} aria-hidden="true">
                                <i className="px-dot" /><i className="px-line" />
                                <span className="px-card"><strong>{pin.t}</strong><small>{pin.s}</small></span>
                            </span>
                        ))}
                    </div>
                </div>

                </div>

                <div className="px-bottom">
                    <p className="px-lead">{tx.lead}</p>
                    <div className="px-actions">
                        <a href="#order" className="btn btn-primary btn-lg">{tx.order}</a>
                        <Link to="/stock" className="btn-link">{tx.stock} <Arrow size={18} strokeWidth={1.5} /></Link>
                    </div>
                    <ul className="px-pins-list" aria-label={tx.pins.map(p => p.t).join(' · ')}>
                        {tx.pins.map(pin => <li key={pin.t}><i />{pin.t}</li>)}
                    </ul>
                </div>

                <div className="px-foot">
                    <span className="px-brands">{tx.brands.map((b, i) => <span key={b}>{i > 0 && <i />}{b}</span>)}</span>
                    <span className="scroll-cue"><i /> {tx.scroll}</span>
                </div>
            </div>
        </section>
    )
}
