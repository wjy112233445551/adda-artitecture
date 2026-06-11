"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// 自定义缓动：前 60% 极慢（暗房适应），后 40% 加速亮起
const darkroomEase = "M0,0 C0.6,0.05 0.7,0.3 1,1";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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
      exitTimeline.current.to([logoRef.current, enterRef.current, glowRef.current], { opacity: 0, duration: 0.4, ease: "power2.in" });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.2");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline();

    // ═══ 光斑显影（4s，暗房曲线）═══
    const revealObj = { progress: 0 };

    tl.to(revealObj, {
      progress: 1,
      duration: 4.0,
      ease: darkroomEase,
      onUpdate: () => {
        const p = revealObj.progress;
        // 光斑大小：0 → 50%（前80%时间）→ 55%（最后20%轻微扩大）
        const size = p < 0.8 ? p / 0.8 * 50 : 50 + (p - 0.8) / 0.2 * 5;
        // 遮罩透明度：从不透明黑 → 半透明（光斑处完全透出照片）
        const maskAlpha = 1 - p * 0.88;

        if (maskRef.current) {
          maskRef.current.style.background = `
            radial-gradient(
              ellipse ${size}% ${size * 0.72}% at 25% 35%,
              transparent 0%,
              rgba(2,2,2,${maskAlpha.toFixed(3)}) 65%,
              rgba(2,2,2,1) 100%
            )
          `;
        }
        // 光斑边缘暖光晕
        if (glowRef.current) {
          glowRef.current.style.opacity = String(p * 0.3);
          glowRef.current.style.background = `
            radial-gradient(
              ellipse ${size}% ${size * 0.72}% at 25% 35%,
              rgba(200,150,60,0.25) 0%,
              rgba(200,150,60,0.05) 60%,
              transparent 100%
            )
          `;
        }
      },
    });

    // ═══ 光斑全亮后：Logo + Enter ═══
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" }
    );
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (maskRef.current) { maskRef.current.style.opacity = "0"; }
        if (glowRef.current) { glowRef.current.style.opacity = "0"; }
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 10000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* 照片层 */}
      <div className="absolute inset-0">
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 光斑暖光晕 */}
      <div ref={glowRef} className="absolute inset-0 z-10 opacity-0 pointer-events-none" />

      {/* 暗色遮罩 — 覆盖在照片上，光斑处透明 */}
      <div ref={maskRef} className="absolute inset-0 z-20"
        style={{
          background: "radial-gradient(ellipse 0% 0% at 25% 35%, transparent 0%, rgba(2,2,2,1) 65%, rgba(2,2,2,1) 100%)",
        }}
      />

      {/* Logo + Enter */}
      <div ref={logoRef} className="absolute z-30 opacity-0 flex flex-col items-center"
        style={{ bottom: "clamp(40px, 8vw, 80px)", gap: "clamp(16px, 3vw, 32px)" }}>
        <img src="/logo.webp" alt="ADDA" className="w-auto"
          style={{ height: "clamp(48px, 8vw, 100px)" }} />
        <p className="text-white/20 uppercase tracking-[0.35em] text-center"
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(8px, 0.9vw, 11px)" }}>
          Architecture &amp; Design
        </p>
        <div ref={enterRef} className="opacity-0">
          <button onClick={() => doExitRef.current()}
            className="text-white/30 hover:text-white/80 border border-white/10 hover:border-white/30 uppercase tracking-[.3em] transition-all duration-500"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 1.1vw, 12px)", padding: "clamp(6px, 1vw, 12px) clamp(20px, 3vw, 36px)", background: "transparent" }}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
