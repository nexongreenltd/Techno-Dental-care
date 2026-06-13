import { useEffect, useRef, useState } from "react";

/**
 * Premium dental-tech hero scene.
 * Dental mirror + probe instruments crossed behind a soft smile arc and a
 * translucent digital-scan grid card. No sphere, no orbit, no scanner UI.
 */
export function ToothScene() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) / r.width;
      ty = (e.clientY - r.top - r.height / 2) / r.height;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      setTilt({ x: cx, y: cy });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      aria-hidden
    >
      {/* Ambient blue wash (no sphere) */}
      <div
        className="pointer-events-none absolute inset-[8%] blur-3xl [animation:glow-breathe_9s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 55%, rgba(24,184,240,0.30) 0%, rgba(13,99,214,0.10) 50%, rgba(13,99,214,0) 80%)",
        }}
      />

      {/* Parallax stage */}
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate3d(${tilt.x * 6}px, ${tilt.y * 6}px, 0)`,
          transition: "transform 0.25s linear",
        }}
      >
        {/* Crossed dental instruments behind the smile */}
        <svg
          viewBox="-100 -100 200 200"
          className="absolute inset-0 h-full w-full"
          style={{ filter: "drop-shadow(0 18px 28px rgba(13,99,214,0.18))" }}
        >
          <defs>
            <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5FAFF" />
              <stop offset="50%" stopColor="#CFE3F5" />
              <stop offset="100%" stopColor="#8FB4D6" />
            </linearGradient>
            <linearGradient id="handle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0D63D6" />
              <stop offset="100%" stopColor="#18B8F0" />
            </linearGradient>
            <radialGradient id="mirrorFace" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#E6F4FF" />
              <stop offset="100%" stopColor="#A7E7FF" />
            </radialGradient>
            <linearGradient id="smile" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0D63D6" stopOpacity="0" />
              <stop offset="20%" stopColor="#0D63D6" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#18B8F0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#18B8F0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dental mirror — handle + round mirror head, tilted left */}
          <g transform="rotate(-28)">
            <rect x="-3" y="-4" width="80" height="6" rx="3" fill="url(#handle)" />
            <rect x="-3" y="-4" width="80" height="6" rx="3" fill="url(#steel)" opacity="0.25" />
            <circle cx="-14" cy="-1" r="18" fill="url(#steel)" />
            <circle cx="-14" cy="-1" r="15" fill="url(#mirrorFace)" />
            <ellipse cx="-19" cy="-6" rx="6" ry="3" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* Dental explorer/probe — slim curved tip, tilted right */}
          <g transform="rotate(28)">
            <rect x="-78" y="-3" width="70" height="5" rx="2.5" fill="url(#handle)" />
            <rect x="-78" y="-3" width="70" height="5" rx="2.5" fill="url(#steel)" opacity="0.2" />
            <path
              d="M -8 -0.5 C 2 -0.5, 10 -2, 16 -8 C 20 -12, 22 -16, 20 -20"
              stroke="url(#steel)"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Soft smile arc — centerpiece */}
          <path
            d="M -62 6 Q 0 60, 62 6"
            stroke="url(#smile)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle inner echo */}
          <path
            d="M -50 8 Q 0 46, 50 8"
            stroke="#18B8F0"
            strokeOpacity="0.25"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Digital-scan glass card — top right */}
        <div
          className="absolute right-[6%] top-[8%] w-[42%] rounded-2xl p-3 animate-drift-soft"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(207,232,255,0.55))",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 18px 40px -16px rgba(13,99,214,0.35)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-brand">
              3D Scan
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 [animation:pulse-ring_2.4s_ease-in-out_infinite]" />
          </div>
          {/* Mini scan visualization — concentric arcs */}
          <svg viewBox="0 0 100 56" className="mt-1.5 h-12 w-full">
            <defs>
              <linearGradient id="scanLine" x1="0" x2="1">
                <stop offset="0%" stopColor="#0D63D6" />
                <stop offset="100%" stopColor="#18B8F0" />
              </linearGradient>
            </defs>
            <path d="M 6 48 Q 50 8, 94 48" stroke="url(#scanLine)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 14 48 Q 50 18, 86 48" stroke="#18B8F0" strokeOpacity="0.5" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 22 48 Q 50 28, 78 48" stroke="#18B8F0" strokeOpacity="0.3" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* Tick marks for tooth positions */}
            {[18, 30, 42, 54, 66, 78].map((x) => (
              <line key={x} x1={x} y1="48" x2={x} y2="44" stroke="#0D63D6" strokeOpacity="0.5" strokeWidth="0.8" />
            ))}
          </svg>
        </div>

        {/* Treatment plan glass chip — bottom left */}
        <div
          className="absolute left-[4%] bottom-[10%] flex items-center gap-2 rounded-2xl px-3 py-2 animate-float-slow"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(167,231,255,0.55))",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 14px 34px -14px rgba(13,99,214,0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            animationDelay: "0.8s",
          }}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-brand text-white text-[10px] font-bold">
            Rx
          </span>
          <div className="leading-tight">
            <div className="text-[9px] uppercase tracking-wider text-ink-soft">Treatment Plan</div>
            <div className="text-[11px] font-semibold text-ink">Ready · 2 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}