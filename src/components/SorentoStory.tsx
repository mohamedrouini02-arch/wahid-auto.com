import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SplitText } from './motion/Shell'

// Scroll-driven walk-around of one car (Kia Sorento X-Pro, one photo shoot).
// The section is tall; the stage stays pinned while scrolling moves a virtual camera:
// the car drives towards you, then the camera circles it (front → side → rear → rear three-quarter).
// Each angle wipes in the way the camera travels, with the same pinned labels as the videos.
// All motion is written straight to the DOM from one rAF per scroll (no React re-renders).

type Lang = 'ar' | 'fr'
type Pin = { x: number; y: number; ar: string; arS: string; fr: string; frS: string }
type Frame = { key: string; pos: [number, number]; pins: Pin[]; ar?: [string, string]; fr?: [string, string] }

const RATIO = 1.5            // every photo is 3:2
const FRAMES: Frame[] = [
    { key: 'drive', pos: [0.5, 0.62], pins: [] },
    {
        key: 'front', pos: [0.55, 0.62],
        ar: ['نشوفوها قبل ما تشريها', 'فحص كامل، صور وتقرير على كل سيارة قبل أي دفع.'],
        fr: ['Vue avant d’être achetée', 'Inspection complète, photos et rapport avant tout paiement.'],
        pins: [
            { x: 0.66, y: 0.53, ar: 'مفحوصة قبل الشراء', arS: 'المحرك، الهيكل والأعطال', fr: 'Inspectée avant achat', frS: 'Moteur, châssis, défauts' },
            { x: 0.35, y: 0.79, ar: 'العجلات والفرامل', arS: 'مصوّرة في التقرير', fr: 'Pneus et freins', frS: 'Photographiés dans le rapport' },
        ],
    },
    {
        key: 'side', pos: [0.5, 0.62],
        ar: ['الصبغة والكيلومترات، بالأرقام', 'نقيسو الصبغة بالجهاز ونتأكدو من العداد والتاريخ.'],
        fr: ['Peinture et kilométrage, en chiffres', 'Peinture mesurée à la jauge, compteur et historique vérifiés.'],
        pins: [
            { x: 0.46, y: 0.56, ar: 'الصبغة مقاسة بالجهاز', arS: 'زيرو صبغة ولا لا، مكتوب', fr: 'Peinture mesurée', frS: 'Zéro peinture ou pas, écrit' },
            { x: 0.70, y: 0.50, ar: 'تاريخ السيارة', arS: 'الحوادث والصيانة من كوريا', fr: 'Historique', frS: 'Accidents et entretien en Corée' },
        ],
    },
    {
        key: 'rear', pos: [0.5, 0.55],
        ar: ['الأوراق علينا', 'الشراء، الشحن والجمركة: ملف كامل ومكتوب باسمك.'],
        fr: ['Les papiers, c’est nous', 'Achat, transport et douane : un dossier complet à votre nom.'],
        pins: [
            { x: 0.50, y: 0.43, ar: 'ملف كامل', arS: 'فاتورة، عقد وشهادة الشحن', fr: 'Dossier complet', frS: 'Facture, contrat, connaissement' },
        ],
    },
    {
        key: 'rear34', pos: [0.48, 0.6],
        ar: ['حتى توصل لعندك', 'نتبعو الشحنة معاك خطوة بخطوة، حتى المفاتيح في يدك.'],
        fr: ['Jusqu’à chez vous', 'Le suivi étape par étape, jusqu’aux clés dans votre main.'],
        pins: [
            { x: 0.57, y: 0.44, ar: 'كوريا ← الجزائر', arS: 'شحن مؤمّن وجمركة', fr: 'Corée → Algérie', frS: 'Transport assuré, dédouanement' },
        ],
    },
]

