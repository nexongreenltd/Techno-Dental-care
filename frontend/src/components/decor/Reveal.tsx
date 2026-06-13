import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal wrapper. Uses IntersectionObserver and falls back
 * to visible whenever IO is unavailable or the element is already on screen
 * at mount (so above-the-fold content never flashes in).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // Reveal immediately if already in viewport at mount
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh + 80) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        filter: visible ? "none" : "blur(6px)",
        transition: `opacity 700ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 700ms cubic-bezier(.22,1,.36,1) ${delay}s, filter 700ms cubic-bezier(.22,1,.36,1) ${delay}s`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}