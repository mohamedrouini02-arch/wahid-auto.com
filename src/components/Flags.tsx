// Small round flags drawn in SVG, centered on (cx, cy). Simplified for small sizes.
type FlagProps = { cx: number; cy: number; r?: number; id: string }

const Ring = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F2EE" strokeWidth="2" />
)

export const FlagAlgeria = ({ cx, cy, r = 18, id }: FlagProps) => (
    <g>
        <clipPath id={id}><circle cx={cx} cy={cy} r={r} /></clipPath>
        <g clipPath={`url(#${id})`}>
            <rect x={cx - r} y={cy - r} width={r} height={r * 2} fill="#006233" />
            <rect x={cx} y={cy - r} width={r} height={r * 2} fill="#FFFFFF" />
            <circle cx={cx + r * 0.05} cy={cy} r={r * 0.5} fill="#D21034" />
            <circle cx={cx + r * 0.2} cy={cy} r={r * 0.4} fill="#FFFFFF" />
            <polygon
                points={star(cx + r * 0.32, cy, r * 0.2, r * 0.08, -90)}
                fill="#D21034"
            />
        </g>
        <Ring cx={cx} cy={cy} r={r} />
    </g>
)

export const FlagChina = ({ cx, cy, r = 18, id }: FlagProps) => (
    <g>
        <clipPath id={id}><circle cx={cx} cy={cy} r={r} /></clipPath>
        <g clipPath={`url(#${id})`}>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#DE2910" />
            <polygon points={star(cx - r * 0.38, cy - r * 0.3, r * 0.34, r * 0.13, -90)} fill="#FFDE00" />
            <polygon points={star(cx + r * 0.05, cy - r * 0.62, r * 0.11, r * 0.045, -60)} fill="#FFDE00" />
            <polygon points={star(cx + r * 0.25, cy - r * 0.38, r * 0.11, r * 0.045, -75)} fill="#FFDE00" />
            <polygon points={star(cx + r * 0.25, cy - r * 0.08, r * 0.11, r * 0.045, -100)} fill="#FFDE00" />
            <polygon points={star(cx + r * 0.05, cy + r * 0.14, r * 0.11, r * 0.045, -120)} fill="#FFDE00" />
        </g>
        <Ring cx={cx} cy={cy} r={r} />
    </g>
)

export const FlagKorea = ({ cx, cy, r = 18, id }: FlagProps) => {
    const t = r * 0.42
    // Four trigram bars, simplified to solid groups at the corners
    const bars = [
        { a: -35, n: [1, 1, 1] },
        { a: 35, n: [1, 0, 1] },
        { a: 145, n: [0, 1, 0] },
        { a: 215, n: [0, 0, 0] },
    ]
    return (
        <g>
            <clipPath id={id}><circle cx={cx} cy={cy} r={r} /></clipPath>
            <g clipPath={`url(#${id})`}>
                <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#FFFFFF" />
                <g transform={`rotate(-34 ${cx} ${cy})`}>
                    <path d={`M${cx - t} ${cy} A${t} ${t} 0 0 1 ${cx + t} ${cy} Z`} fill="#CD2E3A" />
                    <path d={`M${cx - t} ${cy} A${t} ${t} 0 0 0 ${cx + t} ${cy} Z`} fill="#0047A0" />
                    <circle cx={cx - t / 2} cy={cy} r={t / 2} fill="#CD2E3A" />
                    <circle cx={cx + t / 2} cy={cy} r={t / 2} fill="#0047A0" />
                </g>
                {bars.map(({ a, n }) => (
                    <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
                        {n.map((solid, i) => {
                            const y = cy - r * 0.78 + i * r * 0.11
                            return solid
                                ? <rect key={i} x={cx - r * 0.2} y={y} width={r * 0.4} height={r * 0.07} fill="#111" />
                                : <g key={i}>
                                    <rect x={cx - r * 0.2} y={y} width={r * 0.17} height={r * 0.07} fill="#111" />
                                    <rect x={cx + r * 0.03} y={y} width={r * 0.17} height={r * 0.07} fill="#111" />
                                </g>
                        })}
                    </g>
                ))}
            </g>
            <Ring cx={cx} cy={cy} r={r} />
        </g>
    )
}

// Five-point star polygon points
function star(cx: number, cy: number, outer: number, inner: number, rotationDeg: number) {
    const pts: string[] = []
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outer : inner
        const angle = ((rotationDeg + i * 36) * Math.PI) / 180
        pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`)
    }
    return pts.join(' ')
}
