"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Waves from "@/components/Waves";
import "@fontsource/caveat";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRowRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const leftTextRef = useRef<HTMLSpanElement>(null);
  const rightTextRef = useRef<HTMLSpanElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const logoFlyRef = useRef<HTMLDivElement>(null);       // 居中 → 左移的容器
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoLabelRef = useRef<HTMLParagraphElement>(null);
  const photoTrackRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const photoGlareRef = useRef<HTMLDivElement>(null);
  const photoRuleRef = useRef<HTMLDivElement>(null);
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
      exitTimeline.current.to(revealRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" });
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.55, ease: "power3.inOut" }, "-=0.2");
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // ═══ Phase 1: Counter ═══
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100,
      duration: 1.6,
      ease: "none",
      snap: { value: 1 },
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(counterObj.value);
      },
    });
    tl.fromTo(
      [leftTextRef.current, rightTextRef.current],
      { opacity: 0.15 },
      { opacity: 0.5, duration: 0.5, ease: "power2.out" },
      0
    );
    tl.fromTo(
      [leftLineRef.current, rightLineRef.current],
      { scaleY: 0 },
      { scaleY: 1, duration: 0.7, ease: "power3.out" },
      0
    );
    tl.to(
      [leftTextRef.current, rightTextRef.current],
      { opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.25"
    );

    // ═══ Phase 2: Counter fades ═══
    tl.to(counterRowRef.current, { opacity: 0, duration: 0.4, ease: "power3.in" });
    tl.set(counterRowRef.current, { display: "none" });
    tl.set(revealRef.current, { display: "flex" });

    // ═══ Phase 3: Logo CENTER reveal ═══
    // logoFlyRef 初始 CSS: absolute, top:50%, left:50%, translate(-50%,-50%)
    tl.fromTo(
      logoImgRef.current,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 1.0, ease: "power4.out" }
    );
    tl.fromTo(
      logoLabelRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.35"
    );

    // Brief pause at center
    tl.to({}, { duration: 0.35 });

    // ═══ Phase 4: Logo slides left via CSS left transition ═══
    const isMobile = window.innerWidth < 768;
    const logoCenter = logoFlyRef.current;
    const logoLeft = document.querySelector(".preloader-logo-left") as HTMLElement;

    if (logoCenter && logoLeft && !isMobile) {
      // 初始居中（absolute）
      logoCenter.style.transition = "none";
      logoCenter.style.left = "50%";
      logoCenter.style.top = "50%";
      logoCenter.style.transform = "translate(-50%, -50%)";

      tl.add(() => {
        const leftRect = logoLeft.getBoundingClientRect();
        const targetCenterX = leftRect.left + leftRect.width / 2;
        const containerRect = logoCenter.parentElement!.getBoundingClientRect();
        const targetPct = ((targetCenterX - containerRect.left) / containerRect.width) * 100;
        void logoCenter.offsetWidth;
        logoCenter.style.transition = "left 1.0s cubic-bezier(0.33, 1, 0.68, 1)";
        logoCenter.style.left = `${targetPct}%`;
      });

      tl.to(logoCenter, { opacity: 0, duration: 0.01 }, "+=1.05");
      tl.set(logoLeft, { opacity: 1 }, "-=0.01");
      tl.set(logoCenter, { display: "none" });
    } else if (isMobile && logoCenter) {
      // 手机端：logo 保持居中可见
      logoCenter.style.transition = "none";
      logoCenter.style.left = "50%";
      logoCenter.style.top = "50%";
      logoCenter.style.transform = "translate(-50%, -50%)";
    }

    // ═══ Photo reveal: 相纸随风飘入 + 胶片显影 ═══
    const photoImg = photoImgRef.current;
    const vignetteEl = document.createElement("div");
    vignetteEl.className = "absolute inset-0 z-20 pointer-events-none";
    vignetteEl.style.background = "radial-gradient(ellipse at center, transparent 40%, rgba(6,6,6,0.7) 100%)";
    photoTrackRef.current?.appendChild(vignetteEl);

    // 初始：飘入起点（右上方，微旋，半透明）
    gsap.set(photoTrackRef.current, { x: "30%", y: "-8%", rotation: 8, opacity: 0 });
    // 胶片显影初始
    gsap.set(photoImg, {
      filter: "brightness(2.5) contrast(0.25) saturate(0) sepia(1) hue-rotate(-10deg)",
    });
    gsap.set(vignetteEl, { opacity: 1 });

    // Phase A: 飘入 — 像纸张随风飘来，带轻微弧线和旋转
    tl.to(photoTrackRef.current, {
      x: "0%",
      y: "0%",
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    }, "photo");

    // Phase B: 轻微回荡（纸张落定的惯性）
    tl.to(photoTrackRef.current, {
      rotation: -1.5,
      duration: 0.35,
      ease: "power1.inOut",
    });
    tl.to(photoTrackRef.current, {
      rotation: 0.6,
      duration: 0.3,
      ease: "power1.inOut",
    });
    tl.to(photoTrackRef.current, {
      rotation: 0,
      duration: 0.25,
      ease: "power2.out",
    });

    // 显影过程：棕褐 → 色彩浮现
    tl.to(photoImg, {
      filter: "brightness(1.1) contrast(0.9) saturate(0.6) sepia(0.3)",
      duration: 0.8,
      ease: "power2.inOut",
    }, "photo+=0.7");

    // 定影
    tl.to(photoImg, {
      filter: "brightness(1) contrast(1) saturate(1) sepia(0)",
      duration: 0.9,
      ease: "power2.out",
    });

    // 暗角定影后淡化为跟随光标的聚光效果
    tl.to(vignetteEl, {
      opacity: 0.55,
      duration: 1.0,
      ease: "power2.out",
    }, "-=0.7");

    tl.fromTo(
      photoRuleRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.65, ease: "power3.out" },
      "-=0.85"
    );

    // ═══ Phase 5: Enter ═══
    tl.fromTo(
      enterRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
      "-=0.1"
    );

    // ── 3D Tilt + 相纸反光 ──
    const photoEl = photoTrackRef.current;
    const glareEl = photoGlareRef.current;
    let tiltRaf: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!photoEl) return;
      cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        const rect = photoEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        // 3D tilt
        gsap.to(photoEl, {
          rotateY: dx * 4,
          rotateX: -dy * 4,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });

        // 反光跟随
        if (glareEl) {
          const glareX = 50 + dx * 50;
          const glareY = 50 + dy * 40;
          const angle = 15 - dx * 20;
          const mainGlare = `linear-gradient(
            ${105 + angle}deg,
            transparent 0%,
            transparent ${glareX - 12}%,
            rgba(255,255,255,0) ${glareX - 6}%,
            rgba(255,255,255,0.18) ${glareX - 2}%,
            rgba(255,255,255,0.25) ${glareX}%,
            rgba(255,255,255,0.12) ${glareX + 4}%,
            transparent ${glareX + 10}%,
            transparent 100%
          )`;
          const softGlow = `radial-gradient(
            ellipse at ${glareX}% ${glareY}%,
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.03) 40%,
            transparent 70%
          )`;
          glareEl.style.background = `${mainGlare}, ${softGlow}`;
        }

        // 整体暗角随光标移动（聚光灯效果）
        if (vignetteEl) {
          const vx = 50 + dx * 30;
          const vy = 50 + dy * 30;
          vignetteEl.style.background = `radial-gradient(
            ellipse at ${vx}% ${vy}%,
            transparent 25%,
            rgba(6,6,6,0.3) 65%,
            rgba(6,6,6,0.65) 100%
          )`;
        }
      });
    };
    const handleMouseLeave = () => {
      if (!photoEl) return;
      gsap.to(photoEl, { rotateY: 0, rotateX: 0, duration: 1.0, ease: "power3.out", overwrite: "auto" });
      if (glareEl) {
        glareEl.style.background = `
          linear-gradient(110deg, transparent 0%, transparent 55%, rgba(255,255,255,0) 58%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.06) 64%, transparent 68%, transparent 100%),
          radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)
        `;
      }
      if (vignetteEl) {
        vignetteEl.style.background = "radial-gradient(ellipse at center, transparent 40%, rgba(6,6,6,0.7) 100%)";
      }
    };
    revealRef.current?.addEventListener("mousemove", handleMouseMove);
    revealRef.current?.addEventListener("mouseleave", handleMouseLeave);

    // Enter hover
    const enterEl = enterRef.current?.querySelector("button");
    if (enterEl) {
      enterEl.addEventListener("mouseenter", () => gsap.to(enterEl, { scale: 1.04, duration: 0.35, ease: "power2.out" }));
      enterEl.addEventListener("mouseleave", () => gsap.to(enterEl, { scale: 1, duration: 0.35, ease: "power2.out" }));
      enterEl.addEventListener("mousedown", () => gsap.to(enterEl, { scale: 0.96, duration: 0.08, ease: "power2.out" }));
      enterEl.addEventListener("mouseup", () => gsap.to(enterEl, { scale: 1.04, duration: 0.15, ease: "power2.out" }));
    }

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (counterRowRef.current) { counterRowRef.current.style.opacity = "0"; counterRowRef.current.style.display = "none"; }
        if (revealRef.current) revealRef.current.style.display = "flex";
        if (logoImgRef.current) logoImgRef.current.style.opacity = "1";
        // 桌面端：logo 左移后切换显示
        if (!isMobile && logoFlyRef.current) {
          logoFlyRef.current.style.opacity = "0";
          const logoLeftEl = document.querySelector(".preloader-logo-left") as HTMLElement;
          if (logoLeftEl) logoLeftEl.style.opacity = "1";
        }
        if (photoTrackRef.current) { photoTrackRef.current.style.opacity = "1"; photoTrackRef.current.style.transform = "translateX(0)"; }
        if (photoImgRef.current) { photoImgRef.current.style.filter = "none"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 10000);
  }, []);

  return (
    <>
    <style>{`
      @media (max-width: 767px) {
        .preloader-logo-mobile { position: relative !important; top: auto !important; left: auto !important; transform: none !important; margin-bottom: clamp(24px, 6vw, 48px); z-index: 10 !important; }
        .preloader-reveal-mobile { flex-direction: column !important; align-items: center !important; }
        .preloader-photo-mobile { max-width: 92vw !important; }
      }
    `}</style>
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#060606] flex items-center justify-center" style={{ minHeight: "100dvh" }} suppressHydrationWarning>
      <div className="relative w-full grid" style={{ minHeight: "100dvh", placeItems: "center" }}>

        {/* Waves */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Waves
            lineColor="rgba(255,255,255,0.16)" backgroundColor="transparent"
            waveSpeedX={0.006} waveSpeedY={0.003} waveAmpX={16} waveAmpY={8}
            xGap={18} yGap={42} friction={0.95} tension={0.003} maxCursorMove={50}
          />
        </div>

        {/* Phase 1: Counter */}
        <div ref={counterRowRef} className="relative z-10 flex flex-col md:flex-row items-center justify-center px-4"
          style={{ gap: "clamp(6px, 2vw, 32px)" }}>
          <span ref={leftTextRef} className="text-[#777] uppercase leading-tight text-center"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 2.2vw, 42px)", letterSpacing: "clamp(0.12em, 0.28vw, 0.35em)" }}>
            Thinking Things
          </span>
          <div className="flex items-center">
            <div ref={leftLineRef} className="bg-white/[0.06] hidden md:block"
              style={{ width: "clamp(1px, 0.3vw, 2px)", height: "clamp(18px, 4.5vw, 48px)", marginRight: "clamp(8px, 1.5vw, 24px)" }} />
            <span ref={counterRef} className="text-white/90 tabular-nums text-center leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 11vw, 128px)", minWidth: "clamp(3.5rem, 11vw, 13rem)", display: "inline-block" }}>
              0
            </span>
            <div ref={rightLineRef} className="bg-white/[0.06] hidden md:block"
              style={{ width: "clamp(1px, 0.3vw, 2px)", height: "clamp(18px, 4.5vw, 48px)", marginLeft: "clamp(8px, 1.5vw, 24px)" }} />
          </div>
          <span ref={rightTextRef} className="text-[#777] uppercase leading-tight text-center"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 2.2vw, 42px)", letterSpacing: "clamp(0.12em, 0.28vw, 0.35em)" }}>
            Into Existence
          </span>
        </div>

        {/* Phase 2: Reveal layout */}
        <div ref={revealRef} className="absolute inset-0 z-10 flex-col items-center justify-center" style={{ display: "none" }}>
          <div className="flex flex-col md:flex-row items-center w-full max-w-[1400px] mx-auto relative preloader-reveal-mobile"
            style={{ padding: "clamp(20px, 4vw, 64px)", gap: "clamp(40px, 7vw, 120px)" }}>

            {/* Logo: starts ABSOLUTE center, GSAP moves to natural left position */}
            <div
              ref={logoFlyRef}
              className="flex flex-col items-center md:items-start preloader-logo-mobile"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                flex: "0 0 auto",
                minWidth: "clamp(100px, 16vw, 240px)",
                zIndex: 20,
              }}
              // mobile: inline style triggers absolute; we override via media query in JS
              data-mobile="true"
            >
              <img ref={logoImgRef} src="/logo.webp" alt="ADDA" className="w-auto select-none opacity-0"
                style={{ height: "clamp(52px, 9vw, 160px)", filter: "brightness(1.05)" }} />
              <p ref={logoLabelRef} className="text-white/[0.10] uppercase mt-4 tracking-[0.4em] opacity-0"
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(8px, 0.8vw, 10px)" }}>
                Architecture &amp; Design
              </p>
            </div>

            {/* Left logo — in flex flow (desktop), hidden initially, fades in */}
            <div className="hidden md:flex flex-col items-start preloader-logo-left opacity-0"
              style={{ flex: "0 0 auto", minWidth: "clamp(100px, 16vw, 240px)" }}>
              <img src="/logo.webp" alt="ADDA" className="w-auto select-none"
                style={{ height: "clamp(52px, 9vw, 160px)", filter: "brightness(1.05)" }} />
              <p className="text-white/[0.10] uppercase mt-4 tracking-[0.4em]"
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(8px, 0.8vw, 10px)" }}>
                Architecture &amp; Design
              </p>
            </div>

            {/* Rule: mobile 隐藏 */}
            <div ref={photoRuleRef} className="hidden md:block"
              style={{ width: "1px", height: "clamp(120px, 28vw, 360px)", background: "rgba(255,255,255,0.06)", transformOrigin: "top", flexShrink: 0 }} />

            {/* Photo — mobile 全宽 */}
            <div className="overflow-visible w-full" style={{ flex: "1 1 auto", maxWidth: "clamp(280px, 92vw, 880px)", perspective: "1200px" }}>
              <div ref={photoTrackRef} style={{ opacity: 0, transformStyle: "preserve-3d", position: "relative" }}>
                {/* 相纸底 — 带纹理质感 */}
                <div style={{
                  padding: "clamp(14px, 2vw, 32px) clamp(14px, 2vw, 32px) clamp(28px, 4vw, 56px)",
                  background: "#f3ede3",
                  boxShadow: [
                    "0 2px 24px rgba(0,0,0,0.4)",
                    "0 0 0 1px rgba(0,0,0,0.06)",
                    "inset 0 0 0 1px rgba(255,255,255,0.6)",
                    "inset 0 0 60px rgba(0,0,0,0.04)",
                  ].join(", "),
                  position: "relative",
                }}>
                  {/* 纸张纹理 overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "120px 120px",
                    opacity: 0.8,
                    mixBlendMode: "multiply",
                  }} />
                  {/* 纸张边缘微暗 */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.06) 100%)",
                  }} />
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img ref={photoImgRef} src="/team-photo.webp" alt="ADDA Team"
                      className="w-full h-auto block" loading="lazy" />
                    {/* 相纸反光层 */}
                    <div
                      ref={photoGlareRef}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(110deg, transparent 0%, transparent 55%, rgba(255,255,255,0) 58%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.06) 64%, transparent 68%, transparent 100%), radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)",
                        mixBlendMode: "soft-light",
                      }}
                    />
                  </div>
                  {/* 相纸底部签名 */}
                  <p style={{
                    fontFamily: "'Caveat', 'Segoe Script', 'Apple Chancery', cursive",
                    fontSize: "clamp(16px, 2vw, 26px)",
                    color: "#5a5250",
                    textAlign: "right",
                    marginTop: "clamp(12px, 1.5vw, 20px)",
                    lineHeight: 1.3,
                    transform: "rotate(-2deg)",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    fontVariationSettings: "'wght' 500",
                  }}>
                    ADDA Studio<br />est. 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enter */}
          <div ref={enterRef} className="absolute opacity-0" style={{ bottom: "clamp(28px, 5vw, 56px)" }}>
            <button onClick={() => doExitRef.current()}
              className="text-white/25 hover:text-white/90 border border-white/[0.06] hover:border-white/25 uppercase tracking-[.4em] transition-colors duration-500 select-none"
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 1vw, 11px)", padding: "clamp(7px, 1vw, 14px) clamp(28px, 4vw, 56px)", background: "transparent" }}>
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
