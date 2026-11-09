import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SplitText } from './motion/Shell'

// Home hero: a Kia Sorento X-Pro drives in, then the camera orbits the car as you scroll.
// The orbit is a pre-rendered 150-frame sequence (made from one photo shoot: masks + depth → 2.5D camera
// moves, with motion-blurred hand-overs between angles), drawn on a canvas. Scroll sets a target; the
// playhead eases towards it every frame (inertia), and neighbouring frames are blended, so it never steps.
// Labels ride on the car using positions tracked during the render (orbit.json).

type Lang = 'ar' | 'fr'
type Track = { s: string | null; p: [string, number, number, number][] }

const SHOTS = ['front', 'rear34', 'rear', 'side'] as const
const PIN_TEXT: Record<string, { ar: [string, string]; fr: [string, string] }> = {
    inspect: { ar: ['مفحوصة قبل الشراء', 'المحرك، الهيكل والأعطال'], fr: ['Inspectée avant achat', 'Moteur, châssis, défauts'] },
    tyres: { ar: ['العجلات والفرامل', 'مصوّرة في التقرير'], fr: ['Pneus et freins', 'Photographiés dans le rapport'] },
    paint: { ar: ['الصبغة مقاسة بالجهاز', 'زيرو صبغة ولا لا، مكتوب'], fr: ['Peinture mesurée', 'Zéro peinture ou pas, écrit'] },
    history: { ar: ['تاريخ السيارة', 'الحوادث والصيانة من كوريا'], fr: ['Historique', 'Accidents et entretien en Corée'] },
    papers: { ar: ['ملف كامل', 'فاتورة، عقد وشهادة الشحن'], fr: ['Dossier complet', 'Facture, contrat, connaissement'] },
    route: { ar: ['كوريا ← الجزائر', 'شحن مؤمّن وجمركة'], fr: ['Corée → Algérie', 'Transport assuré, dédouanement'] },
}
const CAPS: Record<(typeof SHOTS)[number], { ar: [string, string]; fr: [string, string]; pins: string[] }> = {
    front: { ar: ['نشوفوها قبل ما تشريها', 'فحص كامل، صور وتقرير على كل سيارة قبل أي دفع.'], fr: ['Vue avant d’être achetée', 'Inspection complète, photos et rapport avant tout paiement.'], pins: ['inspect', 'tyres'] },
    rear34: { ar: ['الصبغة والكيلومترات، بالأرقام', 'نقيسو الصبغة بالجهاز ونتأكدو من العداد والتاريخ.'], fr: ['Peinture et kilométrage, en chiffres', 'Peinture mesurée à la jauge, compteur et historique vérifiés.'], pins: ['paint', 'history'] },
    rear: { ar: ['الأوراق علينا', 'الشراء، الشحن والجمركة: ملف كامل ومكتوب باسمك.'], fr: ['Les papiers, c’est nous', 'Achat, transport et douane : un dossier complet à votre nom.'], pins: ['papers'] },
    side: { ar: ['حتى توصل لعندك', 'نتبعو الشحنة معاك خطوة بخطوة، حتى المفاتيح في يدك.'], fr: ['Jusqu’à chez vous', 'Le suivi étape par étape, jusqu’aux clés dans votre main.'], pins: ['route'] },
}

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

