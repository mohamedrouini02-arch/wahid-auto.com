type LogoProps = {
    showWordmark?: boolean
    size?: number
    className?: string
}

// "Two Roads" monogram: one V for Korea, one for China, meeting in one point.
export const Monogram = ({ size = 40, className }: { size?: number; className?: string }) => (
    <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <polyline
            points="30,40 44,82 60,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <polyline
            points="60,50 76,82 90,40"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const Logo = ({ showWordmark = true, size = 36, className }: LogoProps) => (
    <span className={`logo ${className ?? ''}`} dir="ltr">
        <Monogram size={size} />
        {showWordmark && (
            <span className="logo-word">
                <span className="logo-name">WAHID</span>
                <span className="logo-sub">AUTO</span>
            </span>
        )}
    </span>
)
