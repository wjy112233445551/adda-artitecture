"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
