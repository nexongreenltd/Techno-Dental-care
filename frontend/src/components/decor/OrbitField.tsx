/**
 * Decorative orbit rings inspired by the Techno Dental logo.
 * Pure SVG, no deps. Renders three concentric tilted ellipses with
 * a center glow and a few moving "satellites".
 */
export function OrbitField({
  className = "",
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      <svg
        viewBox="0 0 800 800"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="orbitCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#18B8F0" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0D63D6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0D63D6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#18B8F0" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#18B8F0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0D63D6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="400" r="260" fill="url(#orbitCore)" />
        <g transform="translate(400 400)" className="animate-spin-slow" style={{ transformOrigin: "center" }}>
          <ellipse cx="0" cy="0" rx="340" ry="120" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" />
        </g>
        <g transform="translate(400 400) rotate(35)" className="animate-spin-rev" style={{ transformOrigin: "center" }}>
          <ellipse cx="0" cy="0" rx="280" ry="95" fill="none" stroke="url(#ringGrad)" strokeWidth="1.2" />
        </g>
        <g transform="translate(400 400) rotate(-22)" className="animate-spin-slow" style={{ transformOrigin: "center" }}>
          <ellipse cx="0" cy="0" rx="210" ry="70" fill="none" stroke="#A7E7FF" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="210" cy="0" r="4" fill="#18B8F0" />
        </g>
      </svg>
    </div>
  );
}