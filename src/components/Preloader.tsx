"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// 三角形光束的边界（百分比）
// 右边缘笔直 ~86%，左边缘曲线从 85→17→84%
const TRIANGLE = {
  topY: 38.5, bottomY: 69.4,
  rightX: 86,
  leftEdgeAt: (yPct: number) => {
    // yPct: 0(顶部)到1(底部)
    const t = yPct;
    // 左边缘：顶部85→中部17→底部84（抛物线状）
    return 17 + (85 - 17) * Math.pow(1 - 2 * Math.abs(t - 0.5), 1.8);
  },
};

// 在三角形光束内随机生成一个目标位置
function randomTriPos(): { x: number; y: number } {
  const y = TRIANGLE.topY + Math.random() * (TRIANGLE.bottomY - TRIANGLE.topY);
  const leftX = TRIANGLE.leftEdgeAt((y - TRIANGLE.topY) / (TRIANGLE.bottomY - TRIANGLE.topY));
  const x = leftX + Math.random() * (TRIANGLE.rightX - leftX);
  return { x, y };
}

// 生成起始位置（屏幕外/边缘）
function randomEdgeStart(): { x: number; y: number } {
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: return { x: -10 + Math.random() * 110, y: -10 }; // top
    case 1: return { x: 110, y: -10 + Math.random() * 110 }; // right
    case 2: return { x: -10 + Math.random() * 110, y: 110 }; // bottom
    case 3: return { x: -10, y: -10 + Math.random() * 110 }; // left
  }
  return { x: -10, y: -10 };
}

const BLOB_COUNT = 24;

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    // ═══ 20+ 个液态小球从四面八方汇聚 ═══
    const blobData = Array.from({ length: BLOB_COUNT }, (_, i) => ({
      start: randomEdgeStart(),
      end: randomTriPos(),
      size: 20 + Math.random() * 50,
      delay: Math.random() * 0.5,
    }));

    blobData.forEach((b, i) => {
      const el = document.createElement("div");
      el.className = "absolute";
      el.style.cssText = `
        width: ${b.size}px; height: ${b.size}px;
        border-radius: 50%;
        background: #f5faff;
        opacity: 0;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 12px rgba(245,250,255,0.3), 0 0 30px rgba(245,250,255,0.15);
        filter: url(#blob-filter);
        left: ${b.start.x}%; top: ${b.start.y}%;
      `;
      // 内亮点
      const inner = document.createElement("div");
      inner.style.cssText = `
        position: absolute;
        width: ${b.size * 0.3}px; height: ${b.size * 0.3}px;
        top: ${b.size * 0.35}px; left: ${b.size * 0.35}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.95);
      `;
      el.appendChild(inner);
      containerRef.current?.appendChild(el);
      blobRefs.current[i] = el;

      tl.to(el, {
        left: `${b.end.x}%`,
        top: `${b.end.y}%`,
        opacity: 0.55,
        duration: 2.5,
        ease: "power4.inOut",
      }, b.delay);
    });

    // ═══ 小球就位后，照片和三角形光斑同时显现 ═══
    tl.to(photoRef.current, {
      opacity: 1,
      duration: 2.0,
      ease: "power4.inOut",
    }, "-=1.5");

    // ═══ Logo + Enter ═══
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      "-=0.8"
    );
    tl.fromTo(enterRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.3"
    );

    // Fallback
    setTimeout(() => {
      if (containerRef.current && containerRef.current.style.display !== "none") {
        if (photoRef.current) photoRef.current.style.opacity = "1";
        if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
        if (enterRef.current) { enterRef.current.style.opacity = "1"; enterRef.current.style.transform = "translateY(0)"; }
      }
    }, 10000);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ height: "100dvh" }} suppressHydrationWarning>

      {/* SVG 滤镜 — 液态小球模糊效果 */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="blob-filter">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="20" />
          <feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 45 -15" />
        </filter>
      </svg>

      {/* 照片 — 小球就位后显现 */}
      <div ref={photoRef} className="absolute inset-0 opacity-0">
        <img src="/splash-bg.webp" alt="" className="w-full h-full object-cover" />
      </div>

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
