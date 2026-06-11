"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
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
      exitTimeline.current.to([logoRef.current, enterRef.current, maskRef.current], { opacity: 0, duration: 0.4, ease: "power2.in" });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.2");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // ═══ 光斑形状缓缓亮起 ═══
    // maskRef 覆盖在照片上方，用 radial-gradient 遮罩：中心光斑处透明，其余黑色
    // 初始：全黑，光斑大小为 0
    gsap.set(maskRef.current, {
      background: "radial-gradient(ellipse 0% 0% at 25% 35%, transparent 0%, black 0%)",
    });

    // 光斑缓缓亮起 — 非常慢，像暗房显影
    tl.to(maskRef.current, {
      duration: 6.0,
      ease: "none",
      onUpdate: function() {
        const p = this.progress();
        // 前 60% 时间光斑从小到大，后 40% 保持大小但更亮
        const size = p < 0.6 ? p / 0.6 * 55 : 55;
        const fade = p < 0.4 ? p / 0.4 : 1;
        if (maskRef.current) {
          maskRef.current.style.background = `radial-gradient(ellipse ${size}% ${size * 0.7}% at 25% 35%, transparent 0%, rgba(0,0,0,${(1 - fade * 0.85).toFixed(2)}) 100%)`;
        }
      },
    });

    // 光斑完全打开后：停顿，再淡出遮罩
    tl.to({}, { duration: 0.8 });
    tl.to(maskRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.in",
    });

    // ═══ Logo + Enter ═══
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
        if (maskRef.current) { maskRef.current.style.opacity = "0"; }
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 8000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* 照片层 */}
      <div ref={photoRef} className="absolute inset-0">
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 遮罩层：光斑形状渐变揭示 */}
      <div ref={maskRef} className="absolute inset-0 z-10" />

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
