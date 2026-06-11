"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const exitTimeline = useRef<gsap.core.Timeline | null>(null);
  const doExitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (started.current) return;
    if (window.location.pathname === "/admin") {
      if (containerRef.current) containerRef.current.style.display = "none";
      return;
    }
    started.current = true;

    const doExit = () => {
      if (exitTimeline.current) return;
      exitTimeline.current = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        },
      });
      exitTimeline.current.to([logoRef.current, enterRef.current], { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.2");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // ═══ Phase 1: 光束出现 ═══
    // 光束从左上角对角扫入 — clip-path 从窄条扩开
    tl.fromTo(beamRef.current,
      { clipPath: "polygon(0 0, 15% 0, 0 15%, 0 0)" },
      { clipPath: "polygon(0 0, 25% 0, 0 25%, 0 0)", duration: 0.6, ease: "power3.out" }
    );

    // ═══ Phase 2: 光束横扫 ═══
    tl.to(beamRef.current, {
      clipPath: "polygon(0 0, 100% 0, 0 100%, 0 0)",
      duration: 1.2,
      ease: "power4.inOut",
    });

    // ═══ Phase 3: 文字在光束中浮现 ═══
    tl.fromTo(textRef.current,
      { opacity: 0, textShadow: "0 0 0px rgba(200,160,80,0)" },
      { opacity: 1, textShadow: "0 0 20px rgba(200,160,80,0.6), 0 0 40px rgba(200,160,80,0.3)", duration: 0.8, ease: "power2.out" },
      "-=1.0"
    );

    // ═══ Phase 4: 光束扩散成全屏 — 照片完全显现 ═══
    tl.to(beamRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 0.7,
      ease: "power3.out",
    });

    // 光束淡出，露出原始照片
    tl.to(beamRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.3");
    tl.set(beamRef.current, { display: "none" });

    // ═══ Phase 5: Logo + Enter ═══
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    );
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (beamRef.current) { beamRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"; beamRef.current.style.opacity = "1"; }
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
        if (textRef.current) textRef.current.style.opacity = "1";
      }
    }, 8000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* 底层：完整照片（暗色） */}
      <div ref={photoRef} className="absolute inset-0">
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover opacity-40" />
      </div>

      {/* 光束层：clip-path 扫过的区域更亮 */}
      <div ref={beamRef} className="absolute inset-0 z-10"
        style={{ clipPath: "polygon(0 0, 0 0, 0 0, 0 0)" }}>
        {/* 亮版照片 */}
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover brightness-125 saturate-110" />
        {/* 光束暖色叠加 */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(200,150,60,0.3) 0%, rgba(200,150,60,0.1) 50%, transparent 100%)",
        }} />
        {/* 光束边缘发光 */}
        <div className="absolute inset-0" style={{
          boxShadow: "inset 0 0 80px rgba(200,150,60,0.2)",
        }} />
      </div>

      {/* Welcome to ADDA Zone 文字 */}
      <div ref={textRef} className="absolute z-20 flex items-center justify-center opacity-0"
        style={{
          top: "35%",
          left: "15%",
          transform: "rotate(-2deg)",
        }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(18px, 3.5vw, 48px)",
          color: "#c8a050",
          letterSpacing: "0.08em",
          filter: "drop-shadow(0 0 10px rgba(200,160,80,0.6))",
        }}>
          Welcome to<br />ADDA Zone
        </p>
      </div>

      {/* Logo + Enter */}
      <div ref={logoRef} className="absolute z-30 opacity-0 flex flex-col items-center"
        style={{ bottom: "clamp(40px, 8vw, 80px)", gap: "clamp(16px, 3vw, 32px)" }}>
        <img src="/logo.webp" alt="ADDA" className="w-auto"
          style={{ height: "clamp(48px, 8vw, 100px)", filter: "brightness(1.1)" }} />
        <p className="text-white/25 uppercase tracking-[0.35em] text-center"
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(8px, 0.9vw, 11px)" }}>
          Architecture &amp; Design
        </p>
        <div ref={enterRef} className="opacity-0">
          <button onClick={() => doExitRef.current()}
            className="text-white/40 hover:text-white/90 border border-white/15 hover:border-white/35 uppercase tracking-[.3em] transition-all duration-500"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 1.1vw, 12px)", padding: "clamp(6px, 1vw, 12px) clamp(20px, 3vw, 36px)", background: "transparent" }}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
