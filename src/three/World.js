// Wahid Auto "world": one persistent WebGL scene behind every page.
// The camera travels down a road of light as the page scrolls: the Two Roads monogram
// at the start, milestone rings along the way, and Algeria glowing at the end.
// Plain ESM so it can be tested outside the app.
import * as THREE from 'three'

const INK = 0xf2f2ee
const GREEN = 0x5fb89b
const BG = 0x0a0b0b
const ROAD_LENGTH = 90

const toVec = ([x, y]) => new THREE.Vector3((x - 60) / 30, -(y - 60) / 30, 0)
const LEFT_V = [[30, 40], [44, 82], [60, 50]].map(toVec)
const RIGHT_V = [[60, 50], [76, 82], [90, 40]].map(toVec)

function stroke(points, material, radius) {
    const group = new THREE.Group()
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i + 1]
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 32), material)
        mesh.position.copy(a).add(b).multiplyScalar(0.5)
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
        group.add(mesh)
    }
    for (const p of points) {
        const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), material)
        joint.position.copy(p)
        group.add(joint)
    }
    return group
}

function studioEnvironment(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer)
    const studio = new THREE.Scene()
    const panel = (w, h, color, x, y, z, ry) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }))
        m.position.set(x, y, z); m.rotation.y = ry; studio.add(m)
    }
    panel(8, 3, 0xffffff, 0, 4, 2, 0)
    panel(3, 6, GREEN, -5, 0, 0, Math.PI / 2)
    panel(3, 6, 0x9fb7ff, 5, 0, 0, -Math.PI / 2)
    panel(10, 10, 0x111614, 0, 0, -6, 0)
    const texture = pmrem.fromScene(studio, 0.04).texture
    return { texture, pmrem }
}