const INTRO = 1.1        // screens of scrolling for the drive-in, before the orbit starts
const ORBIT = 4.6        // screens of scrolling for the full orbit
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function SorentoStory({ language, isRTL }: { language: Lang; isRTL: boolean }) {
    const tx = copy[language]
    const Arrow = isRTL ? ArrowLeft : ArrowRight
    const root = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = root.current
        if (!el) return
        const stage = el.querySelector<HTMLElement>('.ss-stage')!
        const canvas = el.querySelector<HTMLCanvasElement>('.ss-canvas')!
        const ctx = canvas.getContext('2d', { alpha: false })!
        const drive = el.querySelector<HTMLElement>('.ss-drive')!
        const hero = el.querySelector<HTMLElement>('.ss-hero')!
        const cue = el.querySelector<HTMLElement>('.ss-cue')
        const bar = el.querySelector<HTMLElement>('.ss-bar i')
        const count = el.querySelector<HTMLElement>('.ss-count b')
        const caps = new Map(Array.from(el.querySelectorAll<HTMLElement>('.ss-cap')).map(c => [c.dataset.shot!, c]))
        const pins = new Map(Array.from(el.querySelectorAll<HTMLElement>('.ss-pin')).map(p => [p.dataset.pin!, p]))
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

        let track: Track[] = []
        let N = 150
        const frames: (HTMLImageElement | null)[] = []
        let dead = false
        const small = () => Math.min(innerWidth, innerHeight) < 700 || innerWidth / innerHeight < 1.05
        const dir = small() ? 'm' : 'd'

        // frames load in waves (every 10th, then every 5th, then the rest) so the orbit works at once
        const load = async () => {
            try { const r = await fetch('/cars/sorento/orbit/orbit.json'); const j = await r.json(); track = j.track; N = j.frames } catch { /* frames still work without labels */ }
            const order: number[] = []
            for (const step of [10, 5, 2, 1]) for (let i = 0; i < N; i += step) if (!order.includes(i)) order.push(i)
            let next = 0
            const worker = async () => {
                while (!dead && next < order.length) {
                    const i = order[next++]
                    const img = new Image()
                    img.src = `/cars/sorento/orbit/${dir}/${String(i).padStart(3, '0')}.webp`
                    try { await img.decode(); frames[i] = img; need = true } catch { /* skip */ }
                }
            }
            await Promise.all([worker(), worker(), worker(), worker()])
        }
        const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); load() } }, { rootMargin: '200% 0px' })
        io.observe(el)

        const nearest = (i: number, way: number) => {
            for (let k = 0; k < N; k++) {
                const j = i + k * way
                if (j < 0 || j >= N) break
                if (frames[j]) return j
            }
            return -1
        }

        // canvas sizing: cover on wide screens, contain (full width) on tall ones
        let cw = 0, ch = 0, fit = { x: 0, y: 0, w: 0, h: 0 }
        const layout = () => {
            const dpr = Math.min(2, devicePixelRatio || 1)
            cw = stage.clientWidth; ch = stage.clientHeight
            canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr)
            canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.imageSmoothingQuality = 'high'
            const r = 1.6
            const tall = cw / ch < 1.05
            el.dataset.fit = tall ? 'contain' : 'cover'
            const s = tall ? Math.min(cw / r, ch) : Math.max(cw / r, ch)
            const w = s * r, h = s
            fit = { x: (cw - w) / 2, y: tall ? (ch - h) * 0.5 : (ch - h) * 0.55, w, h }
            need = true
        }

        let target = 0, cur = 0, last = performance.now(), need = true, raf = 0

        const readScroll = () => {
            const r = el.getBoundingClientRect()
            const px = -r.top / innerHeight        // screens scrolled into the section
            target = px
        }

        const draw = (pos: number) => {
            // intro: the car drives towards you; then the orbit takes over
            const a = clamp(pos / INTRO)
            const o = clamp((pos - INTRO * 0.72) / (INTRO * 0.28))       // cross into the orbit
            const p = clamp((pos - INTRO) / ORBIT)                       // orbit progress
            const wide = el.dataset.fit === 'cover'

            const da = ease(clamp(a / 0.8))
            const sc = wide ? 1.36 + 0.1 * da : 1 + 0.16 * da
            const sh = wide ? (isRTL ? -15 : 18) * (1 - da) : 0
            drive.style.transform = reduce ? 'none' : `translate3d(${sh}%, ${-2 * da}%, 0) scale(${sc + o * 0.25})`
            drive.style.opacity = String(1 - o)
            drive.style.filter = o > 0.01 ? `blur(${o * 14}px)` : 'none'
            drive.style.visibility = o >= 1 ? 'hidden' : 'visible'
            canvas.style.opacity = String(o)

            const h = clamp(pos / (INTRO * 0.55))
            hero.style.opacity = String(1 - h)
            hero.style.transform = `translate3d(0, ${-h * 60}px, 0)`
            hero.style.visibility = h >= 1 ? 'hidden' : 'visible'
            if (cue) cue.style.opacity = String(1 - clamp(pos / 0.3))

            // orbit frame (blend the two nearest frames for sub-frame smoothness)
            const f = p * (N - 1)
            const i0 = Math.floor(f), fr = f - i0
            const A = nearest(i0, -1), B = nearest(Math.min(N - 1, i0 + 1), 1)
            if (o > 0 && (A >= 0 || B >= 0)) {
                ctx.fillStyle = '#eef1ee'; ctx.fillRect(0, 0, cw, ch)
                const ia = A >= 0 ? frames[A]! : frames[B]!
                ctx.globalAlpha = 1; ctx.drawImage(ia, fit.x, fit.y, fit.w, fit.h)
                if (B >= 0 && A >= 0 && B !== A) {
                    const t = clamp((f - A) / (B - A))
                    if (t > 0.01) { ctx.globalAlpha = t; ctx.drawImage(frames[B]!, fit.x, fit.y, fit.w, fit.h); ctx.globalAlpha = 1 }
                }
            }

            // labels from the tracked positions (interpolated between frames)
            const ta = track[Math.max(0, Math.min(N - 1, i0))], tb = track[Math.max(0, Math.min(N - 1, i0 + 1))]
            const seen = new Set<string>()
            if (ta && o > 0.6) {
                for (const [id, x, y, v] of ta.p) {
                    const nb = tb?.p.find(q => q[0] === id)
                    const X = nb ? x + (nb[1] - x) * fr : x, Y = nb ? y + (nb[2] - y) * fr : y
                    const V = (nb ? v + (nb[3] - v) * fr : v * (1 - fr)) * clamp((o - 0.6) / 0.4)
                    const pin = pins.get(id)
                    if (!pin) continue
                    seen.add(id)
                    pin.style.transform = `translate3d(${fit.x + X * fit.w}px, ${fit.y + Y * fit.h}px, 0)`
                    pin.style.opacity = String(V)
                    pin.style.setProperty('--v', String(clamp(V * 1.3)))
                }
            }
            pins.forEach((pin, id) => { if (!seen.has(id)) { pin.style.opacity = '0'; pin.style.setProperty('--v', '0') } })

            // caption of the angle we're on
            const shot = (ta?.s ?? tb?.s) || null
            const shotVis = shot ? Math.max(...(ta?.p.map(q => q[3]) ?? [0]), 0) : 0
            caps.forEach((c, k) => {
                const v = k === shot && o > 0.6 ? clamp(shotVis * 1.4) : 0
                c.style.opacity = String(v)
                c.style.transform = `translate3d(0, ${(1 - v) * 22}px, 0)`
                c.style.visibility = v <= 0.01 ? 'hidden' : 'visible'
            })
            if (bar) bar.style.transform = `scaleX(${clamp(pos / (INTRO + ORBIT))})`
            if (count) count.textContent = String(Math.max(1, SHOTS.indexOf((shot ?? 'front') as (typeof SHOTS)[number]) + 1)).padStart(2, '0')
        }

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick)
            const dt = Math.min(0.05, (now - last) / 1000); last = now
            const k = reduce ? 1 : 1 - Math.exp(-dt * 7.5)       // inertia: eases towards the scroll position
            const before = cur
            cur += (target - cur) * k
            if (Math.abs(target - cur) < 0.0004) cur = target
            if (cur !== before || need) { need = false; draw(cur) }
        }

        const onScroll = () => readScroll()
        const onResize = () => { layout(); readScroll() }
        layout(); readScroll(); cur = target; draw(cur)
        raf = requestAnimationFrame(tick)
        addEventListener('scroll', onScroll, { passive: true })
        addEventListener('resize', onResize)
        return () => { dead = true; io.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize) }
    }, [language, isRTL])

    return (
        <section className="ss" ref={root} data-tone="light" data-scene="photo" style={{ height: `${(INTRO + ORBIT + 1) * 100}svh` }}>
            <div className="ss-sticky">
                <div className="ss-stage">
                    <div className="ss-drive">
                        <img src="/cars/sorento/drive-2000.webp" srcSet="/cars/sorento/drive-1100.webp 1100w, /cars/sorento/drive-2000.webp 2000w" sizes="100vw"
                            alt="Kia Sorento X-Pro" decoding="async" />
                    </div>
                    <canvas className="ss-canvas" aria-hidden="true" />
                    <div className="ss-pins" aria-hidden="true">
                        {Object.entries(PIN_TEXT).map(([id, t]) => (
                            <span className="ss-pin" key={id} data-pin={id}>
                                <i className="ss-dot" /><i className="ss-line" />
                                <span className="ss-card"><strong>{t[language][0]}</strong><small>{t[language][1]}</small></span>
                            </span>
                        ))}
                    </div>
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

                    {SHOTS.map((k, i) => (
                        <div className="ss-cap" key={k} data-shot={k} style={{ opacity: 0, visibility: 'hidden' }}>
                            <span className="ss-num latin">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                                <h2>{CAPS[k][language][0]}</h2>
                                <p>{CAPS[k][language][1]}</p>
                                <ul className="ss-cap-pins">{CAPS[k].pins.map(id => <li key={id}><i />{PIN_TEXT[id][language][0]}</li>)}</ul>
                            </div>
                        </div>
                    ))}

                    <div className="ss-foot">
                        <span className="ss-cue scroll-cue"><i /> {tx.scroll}</span>
                        <span className="ss-progress">
                            <span className="ss-count latin"><b>01</b> / {String(SHOTS.length).padStart(2, '0')}</span>
                            <span className="ss-bar"><i /></span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
