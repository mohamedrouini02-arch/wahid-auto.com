import { useEffect, useRef } from 'react'

/* The Wahid Auto route, drawn as a small isometric world behind the site:
     KOREA yard + CHINA yard → export port (crane) → the ship crosses the sea →
     port in ALGERIA → customs gate → Wahid Auto showroom in Jijel → the client's road.
   Cars leave the yards, the ship loads, sails, unloads, cars pass customs and drive home.
   The camera follows the section being read (body[data-scene]); colours follow the page tone
   (body[data-tone]). The ship's stage is published on <html data-stage> for the hero's mini flow.
   2D canvas, no dependencies, capped at 30 fps, paused when the tab is hidden, static if reduced motion. */

type RGB = [number, number, number]

const TAU = Math.PI * 2, C30 = Math.cos(Math.PI / 6)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const rgba = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`
const shade = (c: RGB, k: number): RGB => (k <= 1 ? [c[0] * k, c[1] * k, c[2] * k] : mix(c, [255, 255, 255], Math.min(1, k - 1)))

const PAL: Record<'dark' | 'light', Record<string, RGB>> = {
    dark: {
        pad: [20, 40, 33], padLine: [70, 110, 95], neutral: [44, 72, 61], neutral2: [30, 50, 42], accent: [95, 184, 155], ice: [168, 230, 207],
        line: [159, 227, 200], text: [128, 150, 140], textHi: [238, 244, 240], water: [95, 184, 155], hull: [26, 46, 39], deck: [58, 92, 79],
        car1: [226, 234, 229], car2: [112, 138, 127], sand: [196, 170, 122], build: [36, 60, 51],
    },
    light: {
        pad: [214, 226, 218], padLine: [160, 182, 171], neutral: [170, 190, 180], neutral2: [138, 160, 149], accent: [46, 150, 116], ice: [14, 90, 71],
        line: [10, 23, 18], text: [82, 102, 93], textHi: [10, 23, 18], water: [30, 138, 102], hull: [70, 96, 86], deck: [160, 182, 171],
        car1: [252, 253, 252], car2: [150, 170, 160], sand: [196, 160, 100], build: [236, 242, 238],
    },
}

// camera goals per section (world centre, zoom); x of the anchor as a fraction of the screen
const SHOTS: Record<string, { x: number; y: number; z: number; ax: number; ay: number; alpha: number }> = {
    hero: { x: 4, y: 0, z: 0.6, ax: 0.6, ay: 0.5, alpha: 1 },
    korea: { x: -22, y: 0, z: 1.45, ax: 0.62, ay: 0.5, alpha: 0.75 },
    sea: { x: -2, y: 0, z: 1.15, ax: 0.6, ay: 0.52, alpha: 0.7 },
    algeria: { x: 21, y: -1, z: 1.4, ax: 0.62, ay: 0.5, alpha: 0.75 },
    all: { x: 4, y: 0, z: 0.58, ax: 0.5, ay: 0.55, alpha: 0.8 },
    quiet: { x: 4, y: 0, z: 0.8, ax: 0.5, ay: 0.55, alpha: 0.28 },
}

const LABELS = {
    ar: { korea: 'كوريا · 한국', china: 'الصين · 中国', export: 'ميناء التصدير', sea: 'عرض البحر', port: 'ميناء الجزائر', customs: 'الجمارك', home: 'وحيد أوتو · جيجل' },
    fr: { korea: 'CORÉE · 한국', china: 'CHINE · 中国', export: 'PORT D’EXPORT', sea: 'EN MER', port: 'PORT · ALGÉRIE', customs: 'DOUANE', home: 'WAHID AUTO · JIJEL' },
}

// ---- flags, painted once into small canvases then drawn in waving strips ----
function flagCanvas(kind: 'kr' | 'dz' | 'cn') {
    const c = document.createElement('canvas'); c.width = 60; c.height = 40
    const g = c.getContext('2d')!
    if (kind === 'dz') {
        g.fillStyle = '#006233'; g.fillRect(0, 0, 30, 40); g.fillStyle = '#fff'; g.fillRect(30, 0, 30, 40)
        g.fillStyle = '#d21034'; g.beginPath(); g.arc(30, 20, 10, 0, TAU); g.fill()
        g.fillStyle = '#fff'; g.beginPath(); g.arc(33, 20, 8, 0, TAU); g.fill()
        g.fillStyle = '#006233'; g.beginPath(); g.arc(33, 20, 8, Math.PI / 2, Math.PI * 1.5); g.fill()
        g.fillStyle = '#d21034'; g.beginPath()
        for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.2 : 5, a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(35 + Math.cos(a) * r, 20 + Math.sin(a) * r) }
        g.fill()
    } else if (kind === 'kr') {
        g.fillStyle = '#fff'; g.fillRect(0, 0, 60, 40)
        g.fillStyle = '#cd2e3a'; g.beginPath(); g.arc(30, 20, 9, Math.PI, TAU); g.fill()
        g.fillStyle = '#0047a0'; g.beginPath(); g.arc(30, 20, 9, 0, Math.PI); g.fill()
        g.fillStyle = '#cd2e3a'; g.beginPath(); g.arc(25.5, 20, 4.5, 0, TAU); g.fill()
        g.fillStyle = '#0047a0'; g.beginPath(); g.arc(34.5, 20, 4.5, 0, TAU); g.fill()
        g.fillStyle = '#111'
        for (const [x, y, r] of [[11, 8, -0.6], [49, 8, 0.6], [11, 32, 0.6], [49, 32, -0.6]] as [number, number, number][]) {
            g.save(); g.translate(x, y); g.rotate(r); for (let k = -1; k <= 1; k++) g.fillRect(-5, k * 2.6 - 0.8, 10, 1.6); g.restore()
        }
    } else {
        g.fillStyle = '#de2910'; g.fillRect(0, 0, 60, 40); g.fillStyle = '#ffde00'; g.beginPath()
        for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.6 : 6.5, a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(12 + Math.cos(a) * r, 11 + Math.sin(a) * r) }
        g.fill()
    }
    return c
}

export default function RouteScene() {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let W = 0, H = 0, DPR = 1
        const resize = () => {
            DPR = Math.min(window.devicePixelRatio || 1, 1.5); W = window.innerWidth; H = window.innerHeight
            canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR)
        }
        resize(); window.addEventListener('resize', resize)
        const flags = { kr: flagCanvas('kr'), dz: flagCanvas('dz'), cn: flagCanvas('cn') }

        let tone = 0
        const C: Record<string, RGB> = {}
        const palette = () => { for (const k in PAL.dark) C[k] = mix(PAL.dark[k], PAL.light[k], tone) }
        palette()

        const cam = { ...SHOTS.hero }
        let SU = 1
        const P = (x: number, y: number, z = 0): [number, number] => {
            const dx = x - cam.x, dy = y - cam.y
            return [cam.ax * W + (dx - dy) * C30 * SU, cam.ay * H + ((dx + dy) * 0.5 - z * 0.92) * SU]
        }

        // ---------- primitives ----------
        type Op = { d: number; f: () => void }
        let ops: Op[] = []
        const poly = (pts: [number, number][], fill: string | null, stroke?: string, lw = 1) => {
            ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath()
            if (fill) { ctx.fillStyle = fill; ctx.fill() }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke() }
        }
        const quad = (x: number, y: number, w: number, d: number, z: number) => [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)]
        let target: Op[] | null = null
        const box = (x: number, y: number, z: number, w: number, d: number, h: number, c: RGB, a = 1, edge = 0.18) => {
            ;(target || ops).push({
                d: x + w + y + d + z * 0.01, f: () => {
                    const e = rgba(C.line, edge * a)
                    poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], rgba(shade(c, 0.78), a), e)   // +x face
                    poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], rgba(shade(c, 0.6), a), e)   // +y face
                    poly(quad(x, y, w, d, z + h), rgba(shade(c, 1.12), a), e)                                                             // top
                },
            })
        }
        const car = (x: number, y: number, alongX: boolean, c: RGB, a = 1) => {
            const [w, d] = alongX ? [1.7, 0.85] : [0.85, 1.7]
            box(x - w / 2, y - d / 2, 0, w, d, 0.42, c, a, 0.25)
            const [cw, cd] = alongX ? [0.95, 0.72] : [0.72, 0.95]
            const [ox, oy] = alongX ? [-0.1, 0] : [0, -0.1]
            box(x - cw / 2 + ox, y - cd / 2 + oy, 0.42, cw, cd, 0.32, shade(c, 0.9), a, 0.25)
        }
        const flag = (x: number, y: number, kind: 'kr' | 'dz' | 'cn', t: number, a: number) => {
            ops.push({
                d: x + y + 0.5, f: () => {
                    const [bx, by] = P(x, y, 0), [tx, ty] = P(x, y, 4.2)
                    ctx.strokeStyle = rgba(C.text, 0.8 * a); ctx.lineWidth = Math.max(1, SU * 0.06)
                    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke()
                    const fw = SU * 1.9, fh = SU * 1.26, img = flags[kind], strips = 14
                    ctx.globalAlpha = 0.92 * a
                    for (let i = 0; i < strips; i++) {
                        const u = i / strips, wave = Math.sin(u * 5.5 - t * 3.2) * SU * 0.13 * u
                        const shadeK = 0.86 + 0.14 * Math.cos(u * 5.5 - t * 3.2)
                        ctx.filter = `brightness(${shadeK.toFixed(2)})`
                        ctx.drawImage(img, u * img.width, 0, img.width / strips + 0.6, img.height, tx + u * fw, ty + wave, fw / strips + 0.6, fh)
                    }
                    ctx.filter = 'none'; ctx.globalAlpha = 1
                },
            })
        }
        const label = (x: number, y: number, z: number, text: string, a: number, hi = false) => {
            ops.push({
                d: 999, f: () => {
                    const [px, py] = P(x, y, z), up = 34
                    ctx.strokeStyle = rgba(C.line, 0.35 * a); ctx.lineWidth = 1
                    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - up); ctx.stroke()
                    ctx.fillStyle = rgba(hi ? C.accent : C.line, a); ctx.beginPath(); ctx.arc(px, py, 2.6, 0, TAU); ctx.fill()
                    ctx.font = '500 10px "JetBrains Mono", "IBM Plex Sans Arabic", monospace'
                    const arabic = /[\u0600-\u06ff]/.test(text)   // spacing would break Arabic joining
                    try { (ctx as unknown as { letterSpacing: string }).letterSpacing = arabic ? '0px' : '1.5px' } catch { /* old browsers */ }
                    ctx.font = arabic ? '500 12px "IBM Plex Sans Arabic", sans-serif' : '500 10px "JetBrains Mono", monospace'
                    const tw = ctx.measureText(text).width
                    ctx.fillStyle = rgba(hi ? C.textHi : C.text, a); ctx.textBaseline = 'bottom'
                    ctx.fillText(text, px - tw / 2, py - up - 6)
                },
            })
        }
        const pad = (x: number, y: number, w: number, d: number, a: number) => {
            poly(quad(x, y, w, d, 0), rgba(C.pad, 0.75 * a), rgba(C.line, 0.14 * a))
            ctx.setLineDash([3, 5]); ctx.strokeStyle = rgba(C.padLine, 0.35 * a)
            for (let k = 1; k < w; k += 2) { const [p1, p2] = [P(x + k, y + 0.3), P(x + k, y + d - 0.3)]; ctx.beginPath(); ctx.moveTo(...p1); ctx.lineTo(...p2); ctx.stroke() }
            ctx.setLineDash([])
        }

        // ---------- world ----------
        const SHIP_LEN = 7, SHIP_W = 2.6
        const shipState = (t: number) => {
            const T = 26, u = ((t % T) + T) % T / T
            if (u < 0.16) return { x: -11, phase: 'load', loadK: u / 0.16 }
            if (u < 0.52) return { x: lerp(-11, 4, ease((u - 0.16) / 0.36)), phase: 'sea', loadK: 1 }
            if (u < 0.68) return { x: 4, phase: 'port', loadK: 1 - (u - 0.52) / 0.16 }
            return { x: lerp(4, -11, ease((u - 0.68) / 0.32)), phase: 'back', loadK: 0 }
        }
        const route = (pts: [number, number][], u: number) => {
            const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
            let s = u * segs.reduce((a, b) => a + b, 0)
            for (let i = 0; i < segs.length; i++) {
                if (s <= segs[i]) { const k = s / segs[i]; return { x: lerp(pts[i][0], pts[i + 1][0], k), y: lerp(pts[i][1], pts[i + 1][1], k), alongX: pts[i][1] === pts[i + 1][1] } }
                s -= segs[i]
            }
            const l = pts[pts.length - 1]; return { x: l[0], y: l[1], alongX: true }
        }
        const KR: [number, number][] = [[-27, -7], [-21, -7], [-21, -1.1], [-13.5, -1.1]]
        const CN: [number, number][] = [[-27, 7], [-21, 7], [-21, 1.1], [-13.5, 1.1]]
        const DZ: [number, number][] = [[13.5, 0], [36, 0]]
        const carColors = () => [C.car1, C.car2, C.accent, C.sand, C.car1]

        let last = 0, frame = 0, shown = '', t0 = performance.now()
        const draw = (now: number) => {
            frame = requestAnimationFrame(draw)
            if (document.hidden || now - last < 33) return
            last = now
            const t = reduce ? 6 : (now - t0) / 1000

            // follow the page: tone + section shot
            const body = document.body
            const goalTone = body.dataset.tone === 'light' ? 1 : 0
            tone += (goalTone - tone) * 0.08; palette()
            const shot = SHOTS[body.dataset.scene || 'hero'] || SHOTS.quiet
            const mobile = W < 760, k = reduce ? 1 : 0.05
            cam.x = lerp(cam.x, shot.x, k); cam.y = lerp(cam.y, shot.y, k); cam.z = lerp(cam.z, shot.z * (mobile ? 2.1 : 1), k)
            const rtl = document.documentElement.dir === 'rtl'   // text on the right: the world goes left
            let gx = mobile ? 0.5 : rtl ? 1 - shot.ax : shot.ax, gy = mobile ? 0.42 : shot.ay
            const anchor = document.querySelector('[data-active-section] [data-anchor]')
            if (anchor) { const r = anchor.getBoundingClientRect(); if (r.bottom > 0 && r.top < H) { gx = (r.left + r.width / 2) / W; gy = (r.top + r.height / 2) / H } }
            cam.ax = lerp(cam.ax, gx, k * 2); cam.ay = lerp(cam.ay, gy, k * 2)
            cam.alpha = lerp(cam.alpha, shot.alpha * (mobile ? 0.55 : 1), k)
            SU = (24 * cam.z * Math.min(W, H * 1.6)) / 1200
            const A = cam.alpha
            const L = document.documentElement.lang === 'fr' ? LABELS.fr : LABELS.ar

            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            ctx.clearRect(0, 0, W, H)
            ops = []

            // ground: yards, ports, road, sea
            pad(-30, -9.5, 7, 5, A); pad(-30, 4.5, 7, 5, A); pad(-20, -3.5, 8, 7, A); pad(12, -3.5, 8, 7, A)
            poly([P(20, -0.7), P(38, -0.7), P(38, 0.7), P(20, 0.7)], rgba(C.pad, 0.6 * A), rgba(C.line, 0.1 * A))
            poly([P(-22.4, -7.6), P(-20.6, -7.6), P(-20.6, 7.6), P(-22.4, 7.6)], rgba(C.pad, 0.45 * A))
            // sea: tiles + moving wave lines
            poly(quad(-11.5, -6.5, 23, 13, -0.05), rgba(C.water, (0.09 + 0.05 * tone) * A), rgba(C.water, 0.25 * A))
            ctx.strokeStyle = rgba(C.water, 0.32 * A); ctx.lineWidth = 1
            for (let gx = -10; gx <= 10; gx += 1.6) {
                ctx.beginPath()
                for (let gy = -6; gy <= 6; gy += 0.5) {
                    const [sx, sy] = P(gx + Math.sin(gy * 0.9 + t * 1.2 + gx) * 0.18, gy, Math.sin(gx * 0.7 + gy + t * 1.6) * 0.06)
                    gy === -6 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
                }
                ctx.stroke()
            }
            // dashed sea lane
            ctx.setLineDash([6, 8]); ctx.lineDashOffset = -t * 12; ctx.strokeStyle = rgba(C.accent, 0.55 * A)
            ctx.beginPath(); ctx.moveTo(...P(-11, 0, 0.02)); ctx.lineTo(...P(11, 0, 0.02)); ctx.stroke(); ctx.setLineDash([])

            // parked cars in the yards
            const cols = carColors()
            for (let i = 0; i < 6; i++) {
                car(-29 + (i % 3) * 2.2, -8.6 + Math.floor(i / 3) * 2, false, cols[i % 5], A)
                car(-29 + (i % 3) * 2.2, 5.6 + Math.floor(i / 3) * 2, false, cols[(i + 2) % 5], A)
            }
            // cars driving to the export port
            for (let i = 0; i < 3; i++) {
                const u = ((t / 9 + i / 3) % 1)
                const a = A * clamp(u * 8) * clamp((1 - u) * 8)
                const pk = route(KR, u), pc = route(CN, (u + 0.17) % 1)
                car(pk.x, pk.y, pk.alongX, cols[i], a)
                car(pc.x, pc.y, pc.alongX, cols[i + 1], A * clamp(((u + 0.17) % 1) * 8) * clamp((1 - (u + 0.17) % 1) * 8))
            }
            // cranes
            const crane = (x: number, y: number, swing: number) => {
                box(x, y, 0, 0.6, 0.6, 5.2, C.neutral, A)
                box(x - 2.2 + swing, y, 5.2, 4.6, 0.5, 0.35, C.accent, A)
                ops.push({ d: x + y + 1.2, f: () => { const [a1, b1] = P(x + 1.4 + swing, y + 0.25, 5.2), [a2, b2] = P(x + 1.4 + swing, y + 0.25, 2.2); ctx.strokeStyle = rgba(C.line, 0.5 * A); ctx.beginPath(); ctx.moveTo(a1, b1); ctx.lineTo(a2, b2); ctx.stroke() } })
            }
            const ship = shipState(t)
            crane(-14, -3, Math.sin(t * 0.8) * 0.8)
            crane(13, 2.6, Math.sin(t * 0.8 + 2) * 0.8)

            // ship + containers (count follows loading)
            const sy = -SHIP_W / 2, bob = Math.sin(t * 1.4) * 0.05
            // the ship is one group: hull first, then what stands on it (back to front)
            const shipOps: Op[] = []; target = shipOps
            box(ship.x, sy, bob, SHIP_LEN, SHIP_W, 0.7, C.hull, A, 0.3)
            const n = Math.round(ship.loadK * 8)
            for (let i = 0; i < n; i++) {
                const cx = ship.x + 0.4 + (i % 4) * 1.35, cy = sy + 0.25 + Math.floor(i / 4) * 1.08
                box(cx, cy, 0.7 + bob, 1.25, 1.0, 0.62, [C.accent, C.ice, C.sand, C.neutral][i % 4], A)
            }
            box(ship.x + SHIP_LEN - 1.4, sy + 0.4, 0.7 + bob, 1.1, SHIP_W - 0.8, 1.1, C.deck, A)
            target = null
            const hullOp = shipOps.shift()!; shipOps.sort((a, b) => a.d - b.d)
            ops.push({ d: ship.x + SHIP_LEN + 1, f: () => { hullOp.f(); shipOps.forEach(o => o.f()) } })
            // wake behind the moving ship
            if (ship.phase === 'sea' || ship.phase === 'back') {
                ctx.strokeStyle = rgba(C.ice, 0.35 * A)
                for (let k = 1; k <= 3; k++) { const back = ship.phase === 'sea' ? -k * 0.9 : SHIP_LEN + k * 0.9; ctx.beginPath(); ctx.moveTo(...P(ship.x + back, -0.4 - k * 0.25, 0)); ctx.lineTo(...P(ship.x + back + (ship.phase === 'sea' ? -0.7 : 0.7), 0, 0)); ctx.lineTo(...P(ship.x + back, 0.4 + k * 0.25, 0)); ctx.stroke() }
            }

            // Algeria side: cars off the ship, customs gate, showroom, then the road home
            const gateX = 23.5
            let gateOpen = 0
            for (let i = 0; i < 4; i++) {
                const u = ((t / 11 + i / 4) % 1)
                // slow down through customs
                const x = lerp(DZ[0][0], DZ[1][0], u < 0.4 ? u / 0.4 * 0.42 : u < 0.5 ? 0.42 + (u - 0.4) * 0.3 : 0.45 + (u - 0.5) / 0.5 * 0.55)
                if (Math.abs(x - gateX) < 1.6) gateOpen = 1
                car(x, (i % 2 ? 0.35 : -0.35), true, cols[(i + 1) % 5], A * clamp(u * 10) * clamp((1 - u) * 10))
            }
            box(gateX - 0.2, 1, 0, 0.4, 0.4, 1.3, C.neutral, A)
            ops.push({ d: gateX + 1.5, f: () => { const ang = gateOpen ? -1.2 : 0; const [px, py] = P(gateX, 1.2, 1.2); ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.strokeStyle = rgba(C.accent, A); ctx.lineWidth = Math.max(2, SU * 0.14); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-SU * 1.6, -SU * 0.8); ctx.stroke(); ctx.restore() } })
            // showroom
            box(26.5, -6.5, 0, 5, 3.4, 2.3, C.build, A, 0.3)
            box(26.5, -6.5, 2.3, 5, 3.4, 0.25, C.accent, A)
            car(27.8, -1.8, false, C.accent, A); car(30, -1.8, false, C.car1, A)

            flag(-23.5, -9.2, 'kr', t, A); flag(-23.5, 4.8, 'cn', t, A); flag(19.3, -3.2, 'dz', t + 1, A); flag(32, -6.2, 'dz', t + 2, A)
            const stage = ship.phase === 'load' ? 'export' : ship.phase === 'port' ? 'port' : ship.phase === 'sea' ? 'sea' : 'home'
            label(-26.5, -9.5, 0, L.korea, A, stage === 'export'); label(-26.5, 9.5, 0, L.china, A, stage === 'export')
            label(-16, -3.5, 0, L.export, A, stage === 'export'); label(ship.x + SHIP_LEN / 2, -1.3, 1.6, L.sea, A, stage === 'sea')
            label(16, 3.5, 0, L.port, A, stage === 'port'); label(gateX, 1.2, 1.4, L.customs, A, stage === 'home'); label(29, -6.5, 2.6, L.home, A, stage === 'home')

            ops.sort((a, b) => a.d - b.d).forEach(o => o.f())
            if (shown !== stage) { shown = stage; document.documentElement.dataset.stage = stage }
        }
        frame = requestAnimationFrame(draw)
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={ref} className="route-scene" aria-hidden="true" />
}
