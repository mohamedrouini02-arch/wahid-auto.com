// Wahid Auto hero: the Two Roads monogram in 3D, with light trails flowing
// from Korea and China into Algeria. Plain ESM so it can be tested outside the app.
import * as THREE from 'three'

const INK = 0xf2f2ee
const GREEN = 0x5fb89b
const NIGHT = 0x0e100f

// Monogram strokes in the same 120x120 space as the SVG logo, centered on 0.
const toVec = ([x, y]) => new THREE.Vector3((x - 60) / 30, -(y - 60) / 30, 0)
const LEFT_V = [[30, 40], [44, 82], [60, 50]].map(toVec)
const RIGHT_V = [[60, 50], [76, 82], [90, 40]].map(toVec)

function strokeMesh(points, material, radius) {
    const group = new THREE.Group()
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i + 1]
        const len = a.distanceTo(b)
        const geo = new THREE.CylinderGeometry(radius, radius, len, 32, 1)
        const mesh = new THREE.Mesh(geo, material)
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

function makeTrail(curve, count, color, size) {
    const positions = new Float32Array(count * 3)
    const offsets = new Float32Array(count)
    for (let i = 0; i < count; i++) offsets[i] = Math.random()
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
        color, size, sizeAttenuation: true, transparent: true, opacity: 0.85,
        depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    points.renderOrder = 2
    points.frustumCulled = false
    const tmp = new THREE.Vector3()
    const jitter = Array.from({ length: count }, () => new THREE.Vector3((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12))
    const update = (t) => {
        for (let i = 0; i < count; i++) {
            const u = (offsets[i] + t) % 1
            curve.getPointAt(u, tmp)
            tmp.add(jitter[i])
            positions.set([tmp.x, tmp.y, tmp.z], i * 3)
        }
        geo.attributes.position.needsUpdate = true
    }
    return { points, update }
}

export function createHeroScene(canvas, { reducedMotion = false, mirror = false } = {}) {
    const side = mirror ? -1 : 1
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    const scene = new THREE.Scene()
    // Soft studio reflections without loading any file
    const pmrem = new THREE.PMREMGenerator(renderer)
    const studio = new THREE.Scene()
    const panel = (w, h, color, x, y, z, ry) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }))
        m.position.set(x, y, z); m.rotation.y = ry; studio.add(m)
    }
    panel(8, 3, 0xffffff, 0, 4, 2, 0)
    panel(3, 6, 0x5fb89b, -5, 0, 0, Math.PI / 2)
    panel(3, 6, 0x9fb7ff, 5, 0, 0, -Math.PI / 2)
    panel(10, 10, 0x111614, 0, 0, -6, 0)
    scene.environment = pmrem.fromScene(studio, 0.04).texture
    scene.fog = new THREE.Fog(NIGHT, 9, 22)
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    // Lights: a soft key, a green rim from Algeria, a cool fill
    scene.add(new THREE.HemisphereLight(0xffffff, 0x0b1210, 0.6))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(3, 4, 6)
    scene.add(key)
    const rim = new THREE.PointLight(GREEN, 40, 20)
    rim.position.set(-3, -1, 3)
    scene.add(rim)
    const fill = new THREE.PointLight(0x9fb7ff, 14, 20)
    fill.position.set(4, -2, -2)
    scene.add(fill)

    const logo = new THREE.Group()
    const metal = new THREE.MeshPhysicalMaterial({ color: INK, metalness: 0.9, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 })
    const green = new THREE.MeshPhysicalMaterial({ color: GREEN, metalness: 0.4, roughness: 0.25, clearcoat: 1, emissive: GREEN, emissiveIntensity: 0.35 })
    logo.add(strokeMesh(LEFT_V, metal, 0.13))
    logo.add(strokeMesh(RIGHT_V, green, 0.13))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.87, 0.025, 24, 160), new THREE.MeshPhysicalMaterial({ color: INK, metalness: 1, roughness: 0.3 }))
    logo.add(ring)
    const glass = new THREE.Mesh(
        new THREE.CircleGeometry(1.84, 96),
        new THREE.MeshPhysicalMaterial({ color: 0x0f1a16, metalness: 0, roughness: 0.1, transmission: 0.6, transparent: true, opacity: 0.22, thickness: 0.4, depthWrite: false })
    )
    glass.position.z = -0.2
    logo.add(glass)
    scene.add(logo)

    // Two roads: Korea (upper right) and China (lower right) into the logo's meeting point
    const meet = new THREE.Vector3(0, -0.33, 0.2)
    const koreaCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(10, 5.5, -7), new THREE.Vector3(7, 3.8, -3), new THREE.Vector3(4.4, 2.2, -1), meet.clone()])
    const chinaCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(10, -5, -7), new THREE.Vector3(7, -3.4, -3), new THREE.Vector3(4.4, -2, -0.8), meet.clone()])
    if (mirror) for (const curve of [koreaCurve, chinaCurve]) curve.points.forEach(p => { p.x *= -1 })
    const korea = makeTrail(koreaCurve, 900, 0xffffff, 0.07)
    const china = makeTrail(chinaCurve, 900, GREEN, 0.08)
    const aimTrails = () => {
        const end = new THREE.Vector3(0, -0.33, 0.25).multiplyScalar(logo.scale.x).add(logo.position)
        for (const curve of [koreaCurve, chinaCurve]) {
            const pts = curve.points
            pts[pts.length - 1].copy(end)
            pts[pts.length - 2].lerpVectors(pts[pts.length - 3], end, 0.6)
            curve.updateArcLengths()
        }
    }
    scene.add(korea.points, china.points)

    // Faint dust for depth
    const dustGeo = new THREE.BufferGeometry()
    const dust = new Float32Array(900 * 3)
    for (let i = 0; i < dust.length; i += 3) {
        dust[i] = (Math.random() - 0.5) * 24
        dust[i + 1] = (Math.random() - 0.5) * 14
        dust[i + 2] = -Math.random() * 14
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))
    const dustPoints = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9ea29c, size: 0.02, transparent: true, opacity: 0.5, depthWrite: false }))
    scene.add(dustPoints)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let scroll = 0
    let width = 0, height = 0
    let frame = 0
    let running = true
    const clock = new THREE.Clock()

    const resize = () => {
        const rect = canvas.getBoundingClientRect()
        width = Math.max(1, rect.width)
        height = Math.max(1, rect.height)
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        // On narrow screens the logo sits above the text, smaller and centered
        const narrow = width < 860
        logo.position.set(narrow ? 0 : 2.4 * side, narrow ? 1.1 : 0, 0)
        logo.scale.setScalar(narrow ? 0.62 : 1)
        aimTrails()
        camera.updateProjectionMatrix()
    }

    const onPointer = (e) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
        pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }

    const render = () => {
        const t = clock.getElapsedTime()
        pointer.x += (pointer.tx - pointer.x) * 0.05
        pointer.y += (pointer.ty - pointer.y) * 0.05

        logo.rotation.y = Math.sin(t * 0.35) * 0.25 + pointer.x * 0.35 + scroll * 1.6 * side
        logo.rotation.x = Math.cos(t * 0.3) * 0.08 + pointer.y * 0.2 - scroll * 0.4
        logo.position.y = (width < 860 ? 1.1 : 0) + Math.sin(t * 0.8) * 0.06 + scroll * 1.2
        ring.rotation.z = t * 0.1

        korea.update(t * 0.06)
        china.update(t * 0.05 + 0.5)
        dustPoints.rotation.y = t * 0.01 + pointer.x * 0.05

        camera.position.z = 9 + scroll * 2.5
        rim.intensity = 40 + Math.sin(t * 1.4) * 8

        renderer.render(scene, camera)
    }

    const loop = () => {
        if (!running) return
        render()
        frame = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reducedMotion) {
        window.addEventListener('pointermove', onPointer, { passive: true })
        loop()
    } else {
        korea.update(0.3); china.update(0.7)
        render()
    }

    return {
        // 0 at the top of the hero, 1 when it has scrolled out
        setScroll(value) { scroll = Math.max(0, Math.min(1, value)) },
        setActive(active) {
            if (reducedMotion) return
            if (active && !running) { running = true; clock.start(); loop() }
            if (!active) { running = false; cancelAnimationFrame(frame) }
        },
        destroy() {
            running = false
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', onPointer)
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose()
                if (obj.material) obj.material.dispose()
            })
            pmrem.dispose()
            renderer.dispose()
        },
    }
}