const copy = {
    ar: {
        meta: 'من كوريا والصين إلى الجزائر', title: 'من طلبك\nحتى المفاتيح\n*في يدك.*',
        lead: 'نختارو السيارة معاك، نفحصوها، نشحنوها ونتكفلو بالأوراق. تعرف السعر النهائي قبل ما تخلص.',
        order: 'اطلب سيارتك', stock: 'السيارات المتوفرة', scroll: 'مرّر باش تدور بالسيارة', car: 'KIA SORENTO X-PRO',
    },
    fr: {
        meta: 'Corée · Chine → Algérie', title: 'De votre commande\naux clés\n*dans votre main.*',
        lead: 'Nous choisissons la voiture avec vous, l’inspectons, l’expédions et gérons les papiers. Vous connaissez le prix final avant de payer.',
        order: 'Commander', stock: 'Voitures disponibles', scroll: 'Défilez pour faire le tour', car: 'KIA SORENTO X-PRO',
    },
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function SorentoStory({ language, isRTL }: { language: Lang; isRTL: boolean }) {
    const tx = copy[language]
    const Arrow = isRTL ? ArrowLeft : ArrowRight
    const root = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = root.current
        if (!el) return
        const frames = Array.from(el.querySelectorAll<HTMLElement>('.ss-frame'))
        const fits = Array.from(el.querySelectorAll<HTMLElement>('.ss-fit'))
        const caps = Array.from(el.querySelectorAll<HTMLElement>('.ss-cap'))
        const pins = frames.map(f => Array.from(f.querySelectorAll<HTMLElement>('.ss-pin')))
        const hero = el.querySelector<HTMLElement>('.ss-hero')
        const bar = el.querySelector<HTMLElement>('.ss-bar i')
        const count = el.querySelector<HTMLElement>('.ss-count b')
        const cue = el.querySelector<HTMLElement>('.ss-cue')
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
        const N = FRAMES.length
        let frame = 0

        // place each photo's pin layer exactly over the rendered photo (cover on wide screens, contain on tall ones)
        const layout = () => {
            const stage = el.querySelector<HTMLElement>('.ss-stage')!
            const bw = stage.clientWidth, bh = stage.clientHeight
            const contain = bw / bh < 1.05
            el.dataset.fit = contain ? 'contain' : 'cover'
            fits.forEach((fit, i) => {
                const [px, py] = FRAMES[i].pos
                const s = contain ? Math.min(bw / RATIO, bh) : Math.max(bw / RATIO, bh)
                const w = s * RATIO, h = s
                fit.style.width = `${w}px`; fit.style.height = `${h}px`
                fit.style.left = `${(bw - w) * px}px`; fit.style.top = `${contain ? (bh - h) * 0.46 : (bh - h) * py}px`
            })
        }

        const update = () => {
            frame = 0
            const r = el.getBoundingClientRect()
            const p = clamp(-r.top / Math.max(1, r.height - innerHeight))
            const s = p * (N - 0.5)                     // 0 … 4.5 : which angle we're on (the last one holds a little)
            frames.forEach((f, i) => {
                // reveal: the last 40 % of the previous unit wipes this angle in
                const rev = i === 0 ? 1 : ease(clamp((s - (i - 1) - 0.55) / 0.45))
                const out = i === N - 1 ? 0 : ease(clamp((s - i - 0.55) / 0.45))
                const local = clamp(s - i + 1)          // 0→1 while it arrives, 1→2 while it holds
                let scale = 1.06 - 0.06 * clamp(local / 1.6)
                let ty = 0
                if (i === 0) { const a = ease(clamp(s / 0.55)); scale = 1 + 0.2 * a; ty = -3 * a }   // the car drives towards you
                const tx = (1 - rev) * 12 - out * 7                                                 // camera travelling
                f.style.visibility = rev <= 0 || out >= 1 ? 'hidden' : 'visible'
                f.style.clipPath = i === 0 ? 'none' : `inset(0 0 0 ${(1 - rev) * 100}%)`
                f.style.transform = reduce ? 'none' : `translate3d(${tx}%, ${ty}%, 0) scale(${scale})`
                // labels show once the angle has settled, and leave before it moves on
                const hold = i === 0 ? 0 : clamp((s - i + 0.05) / 0.2) * (i === N - 1 ? 1 : 1 - clamp((s - i - 0.35) / 0.15))
                pins[i].forEach((pin, k) => {
                    const v = clamp(hold * 1.6 - k * 0.25)
                    pin.style.opacity = String(v)
                    pin.style.setProperty('--v', String(v))
                })
                const cap = caps[i - 1]
                if (cap) {
                    const c = clamp((s - i + 0.3) / 0.2) * (i === N - 1 ? 1 : 1 - clamp((s - i - 0.42) / 0.13))
                    cap.style.opacity = String(c)
                    cap.style.transform = `translate3d(0, ${(1 - c) * 24}px, 0)`
                    cap.style.visibility = c <= 0.01 ? 'hidden' : 'visible'
                }
            })
            if (hero) {
                const h = clamp(s / 0.42)
                hero.style.opacity = String(1 - h)
                hero.style.transform = `translate3d(0, ${-h * 60}px, 0)`
                hero.style.visibility = h >= 1 ? 'hidden' : 'visible'
            }
            if (cue) cue.style.opacity = String(1 - clamp(s / 0.2))
            if (bar) bar.style.transform = `scaleX(${p})`
            if (count) count.textContent = String(Math.min(N - 1, Math.max(1, Math.round(s)))).padStart(2, '0')
        }
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
        const onResize = () => { layout(); onScroll() }
        layout(); update()
        addEventListener('scroll', onScroll, { passive: true })
        addEventListener('resize', onResize)
        return () => { cancelAnimationFrame(frame); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize) }
    }, [language])

    return (
        <section className="ss" ref={root} data-tone="light" data-scene="photo" style={{ height: `${FRAMES.length * 100 + 40}svh` }}>
            <div className="ss-sticky">
                <div className="ss-stage">
                    {FRAMES.map((f, i) => (
                        <div className="ss-frame" key={f.key} style={{ zIndex: i + 1 }}>
                            <img className="ss-blur" src={`/cars/sorento/${f.key}-1100.webp`} alt="" aria-hidden="true" decoding="async" loading={i < 2 ? 'eager' : 'lazy'} />
                            <div className="ss-fit">
                                <img src={`/cars/sorento/${f.key}-2000.webp`} srcSet={`/cars/sorento/${f.key}-1100.webp 1100w, /cars/sorento/${f.key}-2000.webp 2000w`}
                                    sizes="100vw" alt={i === 0 ? 'Kia Sorento X-Pro' : ''} decoding="async" loading={i < 2 ? 'eager' : 'lazy'} />
                                {f.pins.map(pin => (
                                    <span className="ss-pin" key={pin.ar} style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }} aria-hidden="true">
                                        <i className="ss-dot" /><i className="ss-line" />
                                        <span className="ss-card"><strong>{language === 'ar' ? pin.ar : pin.fr}</strong><small>{language === 'ar' ? pin.arS : pin.frS}</small></span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="ss-shade" aria-hidden="true" />
                </div>

                <div className="ss-ui">
                    <div className="ss-hero">
                        <div className="ss-meta eyebrow"><span><span className="live-dot" /> {tx.meta}</span><span className="latin">{tx.car}</span></div>
                        <SplitText as="h1" className="ss-title" text={tx.title} delay={700} />
                        <p className="ss-lead">{tx.lead}</p>
                        <div className="ss-actions">
                            <a href="#order" className="btn btn-primary btn-lg">{tx.order}</a>
                            <Link to="/stock" className="btn-link">{tx.stock} <Arrow size={18} strokeWidth={1.5} /></Link>
                        </div>
                    </div>

                    {FRAMES.map((f, i) => i > 0 && (
                        <div className="ss-cap" key={f.key} style={{ opacity: 0, visibility: 'hidden' }}>
                            <span className="ss-num latin">{String(i).padStart(2, '0')}</span>
                            <div>
                                <h2>{(language === 'ar' ? f.ar : f.fr)?.[0]}</h2>
                                <p>{(language === 'ar' ? f.ar : f.fr)?.[1]}</p>
                                <ul className="ss-cap-pins">{f.pins.map(pin => <li key={pin.ar}><i />{language === 'ar' ? pin.ar : pin.fr}</li>)}</ul>
                            </div>
                        </div>
                    ))}

                    <div className="ss-foot">
                        <span className="ss-cue scroll-cue"><i /> {tx.scroll}</span>
                        <span className="ss-progress">
                            <span className="ss-count latin"><b>01</b> / {String(FRAMES.length - 1).padStart(2, '0')}</span>
                            <span className="ss-bar"><i /></span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
