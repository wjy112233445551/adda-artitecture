"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const exitTimeline = useRef<gsap.core.Timeline | null>(null);
  const doExitRef = useRef<() => void>(() => {});
  const particlesRef = useRef<HTMLDivElement[]>([]);

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
      exitTimeline.current.to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power3.inOut" });
    };
    doExitRef.current = doExit;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // 球初始：右侧屏幕外
    gsap.set(ballRef.current, {
      x: "110vw", y: "25vh",
      width: "clamp(10px, 1.8vw, 20px)",
      height: "clamp(10px, 1.8vw, 20px)",
      borderRadius: "50%",
      background: "white",
      boxShadow: "0 0 16px rgba(255,255,255,0.5), 0 0 32px rgba(255,255,255,0.2)",
    });

    // ── 弹跳序列：3次落地，squash & stretch ──

    // 弹跳 1：远弹
    tl.to(ballRef.current, {
      x: "35vw", y: "58vh", duration: 0.65, ease: "power2.in",
    });
    tl.to(ballRef.current, { scaleX: 1.45, scaleY: 0.55, duration: 0.05 }, "-=0.03");
    tl.to(ballRef.current, { scaleX: 0.65, scaleY: 1.45, duration: 0.08 });
    tl.to(ballRef.current, { scaleX: 1, scaleY: 1, duration: 0.25, ease: "elastic.out(1,0.3)" });

    // 弹跳 2：中弹
    tl.to(ballRef.current, {
      x: "50vw", y: "20vh", duration: 0.55, ease: "power2.out",
    });
    tl.to(ballRef.current, {
      x: "42vw", y: "52vh", duration: 0.5, ease: "power2.in",
    });
    tl.to(ballRef.current, { scaleX: 1.35, scaleY: 0.65, duration: 0.04 }, "-=0.02");
    tl.to(ballRef.current, { scaleX: 0.7, scaleY: 1.35, duration: 0.07 });
    tl.to(ballRef.current, { scaleX: 1, scaleY: 1, duration: 0.2, ease: "elastic.out(1,0.3)" });

    // 弹跳 3：精准落在三角光束中心
    tl.to(ballRef.current, {
      x: "52vw", y: "42vh", duration: 0.5, ease: "power2.out",
    });
    tl.to(ballRef.current, {
      x: "50vw", y: "48vh", duration: 0.4, ease: "power2.in",
    });
    tl.to(ballRef.current, { scaleX: 1.5, scaleY: 0.5, duration: 0.04 }, "-=0.02");

    // ═══ 落地溅射 ═══
    const splashLabel = "splash";
    tl.to(ballRef.current, {
      scaleX: 0, scaleY: 0, opacity: 0, duration: 0.25, ease: "power3.in",
    }, splashLabel);

    // 溅射粒子（墨点飞散）
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("div");
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const dist = 30 + Math.random() * 100;
      p.className = "absolute rounded-full";
      p.style.width = `${2 + Math.random() * 5}px`;
      p.style.height = p.style.width;
      p.style.background = "white";
      p.style.left = "50vw";
      p.style.top = "48vh";
      p.style.opacity = "0";
      p.style.boxShadow = "0 0 6px rgba(255,255,255,0.4)";
      containerRef.current?.appendChild(p);
      particlesRef.current.push(p);

      tl.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        opacity: 0.9,
        duration: 0.45,
        ease: "power3.out",
      }, `${splashLabel}+=0.25`);
      tl.to(p, {
        opacity: 0, scale: 0, duration: 0.5, ease: "power2.in",
      });
    }

    // 光斑从三角形光束形状扩散填满
    gsap.set(splashRef.current, {
      WebkitMaskImage: "url(/light-mask.webp)",
      maskImage: "url(/light-mask.webp)",
      WebkitMaskSize: "0%",
      maskSize: "0%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    });

    tl.to(splashRef.current, {
      WebkitMaskSize: "130%",
      maskSize: "130%",
      duration: 1.4,
      ease: "power4.out",
    }, `${splashLabel}+=0.2`);

    // ═══ 实景照片丝滑淡入 ═══
    tl.to(photoRef.current, {
      opacity: 1,
      duration: 1.8,
      ease: "power3.inOut",
    }, `${splashLabel}+=0.9`);

    // ═══ Logo + Enter ═══
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      "-=0.6"
    );
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.3"
    );

    // Cleanup
    setTimeout(() => {
      particlesRef.current.forEach(p => p.remove());
      particlesRef.current = [];
    }, 10000);

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (ballRef.current) ballRef.current.style.display = "none";
        if (photoRef.current) photoRef.current.style.opacity = "1";
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 12000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* 实景照片 — 溅射后淡入 */}
      <div ref={photoRef} className="absolute inset-0 opacity-0">
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 光斑溅射层 — 三角光束遮罩形状 */}
      <div ref={splashRef} className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(255,252,245,0.95) 0%, rgba(255,240,210,0.5) 40%, rgba(200,150,80,0.15) 70%, transparent 90%)",
        }}
      />

      {/* 小白球 */}
      <div ref={ballRef} className="absolute z-30" style={{ left: 0, top: 0, translate: "-50% -50%" }} />

      {/* Logo + Enter */}
      <div ref={logoRef} className="absolute z-40 opacity-0 flex flex-col items-center"
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
