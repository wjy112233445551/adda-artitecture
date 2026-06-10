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
  const revealRef = useRef<HTMLDivElement>(null);       // 第二阶段的整体容器
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
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

    // ── Exit 动画 ──
    const doExit = () => {
      if (exitTimeline.current) return;
      exitTimeline.current = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        },
      });
      exitTimeline.current.to(revealRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.7, ease: "power3.inOut" }, "-=0.3");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // ══════════ Phase 1: Counter ══════════
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100,
      duration: 1.8,
      ease: "none",
      snap: { value: 1 },
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(counterObj.value);
      },
    });

    tl.fromTo(
      [leftTextRef.current, rightTextRef.current],
      { opacity: 0.2 },
      { opacity: 0.5, duration: 0.6, ease: "power2.out" },
      0
    );
    tl.fromTo(
      [leftLineRef.current, rightLineRef.current],
      { scaleY: 0 },
      { scaleY: 1, duration: 0.8, ease: "power3.out" },
      0
    );
    tl.to(
      [leftTextRef.current, rightTextRef.current],
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );

    // ══════════ Phase 2: Counter fades out ══════════
    tl.to(counterRowRef.current, { opacity: 0, duration: 0.5, ease: "power3.in" });
    tl.set(counterRowRef.current, { display: "none" });

    // ══════════ Phase 3: Logo center → left, Photo reveals right ══════════
    // 整体容器出现
    tl.set(revealRef.current, { display: "flex", opacity: 1 });

    // Logo: 从中间放大出现
    tl.fromTo(
      logoWrapRef.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );

    // 同时：照片用 clip-path 从左到右遮罩揭示
    tl.fromTo(
      photoWrapRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" },
      "-=0.7"
    );
    tl.fromTo(
      photoImgRef.current,
      { scale: 1.12 },
      { scale: 1, duration: 1.1, ease: "power3.out" },
      "-=1.1"
    );

    // ══════════ Phase 4: Enter ══════════
    tl.fromTo(
      enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.2"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (counterRowRef.current) { counterRowRef.current.style.opacity = "0"; counterRowRef.current.style.display = "none"; }
        if (revealRef.current) revealRef.current.style.opacity = "1";
        if (logoWrapRef.current) { logoWrapRef.current.style.opacity = "1"; logoWrapRef.current.style.transform = "scale(1)"; }
        if (photoWrapRef.current) photoWrapRef.current.style.clipPath = "inset(0 0% 0 0)";
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 7000);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#040404] flex items-center justify-center"
      suppressHydrationWarning
    >
      <div className="relative w-full h-full grid" style={{ placeItems: "center" }}>

        {/* ═══ Phase 1: Counter ═══ */}
        <div
          ref={counterRowRef}
          className="flex flex-col md:flex-row items-center justify-center px-4"
          style={{ gap: "clamp(6px, 2vw, 32px)" }}
        >
          <span
            ref={leftTextRef}
            className="text-[#888] uppercase leading-tight opacity-0 text-center"
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
            className="text-[#888] uppercase leading-tight opacity-0 text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(11px, 2.5vw, 48px)",
              letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)",
            }}
          >
            Into Existence
          </span>
        </div>

        {/* ═══ Phase 2: Logo + Photo Split ═══ */}
        <div
          ref={revealRef}
          className="absolute inset-0 hidden flex-col justify-center"
          style={{ display: "none" }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center w-full h-full px-6 md:px-16"
            style={{ gap: "clamp(24px, 5vw, 80px)" }}
          >
            {/* Left: Logo */}
            <div
              ref={logoWrapRef}
              className="flex flex-col items-center md:items-start opacity-0"
              style={{ flex: "0 0 auto" }}
            >
              <img
                ref={logoImgRef}
                src="/logo.webp"
                alt="ADDA"
                className="w-auto"
                style={{ height: "clamp(48px, 8vw, 120px)" }}
              />
              <p
                className="text-white/30 uppercase mt-3 md:mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(9px, 1vw, 12px)",
                  letterSpacing: "0.3em",
                }}
              >
                Architecture & Design
              </p>
            </div>

            {/* Right: Team Photo (clip-path mask reveal) */}
            <div
              ref={photoWrapRef}
              className="overflow-hidden"
              style={{
                flex: "1 1 auto",
                maxWidth: "clamp(280px, 55vw, 800px)",
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              <img
                ref={photoImgRef}
                src="/team-photo.webp"
                alt="ADDA Team"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Enter button */}
          <div
            ref={enterRef}
            className="absolute opacity-0"
            style={{ bottom: "clamp(32px, 6vw, 64px)", left: "50%", transform: "translateX(-50%)" }}
          >
            <button
              onClick={() => doExitRef.current()}
              className="text-white/40 hover:text-white border border-white/15 hover:border-white/40 uppercase tracking-[.3em] transition-all duration-500"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(10px, 1.1vw, 12px)",
                padding: "clamp(6px, 1vw, 12px) clamp(20px, 3vw, 36px)",
              }}
            >
              Enter
            </button>
          </div>
        </div>

        {/* Waves 背景 — 贯穿始终 */}
        <div className="absolute inset-0 opacity-60" style={{ pointerEvents: "none" }}>
          <Waves
            lineColor="rgba(255,255,255,0.30)"
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
      </div>
    </div>
  );
}
