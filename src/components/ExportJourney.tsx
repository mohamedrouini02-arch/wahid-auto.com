import { useEffect, useRef } from 'react'
import { STAGE_SVG } from './exportJourneyMarkup'

// From your order to the keys in your hand: one pinned section, the real Kia Sorento photos turn and travel
// through 8 steps (order → inspection → export papers → truck to the port → RoRo → crossing → customs →
// showroom). Ported from the "Wahid Export 360" kit: a 1600×900 virtual stage scaled to the screen, one
// progress number (0 → 1) drives every layer. The car photos have a white studio background and are blended
// with multiply, so this stage stays light.

type Lang = 'ar' | 'fr'

const STEPS: { from: number; to: number; ar: [string, string]; fr: [string, string] }[] = [
    { from: 0.00, to: 0.12, ar: ['الطلب', 'تتواصلون معنا عبر الواتساب أو في المعرض، ونحدد معكم السيارة والميزانية.'], fr: ['La commande', 'Vous nous contactez sur WhatsApp ou au showroom ; on définit la voiture et le budget.'] },
    { from: 0.12, to: 0.36, ar: ['الفحص الشامل', 'نفحص السيارة في كوريا: الطلاء، الخدوش، القطع المبدلة، العجلات والمحرك، مع صور وفيديو.'], fr: ['Inspection complète', 'Contrôle en Corée : peinture, rayures, pièces remplacées, pneus et moteur, photos et vidéo à l’appui.'] },
    { from: 0.36, to: 0.44, ar: ['وثائق التصدير', 'نجهز كل الأوراق: شطب التسجيل وشهادة التصدير.'], fr: ['Documents d’export', 'Nous préparons tout : radiation et certificat d’export.'] },
    { from: 0.44, to: 0.57, ar: ['النقل إلى الميناء', 'تُحمَّل السيارة على شاحنة نقل السيارات نحو الميناء الكوري.'], fr: ['Transport au port', 'La voiture part en camion porte-voitures vers le port coréen.'] },
    { from: 0.57, to: 0.65, ar: ['التحميل على باخرة RoRo', 'تصعد السيارة بنفسها إلى باخرة الشحن المخصصة للسيارات.'], fr: ['Chargement RoRo', 'La voiture monte à bord du navire roulier dédié aux véhicules.'] },
    { from: 0.65, to: 0.79, ar: ['من كوريا إلى الجزائر', 'الرحلة البحرية نحو الجزائر، ونبقيكم على اطلاع بكل مرحلة.'], fr: ['De la Corée à l’Algérie', 'La traversée vers l’Algérie, avec un suivi à chaque étape.'] },
    { from: 0.79, to: 0.90, ar: ['الجمارك', 'تنزل السيارة من الباخرة ونتكفل بإجراءات الجمركة.'], fr: ['Dédouanement', 'Débarquement et formalités douanières prises en charge.'] },
    { from: 0.90, to: 1.00, ar: ['في معرضنا', 'سيارتكم جاهزة في معرض وحيد أوتو. مبروك!'], fr: ['Dans notre showroom', 'Votre voiture vous attend chez Wahid Auto. Félicitations !'] },
]
const UI = {
    ar: { eyebrow: 'من طلبك حتى المفاتيح في يدك', chat1: 'السلام، نحب Kia Sorento 2025', chat2: 'تم ✓ نبدأو البحث', cleared: 'تم التخليص ✓', delivered: 'تم التسليم 🔑', checks: ['الطلاء', 'الخدوش', 'الهيكل', 'العجلات', 'المحرك', 'الداخلية'] },
    fr: { eyebrow: 'De votre commande aux clés dans votre main', chat1: 'Salam, je veux un Kia Sorento 2025', chat2: 'C’est noté ✓ on lance la recherche', cleared: 'DÉDOUANÉ ✓', delivered: 'Livrée 🔑', checks: ['Peinture', 'Rayures', 'Carrosserie', 'Pneus', 'Moteur', 'Intérieur'] },
}
const FRAMES = ['00', '01', '02', '03', '04', '05', '06', '07'].map(n => `/journey/car/${n}.webp`)
const SCROLL_SCREENS = 10
const GREEN = '#3f9c7f'
const NS = 'http://www.w3.org/2000/svg'

