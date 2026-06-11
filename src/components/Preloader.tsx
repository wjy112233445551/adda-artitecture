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

    // ═══ 小白球从右侧蹦跳入场 ═══
    // 初始位置：屏幕右外
    gsap.set(ballRef.current, {
      x: "120vw", y: "30vh",
      width: "clamp(12px, 2vw, 24px)",
      height: "clamp(12px, 2vw, 24px)",
      borderRadius: "50%",
      background: "white",
      boxShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)",
      opacity: 1,
    });

    // 弹跳 1：落地（squash变形）
    tl.to(ballRef.current, {
      x: "40vw", y: "60vh",
      duration: 0.7, ease: "power2.in",
      onUpdate: function() {
        const p = this.progress();
        if (p > 0.85) {
          // 落地瞬间压扁
          gsap.to(ballRef.current, { scaleX: 1.4, scaleY: 0.6, duration: 0.06, ease: "power2.in" });
        }
      },
    });
    // 弹起（stretch 拉长）
    tl.to(ballRef.current, {
      scaleX: 0.7, scaleY: 1.5, duration: 0.08, ease: "power1.out",
    });
    tl.to(ballRef.current, {
      scaleX: 1, scaleY: 1, duration: 0.2, ease: "elastic.out(1, 0.3)",
    });

    // 弹跳 2：高弹
    tl.to(ballRef.current, {
      x: "15vw", y: "10vh",
      duration: 0.6, ease: "power2.out",
    });
    tl.to(ballRef.current, {
      x: "22vw", y: "55vh",
      duration: 0.55, ease: "power2.in",
      onUpdate: function() {
        const p = this.progress();
        if (p > 0.85) {
          gsap.to(ballRef.current, { scaleX: 1.3, scaleY: 0.7, duration: 0.05, ease: "power2.in" });
        }
      },
    });
    tl.to(ballRef.current, {
      scaleX: 0.75, scaleY: 1.4, duration: 0.07, ease: "power1.out",
    });
    tl.to(ballRef.current, {
      scaleX: 1, scaleY: 1, duration: 0.2, ease: "elastic.out(1, 0.3)",
    });

    // 弹跳 3：最后落到光斑区域
    tl.to(ballRef.current, {
      x: "22vw", y: "32vh",
      duration: 0.5, ease: "power2.out",
    });
    tl.to(ballRef.current, {
      x: "24vw", y: "38vh",
      duration: 0.45, ease: "power2.in",
      onUpdate: function() {
        const p = this.progress();
        if (p > 0.8) {
          gsap.to(ballRef.current, { scaleX: 1.5, scaleY: 0.5, duration: 0.04, ease: "power2.in" });
        }
      },
    });

    // ═══ 落地墨溅 — 光斑形状从小球位置爆发扩散 ═══
    tl.to(ballRef.current, {
      scaleX: 0, scaleY: 0, opacity: 0, duration: 0.3, ease: "power3.in",
    }, "splash");

    // 溅射光斑：从球的位置迅速扩大填充遮罩白色区域
    gsap.set(splashRef.current, {
      WebkitMaskImage: "url(/light-mask.webp)",
      maskImage: "url(/light-mask.webp)",
      WebkitMaskSize: "0%",
      maskSize: "0%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      opacity: 0,
    });

    tl.to(splashRef.current, {
      opacity: 1, duration: 0.1, ease: "none",
    }, "splash+=0.25");

    tl.to(splashRef.current, {
      WebkitMaskSize: "120%",
      maskSize: "120%",
      duration: 1.2, ease: "power4.out",
    }, "splash+=0.25");

    // 溅射墨点粒子
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const dist = 40 + Math.random() * 80;
      p.className = "absolute rounded-full";
      p.style.width = `${3 + Math.random() * 6}px`;
      p.style.height = p.style.width;
      p.style.background = "white";
      p.style.left = "24vw";
      p.style.top = "38vh";
      p.style.opacity = "0";
      p.style.boxShadow = "0 0 6px rgba(255,255,255,0.5)";
      containerRef.current?.appendChild(p);
      particles.push(p);

      tl.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0.8,
        duration: 0.5,
        ease: "power3.out",
      }, "splash+=0.3");
      tl.to(p, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    }

    // ═══ 实景照片丝滑显现 ═══
    tl.to(photoRef.current, {
      opacity: 1,
      duration: 1.6,
      ease: "power3.inOut",
    }, "splash+=1.0");

    // ═══ Logo + Enter ═══
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      "-=0.5"
    );
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.3"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (ballRef.current) ballRef.current.style.display = "none";
        if (photoRef.current) photoRef.current.style.opacity = "1";
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
        particles.forEach(p => p.remove());
      }
    }, 12000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* 实景照片 — 初始隐藏，溅射后丝滑显现 */}
      <div ref={photoRef} className="absolute inset-0 opacity-0"
        style={{ transition: "none" }}>
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 光斑溅射层 — 遮罩形状揭示 */}
      <div ref={splashRef} className="absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at 25% 35%, rgba(255,250,240,0.9) 0%, rgba(255,240,220,0.6) 30%, rgba(200,160,100,0.3) 60%, transparent 80%)",
        }}
      />

      {/* 小白球 */}
      <div ref={ballRef} className="absolute z-20" style={{ left: 0, top: 0, transform: "translate(-50%, -50%)" }} />

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
