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
  const tearTopRef = useRef<HTMLDivElement>(null);
  const tearBotRef = useRef<HTMLDivElement>(null);
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

    // ── Exit：撕纸式离开 ──
    const doExit = () => {
      if (exitTimeline.current) return;
      exitTimeline.current = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        },
      });
      // logo + enter 向上飘走
      exitTimeline.current.to([logoRef.current, enterRef.current], {
        y: -40, opacity: 0, duration: 0.45, ease: "power2.in",
      });
      // 背景暗去
      exitTimeline.current.to(containerRef.current, {
        opacity: 0, duration: 0.5, ease: "power3.inOut",
      }, "-=0.25");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // ═══ Phase 1: Counter (0 → 100) ═══
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100, duration: 1.5, ease: "none",
      snap: { value: 1 },
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(counterObj.value);
      },
    });
    tl.fromTo([leftTextRef.current, rightTextRef.current],
      { opacity: 0.2 }, { opacity: 0.5, duration: 0.5, ease: "power2.out" }, 0);
    tl.fromTo([leftLineRef.current, rightLineRef.current],
      { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power3.out" }, 0);
    tl.to([leftTextRef.current, rightTextRef.current],
      { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.25");

    // ═══ Phase 2: 撕纸 ═══
    const label = "tear";

    // 2a — 蓄力：画面抖动
    tl.to(counterRowRef.current, { x: -3, duration: 0.06, ease: "none" }, label);
    tl.to(counterRowRef.current, { x: 4, duration: 0.06, ease: "none" });
    tl.to(counterRowRef.current, { x: -2, duration: 0.05, ease: "none" });
    tl.to(counterRowRef.current, { x: 0, duration: 0.05, ease: "none" });

    // 2b — 裂缝出现，计数器内容暗淡
    tl.to(counterRowRef.current, { opacity: 0.3, duration: 0.2, ease: "power2.in" });

    // 2c — 撕裂！纸面裂开
    tl.to(tearTopRef.current, {
      y: "-105%",
      rotation: -3,
      duration: 0.9,
      ease: "power3.in",
    }, `${label}+=0.25`);

    tl.to(tearBotRef.current, {
      y: "105%",
      rotation: 3,
      duration: 0.9,
      ease: "power3.in",
    }, `${label}+=0.25`);

    // 2d — 计数器消失
    tl.to(counterRowRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, `${label}+=0.15`);
    tl.set(counterRowRef.current, { display: "none" });

    // 2e — Logo 从裂缝中浮现
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.88, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "power4.out" },
      `${label}+=0.35`
    );

    // ═══ Phase 3: Enter ═══
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
      "-=0.1"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (counterRowRef.current) { counterRowRef.current.style.opacity = "0"; counterRowRef.current.style.display = "none"; }
        if (tearTopRef.current) tearTopRef.current.style.transform = "translateY(-100%)";
        if (tearBotRef.current) tearBotRef.current.style.transform = "translateY(100%)";
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "scale(1)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 7000);
  }, []);

  // 撕纸锯齿 — 沿面板底边/顶边分布
  const tearEdge = (() => {
    const segs = 8;
    const step = 100 / segs;
    let path = "";
    for (let i = 0; i <= segs; i++) {
      const x = i * step;
      // jitter around 100% (bottom edge of top panel)
      const y = 100 + (Math.sin(i * 1.7) * 6 + Math.sin(i * 3.1) * 4);
      path += `${x}% ${y}%, `;
    }
    return path.slice(0, -2);
  })();

  // 下方面板的撕纸锯齿 — 沿面板顶边
  const tearEdgeBottom = (() => {
    const segs = 8;
    const step = 100 / segs;
    let path = "";
    for (let i = 0; i <= segs; i++) {
      const x = i * step;
      const y = 0 + (Math.sin(i * 1.7) * 6 + Math.sin(i * 3.1) * 4);
      path += `${x}% ${y}%, `;
    }
    return path.slice(0, -2);
  })();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#111] flex items-center justify-center"
      style={{ height: "100dvh" }}
      suppressHydrationWarning
    >
      <div className="relative w-full h-full grid" style={{ placeItems: "center" }}>

        {/* ── 撕纸面板（上） ── */}
        <div
          ref={tearTopRef}
          className="absolute inset-x-0 z-20"
          style={{
            top: 0,
            height: "50%",
            background: "#1a1a1a url(/paper-overlay.webp) center/cover no-repeat",
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${tearEdge}, 0% 100%)`, // tearEdge at bottom of top panel
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        />

        {/* ── 撕纸面板（下） ── */}
        <div
          ref={tearBotRef}
          className="absolute inset-x-0 z-20"
          style={{
            bottom: 0,
            height: "50%",
            background: "#1a1a1a",
            clipPath: `polygon(0 0, ${tearEdgeBottom}, 100% 0, 100% 100%, 0 100%)`, // tearEdge at top of bottom panel
            boxShadow: "0 -4px 16px rgba(0,0,0,0.5)",
          }}
        />

        {/* Counter */}
        <div ref={counterRowRef} className="relative z-30 flex flex-col md:flex-row items-center justify-center gap-y-3 md:gap-y-0 px-4"
          style={{ gap: "clamp(6px, 2vw, 32px)" }}>
          <span ref={leftTextRef} className="text-[#888] uppercase leading-tight opacity-0 text-center"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(11px, 2.5vw, 48px)", letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)" }}>
            Thinking Things
          </span>
          <div className="flex items-center">
            <div ref={leftLineRef} className="bg-white/10 hidden md:block"
              style={{ width: "clamp(1.5px, 0.4vw, 3px)", height: "clamp(20px, 5vw, 56px)", marginRight: "clamp(8px, 1.5vw, 24px)" }} />
            <span ref={counterRef} className="text-white tabular-nums text-center leading-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 10vw, 108px)", minWidth: "clamp(3rem, 10vw, 11rem)", display: "inline-block" }}>
              0
            </span>
            <div ref={rightLineRef} className="bg-white/10 hidden md:block"
              style={{ width: "clamp(1.5px, 0.4vw, 3px)", height: "clamp(20px, 5vw, 56px)", marginLeft: "clamp(8px, 1.5vw, 24px)" }} />
          </div>
          <span ref={rightTextRef} className="text-[#888] uppercase leading-tight opacity-0 text-center"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(11px, 2.5vw, 48px)", letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)" }}>
            Into Existence
          </span>
        </div>

        {/* Waves */}
        <div className="absolute inset-0 opacity-60" style={{ pointerEvents: "none" }}>
          <Waves
            lineColor="rgba(255,255,255,0.30)" backgroundColor="transparent"
            waveSpeedX={0.01} waveSpeedY={0.004} waveAmpX={24} waveAmpY={12}
            xGap={14} yGap={36} friction={0.93} tension={0.004} maxCursorMove={80}
          />
        </div>

        {/* Logo + Enter */}
        <div ref={logoRef} className="absolute inset-0 opacity-0 flex flex-col items-center justify-center z-20"
          style={{ gap: "clamp(16px, 3vw, 32px)" }}>
          <img src="/logo.webp" alt="ADDA" className="w-auto"
            style={{ height: "clamp(64px, 12vw, 144px)" }} />
          <div ref={enterRef} className="opacity-0">
            <button
              onClick={() => doExitRef.current()}
              className="text-white/50 hover:text-white border border-white/20 hover:border-white/40 uppercase tracking-[.3em] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 1.2vw, 12px)", padding: "clamp(6px, 1vw, 12px) clamp(16px, 3vw, 32px)" }}>
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