export default function ExportJourney({ language }: { language: Lang }) {
    const root = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = root.current
        if (!el) return
        const ui = UI[language]
        const $ = (id: string) => el.querySelector<SVGElement & HTMLElement>(`#xj-${id}`)!
        const pin = el.querySelector<HTMLElement>('.xj-pin')!
        const stage = el.querySelector<HTMLElement>('.xj-stage')!
        const carEl = $('car')
        const capStep = el.querySelector<HTMLElement>('.xj-cap-step')!
        const capTitle = el.querySelector<HTMLElement>('.xj-cap h2')!
        const capText = el.querySelector<HTMLElement>('.xj-cap-text')!
        const cap = el.querySelector<HTMLElement>('.xj-cap')!
        const rail = el.querySelector<HTMLElement>('.xj-rail')!
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

        // reset generated parts (effect re-runs on language change)
        carEl.innerHTML = ''; rail.innerHTML = ''
        for (const id of ['roadDash', 'poles', 'waves', 'hotspots', 'checklist']) $(id).innerHTML = ''

        const imgs = FRAMES.map((src, i) => {
            const im = new Image(); im.src = src; im.alt = i ? '' : 'Kia Sorento'; im.decoding = 'async'
            carEl.appendChild(im); return im
        })
        const attrs = (n: Element, a: Record<string, string | number>) => Object.entries(a).forEach(([k, v]) => n.setAttribute(k, String(v)))
        for (let i = 0; i < 14; i++) {
            const d = document.createElementNS(NS, 'rect'); attrs(d, { x: i * 160, y: 731, width: 80, height: 8, rx: 4, fill: '#f3f4f2' }); $('roadDash').appendChild(d)
            const p = document.createElementNS(NS, 'rect'); attrs(p, { x: i * 320, y: 560, width: 8, height: 130, fill: '#c3cbc7' }); $('poles').appendChild(p)
        }
        const waves: SVGPathElement[] = []
        for (let r = 0; r < 4; r++) {
            const w = document.createElementNS(NS, 'path')
            let d = `M-200 ${700 + r * 50}`
            for (let x = -200; x < 1900; x += 100) d += ' q 25 -12 50 0 t 50 0'
            w.setAttribute('d', d); w.dataset.speed = String(1 + r * 0.6)
            $('waves').appendChild(w); waves.push(w)
        }
        const INSPECT = { cx: 700, gy: 640, s: 0.86 }
        const HOT = [[560, 420], [980, 400], [700, 560], [1060, 580], [820, 330], [430, 540]]
            .map(([x, y]) => [INSPECT.cx + (x - 800) * INSPECT.s, INSPECT.gy - (640 - y) * INSPECT.s])
        const hotEls = HOT.map(([x, y]) => {
            const g = document.createElementNS(NS, 'g')
            g.setAttribute('transform', `translate(${x} ${y})`)
            g.innerHTML = `<circle r="22" fill="${GREEN}" fill-opacity=".18"/><circle r="9" fill="${GREEN}"/><path d="M-4 0 l3 3 l6 -6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
            g.style.opacity = '0'; $('hotspots').appendChild(g); return g
        })
        const checkRows = ui.checks.map((label, i) => {
            const g = document.createElementNS(NS, 'g')
            g.setAttribute('transform', `translate(0 ${i * 58})`)
            g.innerHTML = `<rect width="270" height="48" rx="14" fill="#ffffff" stroke="#dfe3e0" stroke-width="2"/>
              <circle cx="28" cy="24" r="12" fill="#e6e9e7" class="dot"/>
              <path d="M22 24 l4 4 l8 -8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" class="tick" opacity="0"/>
              <text class="t t-i18n" x="${language === 'ar' ? 252 : 54}" y="31" text-anchor="start" direction="${language === 'ar' ? 'rtl' : 'ltr'}" font-size="19" font-weight="600" fill="#0d1411"></text>`
            g.querySelector('text')!.textContent = label
            $('checklist').appendChild(g); return g
        })
        const railBars = STEPS.map(() => { const s = document.createElement('span'); s.innerHTML = '<i></i>'; rail.appendChild(s); return s.firstChild as HTMLElement })
        el.querySelectorAll<SVGTextElement>('[data-i18n-svg]').forEach(t => { t.textContent = (ui as Record<string, unknown>)[t.dataset.i18nSvg!] as string })

        const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
        const ease = (t: number) => t * t * (3 - 2 * t)
        const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)))
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t
        const fadeWin = (p: number, a: number, b: number, f = 0.02) => Math.min(seg(p, a - f, a + f), 1 - seg(p, b - f, b + f))
        const sharpen = (t: number) => { const x = Math.pow(t, 7), y = Math.pow(1 - t, 7); return x / (x + y) }
        const op = (id: string, v: number) => { $(id).style.opacity = String(v) }

        const placeCar = (cx: number, gy: number, s: number, angle: number, alpha = 1) => {
            carEl.style.transform = `translate(${cx - 600 * s}px, ${gy - 480 * s}px) scale(${s})`
            carEl.style.opacity = String(alpha)
            const pos = (((angle % 360) + 360) % 360) / 45
            const i = Math.floor(pos) % 8, j = (i + 1) % 8, t = sharpen(pos - Math.floor(pos))
            imgs.forEach((im, k) => { im.style.opacity = String(k === i ? 1 - t : k === j ? t : 0) })
        }

        // the route map sits on the side away from the caption
        const route = $('mapRoute') as unknown as SVGPathElement
        const L = route.getTotalLength()
        let shownStep = -1, swapTimer = 0

        const render = (p: number) => {
            op('gStudio', Math.max(1 - seg(p, 0.11, 0.14), seg(p, 0.89, 0.92)))
            op('gScanBay', fadeWin(p, 0.13, 0.36))
            op('gRoad', fadeWin(p, 0.45, 0.575))
            op('gSea', fadeWin(p, 0.575, 0.80))
            op('ship', fadeWin(p, 0.575, 0.80))
            op('gCustoms', fadeWin(p, 0.805, 0.895))
            op('barrier', fadeWin(p, 0.805, 0.895))
            op('gShow', seg(p, 0.89, 0.92))

            let cx = 800, gy = 640, s = 1, ang = 0, a = 1
            if (p < 0.12) {
                ang = lerp(0, 45, seg(p, 0, 0.12))
                const k = seg(p, 0.02, 0.06); gy = lerp(640, 700, k); s = lerp(1, 0.8, k)
            } else if (p < 0.36) {
                ang = lerp(45, 450, seg(p, 0.13, 0.35))
                const k = seg(p, 0.12, 0.15); cx = lerp(800, INSPECT.cx, k); gy = lerp(700, INSPECT.gy, k); s = lerp(0.8, INSPECT.s, k)
            } else if (p < 0.445) {
                ang = 90; const k = seg(p, 0.36, 0.40); cx = lerp(INSPECT.cx, 640, k); s = lerp(INSPECT.s, 0.9, k)
            } else if (p < 0.575) {
                ang = 90
                const land = seg(p, 0.445, 0.49)
                const truckX = lerp(1900, 760, seg(p, 0.445, 0.48))
                cx = lerp(640, truckX + 70, land); gy = lerp(640, 690 - 18 - 4 + 2, land) - 2; s = lerp(0.9, 0.36, land)
                const drive = seg(p, 0.49, 0.565), shift = drive * 1600
                $('roadDash').setAttribute('transform', `translate(${(shift * 1.0) % 160} 0)`)
                $('poles').setAttribute('transform', `translate(${(shift * 0.8) % 320 - 320} 0)`)
                $('hills').setAttribute('transform', `translate(${shift * 0.2} 0)`)
                $('cranes').setAttribute('transform', `translate(${lerp(-700, 0, seg(p, 0.52, 0.565))} 0)`)
                const bump = drive > 0 && drive < 1 ? Math.sin(drive * 60) * 1.2 : 0
                $('truck').setAttribute('transform', `translate(${truckX} ${690 + bump})`)
                gy += bump
            } else if (p < 0.80) {
                s = 0.32
                const into = seg(p, 0.585, 0.645)
                if (p < 0.66) {
                    ang = 90; const x = lerp(1470, 980, into); cx = x
                    gy = x > 1336 ? 664 : x > 1188 ? lerp(664, 606, (1336 - x) / 148) : 606
                } else if (p < 0.775) {
                    a = 0; ang = 270; cx = 980; gy = 606
                } else {
                    ang = 270; const out = seg(p, 0.775, 0.80); const x = lerp(1000, 1500, out); cx = x
                    gy = x < 1188 ? 606 : x < 1336 ? lerp(606, 664, (x - 1188) / 148) : 664
                }
                const sail = seg(p, 0.66, 0.775)
                waves.forEach(w => w.setAttribute('transform', `translate(${(sail * 1200 * Number(w.dataset.speed)) % 100} 0)`))
                const bob = sail > 0 && sail < 1 ? Math.sin(p * 900) * 3 : 0
                $('ship').setAttribute('transform', `translate(0 ${bob})`)
                $('shipBack').setAttribute('transform', `translate(0 ${bob})`)
                op('quay', 1 - fadeWin(p, 0.665, 0.77, 0.01))
                op('ramp', 1 - fadeWin(p, 0.665, 0.77, 0.01))
            } else if (p < 0.895) {
                ang = 270; s = lerp(0.32, 0.45, seg(p, 0.80, 0.83))
                const approach = seg(p, 0.80, 0.835), through = seg(p, 0.86, 0.895)
                cx = lerp(200, 560, approach) + through * 700; gy = 735
                $('arm').setAttribute('transform', `rotate(${-seg(p, 0.835, 0.855) * 80})`)
            } else {
                const settle = seg(p, 0.90, 0.97)
                ang = lerp(270, 405, settle); s = lerp(0.45, 1, settle); cx = lerp(1260, 800, settle); gy = lerp(735, 650, settle)
            }
            placeCar(cx, gy, s, ang, a)
            op('truck', fadeWin(p, 0.445, 0.575))

            op('chat1', fadeWin(p, 0.035, 0.12))
            op('chat2', fadeWin(p, 0.07, 0.12))
            const scan = seg(p, 0.13, 0.35)
            op('gScan', fadeWin(p, 0.13, 0.355))
            op('checklist', fadeWin(p, 0.15, 0.355))
            const sweep = (scan * 3) % 1, pass = Math.floor(scan * 3) % 2
            $('beamG').setAttribute('transform', `translate(${lerp(310, 1090, pass ? 1 - sweep : sweep)} 0)`)
            hotEls.forEach((g, i) => { g.style.opacity = String(seg(scan, 0.12 + i * 0.13, 0.17 + i * 0.13) * fadeWin(p, 0.13, 0.355)) })
            checkRows.forEach((g, i) => {
                const on = scan > 0.15 + i * 0.13
                g.querySelector('.dot')!.setAttribute('fill', on ? GREEN : '#e6e9e7')
                g.querySelector('.tick')!.setAttribute('opacity', on ? '1' : '0')
            })
            op('doc', fadeWin(p, 0.365, 0.44))
            const st = seg(p, 0.39, 0.405)
            $('stamp').style.opacity = String(st)
            $('stamp').setAttribute('transform', `translate(220 330) scale(${lerp(1.8, 1, st)})`)
            op('map', fadeWin(p, 0.655, 0.785))
            const voyage = seg(p, 0.665, 0.77)
            const mp = route.getPointAtLength(voyage * L)
            $('mapShip').setAttribute('transform', `translate(${mp.x} ${mp.y})`)
            $('mapDone').style.strokeDasharray = String(L)
            $('mapDone').style.strokeDashoffset = String(L * (1 - voyage))
            const cs = seg(p, 0.855, 0.865)
            $('stamp2').style.opacity = String(cs * fadeWin(p, 0.805, 0.895))
            $('stamp2').setAttribute('transform', `translate(1250 440) scale(${lerp(1.8, 1, cs)})`)
            op('keys', seg(p, 0.96, 0.985))

            const idx = STEPS.findIndex(s2 => p >= s2.from && p < s2.to)
            const step = idx === -1 ? STEPS.length - 1 : idx
            if (step !== shownStep) {
                shownStep = step
                cap.classList.add('swap')
                clearTimeout(swapTimer)
                swapTimer = window.setTimeout(() => {
                    capStep.textContent = `${String(step + 1).padStart(2, '0')} / ${String(STEPS.length).padStart(2, '0')}`
                    capTitle.textContent = STEPS[step][language][0]
                    capText.textContent = STEPS[step][language][1]
                    cap.classList.remove('swap')
                }, reduce ? 0 : 220)
            }
            railBars.forEach((b, i) => { b.style.transform = `scaleX(${seg(p, STEPS[i].from, STEPS[i].to)})` })
        }

        const fit = () => {
            const w = pin.clientWidth, h = pin.clientHeight
            const sc = Math.min(h / 900, w / 1000)            // keeps the middle 1000px visible on phones
            stage.style.transform = `translate(${-800 * sc}px, ${-450 * sc + (w < 700 ? h * 0.1 : 0)}px) scale(${sc})`
            // route map: on the side away from the caption; centred on phones, where only the middle is visible
            $('map').setAttribute('transform', w < 700 ? 'translate(500 150)' : language === 'ar' ? 'translate(190 150)' : 'translate(820 150)')
        }

        // scroll → target; the playhead eases towards it; the loop only runs while the section is on screen
        let target = 0, current = 0, raf = 0, visible = false
        const read = () => {
            const r = el.getBoundingClientRect()
            target = clamp(-r.top / Math.max(1, el.offsetHeight - innerHeight))
        }
        const loop = () => {
            raf = 0
            current += (target - current) * (reduce ? 1 : 0.12)
            if (Math.abs(target - current) < 0.00005) current = target
            render(current)
            if (visible && current !== target) raf = requestAnimationFrame(loop)
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
        const onScroll = () => { read(); if (visible) kick() }
        const onResize = () => { fit(); read(); kick() }
        const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); if (visible) { read(); kick() } })
        io.observe(el)
        fit(); read(); current = target; render(current)
        addEventListener('scroll', onScroll, { passive: true })
        addEventListener('resize', onResize)
        return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(swapTimer); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize) }
    }, [language])

    return (
        <section className="xj" ref={root} data-tone="light" data-scene="photo" style={{ height: `${SCROLL_SCREENS * 100}svh` }} aria-label={UI[language].eyebrow}>
            <div className="xj-pin">
                <div className="xj-stage" dangerouslySetInnerHTML={{ __html: STAGE_SVG }} />
                <div className="xj-ui">
                    <div className="xj-cap">
                        <div className="xj-cap-step latin">01 / 08</div>
                        <h2>{STEPS[0][language][0]}</h2>
                        <p className="xj-cap-text">{STEPS[0][language][1]}</p>
                    </div>
                    <div className="xj-rail" />
                </div>
            </div>
        </section>
    )
}
