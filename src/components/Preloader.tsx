"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Waves from "@/components/Waves";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRowRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const leftTextRef = useRef<HTMLSpanElement>(null);
  const rightTextRef = useRef<HTMLSpanElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const exitTimeline = useRef<any>(null);
  const doExitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (started.current) return;
    // 后台页面跳过倒计时
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
      exitTimeline.current.to([logoRef.current, enterRef.current], { opacity: 0, duration: 0.4 });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.2");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline();

    // ═══ Phase 1: Counter (0 → 100) ═══
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100,
      duration: 1.5,
      ease: "none",
      snap: { value: 1 },
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(counterObj.value);
      },
    });

    // 文字渐现
    tl.fromTo([leftTextRef.current, rightTextRef.current], { opacity: 0.2 }, { opacity: 0.5, duration: 0.5, ease: "power2.out" }, 0);
    tl.fromTo([leftLineRef.current, rightLineRef.current], { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power3.out" }, 0);
    tl.to([leftTextRef.current, rightTextRef.current], { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.25");

    // ═══ Phase 2: 爆发过渡 ═══
    // 计数器放大 → 文字向两侧飞出
    tl.to(counterRef.current, { scale: 1.3, duration: 0.25, ease: "power2.in" });
    tl.to([leftTextRef.current, rightTextRef.current], { scale: 0.9, opacity: 0.5, duration: 0.25, ease: "power2.in" }, "-=0.25");

    // 爆发：计数器缩小消失，文字飞远
    tl.to(counterRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" }, "burst");
    tl.to(leftTextRef.current, { x: -30, opacity: 0, duration: 0.4, ease: "power3.in" }, "burst");
    tl.to(rightTextRef.current, { x: 30, opacity: 0, duration: 0.4, ease: "power3.in" }, "burst");
    tl.to([leftLineRef.current, rightLineRef.current], { scaleY: 3, opacity: 0, duration: 0.35, ease: "power3.in" }, "burst");

    // Logo 从中心弹出（弹簧感）
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.3, y: 0 },
      { opacity: 1, scale: 1.06, y: 0, duration: 0.5, ease: "power4.out" },
      "burst+=0.15"
    );
    // 弹簧回弹
    tl.to(logoRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });

    // ═══ Phase 3: Enter ═══
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.1"
    );

    // Fallback: 如果 5 秒后动画还没完成，强制显示 Enter 按钮
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (counterRowRef.current) counterRowRef.current.style.opacity = "0";
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "scale(1)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 6000);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#040404] flex items-center justify-center" style={{ height: "100dvh" }}
      suppressHydrationWarning
    >
      <div className="relative w-full h-full grid" style={{ placeItems: "center" }}>
        {/* Counter — center of screen, fades out */}
        <div ref={counterRowRef} className="flex flex-col md:flex-row items-center justify-center gap-y-3 md:gap-y-0 px-4"
          style={{ gap: "clamp(6px, 2vw, 32px)" }}>
          <span
            ref={leftTextRef}
            className="text-[#888] uppercase leading-tight opacity-30 text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(11px, 2.5vw, 48px)",
              letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)",
            }}
          >
            Thinking Things
          </span>

          <div className="flex items-center">
            <div
              ref={leftLineRef}
              className="bg-white/10 hidden md:block"
              style={{ width: "clamp(1.5px, 0.4vw, 3px)", height: "clamp(20px, 5vw, 56px)", marginRight: "clamp(8px, 1.5vw, 24px)" }}
            />
            <span
              ref={counterRef}
              className="text-white tabular-nums text-center leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 10vw, 108px)",
                minWidth: "clamp(3rem, 10vw, 11rem)",
                display: "inline-block",
                transform: "translateY(-12px)",
              }}
            >
              0
            </span>
            <div
              ref={rightLineRef}
              className="bg-white/10 hidden md:block"
              style={{ width: "clamp(1.5px, 0.4vw, 3px)", height: "clamp(20px, 5vw, 56px)", marginLeft: "clamp(8px, 1.5vw, 24px)" }}
            />
          </div>

          <span
            ref={rightTextRef}
            className="text-[#888] uppercase leading-tight opacity-30 text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(11px, 2.5vw, 48px)",
              letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)",
            }}
          >
            Into Existence
          </span>
        </div>

        {/* Waves 背景 */}
        <div className="absolute inset-0 opacity-70" style={{ pointerEvents: "none" }}>
          <Waves
            lineColor="rgba(255,255,255,0.35)"
            backgroundColor="transparent"
            waveSpeedX={0.01}
            waveSpeedY={0.004}
            waveAmpX={24}
            waveAmpY={12}
            xGap={14}
            yGap={36}
            friction={0.93}
            tension={0.004}
            maxCursorMove={80}
          />
        </div>

        {/* Logo + Enter button — same center position */}
        <div ref={logoRef} className="absolute inset-0 opacity-0 flex flex-col items-center justify-center"
          style={{ gap: "clamp(16px, 3vw, 32px)" }}>
          <img src="/logo.webp" alt="ADDA" className="w-auto"
            style={{ height: "clamp(64px, 12vw, 144px)" }} />
          <div ref={enterRef} className="opacity-0">
            <button
              onClick={() => doExitRef.current()}
              className="text-white/50 hover:text-white border border-white/20 hover:border-white/40 uppercase tracking-[.3em] transition-all duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(10px, 1.2vw, 12px)",
                padding: "clamp(6px, 1vw, 12px) clamp(16px, 3vw, 32px)",
              }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
