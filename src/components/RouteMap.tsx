import { useState } from 'react'
import { FlagAlgeria, FlagChina, FlagKorea } from './Flags'

type Origin = 'korea' | 'china' | null

type Props = {
    labels: { korea: string; china: string; algeria: string }
}

// The "Two Roads" idea as a route: Korea and China, two lines meeting in Algeria.
// Hovering or tapping an origin highlights its road.
export default function RouteMap({ labels }: Props) {
    const [active, setActive] = useState<Origin>(null)
    const dim = (origin: Exclude<Origin, null>) => (active && active !== origin ? 0.25 : 1)

    return (
        <svg className="route-map" viewBox="0 0 560 420" role="img" aria-label={`${labels.korea} · ${labels.china} → ${labels.algeria}`}>
            <defs>
                <pattern id="route-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.1" className="route-grid-dot" />
                </pattern>
                <radialGradient id="route-glow">
                    <stop offset="0" stopColor="#5FB89B" stopOpacity=".55" />
                    <stop offset="1" stopColor="#5FB89B" stopOpacity="0" />
                </radialGradient>
            </defs>

            <rect x="0" y="0" width="560" height="420" fill="url(#route-dots)" opacity=".5" />

            {/* Korea road */}
            <g style={{ opacity: dim('korea') }} className="route-group">
                <path d="M478 96 C 360 40, 200 90, 104 300" className="route-path route-path-light" />
                <path d="M478 96 C 360 40, 200 90, 104 300" className="route-path route-flow route-flow-light" />
            </g>
            {/* China road */}
            <g style={{ opacity: dim('china') }} className="route-group">
                <path d="M432 232 C 340 300, 220 330, 104 300" className="route-path route-path-accent" />
                <path d="M432 232 C 340 300, 220 330, 104 300" className="route-path route-flow route-flow-accent" />
            </g>

            {/* Algeria: the meeting point */}
            <circle cx="104" cy="300" r="60" fill="url(#route-glow)" className="route-pulse" />
            <FlagAlgeria cx={104} cy={300} r={22} id="flag-dz" />
            <text x="104" y="348" textAnchor="middle" className="route-label route-label-home">{labels.algeria}</text>

            <g
                className="route-origin"
                tabIndex={0}
                role="button"
                aria-pressed={active === 'korea'}
                onMouseEnter={() => setActive('korea')}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive('korea')}
                onBlur={() => setActive(null)}
                onClick={() => setActive(a => (a === 'korea' ? null : 'korea'))}
            >
                <circle cx="478" cy="96" r="22" fill="transparent" />
                <FlagKorea cx={478} cy={96} r={18} id="flag-kr" />
                <text x="478" y="64" textAnchor="middle" className="route-label">{labels.korea}</text>
            </g>
            <g
                className="route-origin"
                tabIndex={0}
                role="button"
                aria-pressed={active === 'china'}
                onMouseEnter={() => setActive('china')}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive('china')}
                onBlur={() => setActive(null)}
                onClick={() => setActive(a => (a === 'china' ? null : 'china'))}
            >
                <circle cx="432" cy="232" r="22" fill="transparent" />
                <FlagChina cx={432} cy={232} r={18} id="flag-cn" />
                <text x="432" y="272" textAnchor="middle" className="route-label">{labels.china}</text>
            </g>
        </svg>
    )
}