// Particles that stream along a curve
function streamAlong(curve, count, color, size, opacity = 0.9) {
    const positions = new Float32Array(count * 3)
    const offsets = Float32Array.from({ length: count }, () => Math.random())
    const jitter = Array.from({ length: count }, () => new THREE.Vector3((Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
    points.frustumCulled = false
    const tmp = new THREE.Vector3()
    return {
        points,
        update(t) {
            for (let i = 0; i < count; i++) {
                curve.getPointAt((offsets[i] + t) % 1, tmp).add(jitter[i])
                positions[i * 3] = tmp.x; positions[i * 3 + 1] = tmp.y; positions[i * 3 + 2] = tmp.z
            }
            geo.attributes.position.needsUpdate = true
        },
    }
}

export function createWorld(canvas, { reducedMotion = false, mirror = false } = {}) {
    const side = mirror ? -1 : 1
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setClearColor(BG, 1)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(BG, 0.045)
    const env = studioEnvironment(renderer)
    scene.environment = env.texture

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x0b1210, 0.5))
    const key = new THREE.DirectionalLight(0xffffff, 2)
    key.position.set(3, 4, 6)
    scene.add(key)
    const rim = new THREE.PointLight(GREEN, 40, 24)
    scene.add(rim)

    const metal = new THREE.MeshPhysicalMaterial({ color: INK, metalness: 0.9, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15 })
    const green = new THREE.MeshPhysicalMaterial({ color: GREEN, metalness: 0.4, roughness: 0.25, clearcoat: 1, emissive: GREEN, emissiveIntensity: 0.35 })

    // 1. The monogram at the start of the road
    const logo = new THREE.Group()
    logo.add(stroke(LEFT_V, metal, 0.13), stroke(RIGHT_V, green, 0.13))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.87, 0.025, 24, 160), new THREE.MeshPhysicalMaterial({ color: INK, metalness: 1, roughness: 0.3 }))
    logo.add(ring)
    scene.add(logo)

    // 2. Two incoming roads (Korea, China) that join at the monogram
    const korea = new THREE.CatmullRomCurve3([new THREE.Vector3(12, 6, -10), new THREE.Vector3(7, 3.8, -4), new THREE.Vector3(4, 2, -1), new THREE.Vector3()])
    const china = new THREE.CatmullRomCurve3([new THREE.Vector3(12, -5, -10), new THREE.Vector3(7, -3.4, -4), new THREE.Vector3(4, -2, -0.8), new THREE.Vector3()])
    const koreaStream = streamAlong(korea, 900, 0xffffff, 0.07)
    const chinaStream = streamAlong(china, 900, GREEN, 0.08)
    scene.add(koreaStream.points, chinaStream.points)

    // 3. The road ahead: two lane lines of light and a stream of particles toward Algeria
    const roadGroup = new THREE.Group()
    const lane = (x) => new THREE.CatmullRomCurve3(Array.from({ length: 12 }, (_, i) => new THREE.Vector3(x + Math.sin(i * 0.7) * 1.2, -2.2, -i * (ROAD_LENGTH / 11))))
    const leftLane = lane(-1.6), rightLane = lane(1.6)
    for (const [curve, color] of [[leftLane, INK], [rightLane, GREEN]]) {
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 400, 0.025, 8, false), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 }))
        roadGroup.add(tube)
    }
    const center = lane(0)
    const flow = streamAlong(center, 1400, 0xbfe9d9, 0.06, 0.7)
    roadGroup.add(flow.points)

    // Milestone rings along the road
    const milestones = []
    for (let i = 1; i <= 6; i++) {
        const z = -i * (ROAD_LENGTH / 7)
        const m = new THREE.Mesh(new THREE.TorusGeometry(2.6 + (i % 2) * 0.8, 0.02, 16, 160), new THREE.MeshPhysicalMaterial({ color: i % 2 ? GREEN : INK, metalness: 1, roughness: 0.25, emissive: i % 2 ? GREEN : 0x000000, emissiveIntensity: 0.25 }))
        const p = center.getPointAt(Math.min(0.99, -z / ROAD_LENGTH))
        m.position.set(p.x, 0, z)
        milestones.push(m)
        roadGroup.add(m)
    }

    // Algeria at the end of the road: a soft green sun
    const sun = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 32), new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.95, fog: false }))
    sun.position.set(0, 1.5, -ROAD_LENGTH - 12)
    roadGroup.add(sun)
    const halo = new THREE.Mesh(new THREE.RingGeometry(3.4, 9, 64), new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.12, side: THREE.DoubleSide, fog: false }))
    halo.position.copy(sun.position)
    roadGroup.add(halo)
    scene.add(roadGroup)

    // Stars for depth
    const dustGeo = new THREE.BufferGeometry()
    const dust = new Float32Array(2400 * 3)
    for (let i = 0; i < dust.length; i += 3) {
        dust[i] = (Math.random() - 0.5) * 60
        dust[i + 1] = (Math.random() - 0.3) * 30
        dust[i + 2] = 10 - Math.random() * (ROAD_LENGTH + 40)
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))
    const stars = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9ea29c, size: 0.03, transparent: true, opacity: 0.6, depthWrite: false }))
    scene.add(stars)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const state = { progress: 0, eased: 0, accent: 0, width: 1, height: 1, narrow: false }
    let frame = 0
    let running = true
    const clock = new THREE.Clock()

    const layout = () => {
        const w = window.innerWidth, h = window.innerHeight
        state.width = w; state.height = h; state.narrow = w < 860
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.fov = state.narrow ? 52 : 38
        camera.updateProjectionMatrix()
        const lx = state.narrow ? 0 : 2.4 * side
        const ly = state.narrow ? 1.3 : 0
        const s = state.narrow ? 0.6 : 1
        logo.position.set(lx, ly, 0)
        logo.scale.setScalar(s)
        // Incoming roads end where the monogram's two V's meet
        const end = new THREE.Vector3(0, -0.33, 0.25).multiplyScalar(s).add(logo.position)
        for (const curve of [korea, china]) {
            curve.points.forEach((p, i) => { if (i < curve.points.length - 1) p.x = Math.abs(p.x) * side + (i === 0 ? 0 : lx * 0.3) })
            curve.points[curve.points.length - 1].copy(end)
            curve.updateArcLengths()
        }
    }

    const onPointer = (e) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
        pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }

    const tmp = new THREE.Vector3()
    const look = new THREE.Vector3()
    const render = () => {
        const t = clock.getElapsedTime()
        pointer.x += (pointer.tx - pointer.x) * 0.05
        pointer.y += (pointer.ty - pointer.y) * 0.05
        state.eased += (state.progress - state.eased) * 0.08
        const p = state.eased

        // Phase 1 (0 → 0.18): orbit the monogram. Phase 2: fly down the road to Algeria.
        const intro = Math.min(1, p / 0.18)
        const travel = Math.max(0, (p - 0.12) / 0.88)
        center.getPointAt(Math.min(0.999, travel * 0.97), tmp)
        const cz = 9 - intro * 3 + tmp.z
        camera.position.set(tmp.x * 0.6 + pointer.x * 0.6, 0.2 + travel * 0.6 - pointer.y * 0.3, cz)
        center.getPointAt(Math.min(0.999, travel * 0.97 + 0.04), look)
        look.y = 0
        camera.lookAt(look.x * 0.5, travel > 0.02 ? 0 : 0, cz - 10)

        logo.rotation.y = Math.sin(t * 0.35) * 0.25 + pointer.x * 0.35 + intro * 1.2 * side
        logo.rotation.x = Math.cos(t * 0.3) * 0.08 + pointer.y * 0.2
        logo.position.y = (state.narrow ? 1.3 : 0) + Math.sin(t * 0.8) * 0.06
        ring.rotation.z = t * 0.1
        milestones.forEach((m, i) => { m.rotation.z = t * (0.05 + i * 0.01); m.rotation.y = Math.sin(t * 0.2 + i) * 0.3 })
        halo.rotation.z = t * 0.05
        sun.scale.setScalar(1 + Math.sin(t * 1.2) * 0.03)

        koreaStream.update(t * 0.06)
        chinaStream.update(t * 0.05 + 0.5)
        flow.update(t * 0.025)
        rim.position.set(camera.position.x - 3 * side, -1, camera.position.z - 6)
        rim.intensity = 40 + Math.sin(t * 1.4) * 8
        stars.rotation.z = t * 0.004

        renderer.render(scene, camera)
    }

    const loop = () => {
        if (!running) return
        render()
        frame = requestAnimationFrame(loop)
    }

    layout()
    window.addEventListener('resize', layout)
    if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true })
    loop()

    return {
        // 0 at the top of the page, 1 at the bottom
        setProgress(value) { state.progress = Math.max(0, Math.min(1, value)) },
        jumpTo(value) { state.progress = state.eased = Math.max(0, Math.min(1, value)) },
        setActive(active) {
            if (active && !running) { running = true; loop() }
            if (!active) { running = false; cancelAnimationFrame(frame) }
        },
        destroy() {
            running = false
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', layout)
            window.removeEventListener('pointermove', onPointer)
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose()
                if (obj.material) obj.material.dispose()
            })
            env.texture.dispose()
            env.pmrem.dispose()
            renderer.dispose()
        },
    }
}
