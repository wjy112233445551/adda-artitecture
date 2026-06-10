"use client";

import { useRef, useState, useEffect } from "react";

export default function LanyardCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -20, y: x * 20 });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -15, y: x * 15 });
  };

  const reset = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: "100%",
        padding: "clamp(20px, 5vw, 60px) 0",
        perspective: "800px",
      }}
    >
      {/* 挂绳 */}
      <div
        style={{
          width: "clamp(1px, 0.2vw, 2px)",
          height: "clamp(40px, 8vw, 80px)",
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0.2))",
          marginBottom: -1,
        }}
      />

      {/* 卡片 */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        onTouchMove={handleTouchMove}
        onTouchEnd={reset}
        style={{
          width: "clamp(180px, 40vw, 280px)",
          aspectRatio: "0.75",
          background: "#111",
          borderRadius: "clamp(6px, 1vw, 10px)",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: "transform 0.3s ease-out",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(12px, 3vw, 24px)",
          cursor: "grab",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 光晕 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${50 + rotate.y * 1.5}% ${50 - rotate.x * 1.5}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />

        {/* 夹子 */}
        <div
          style={{
            width: "clamp(28px, 6vw, 44px)",
            height: "clamp(12px, 2.5vw, 18px)",
            background: "linear-gradient(180deg, #666, #444)",
            borderRadius: "clamp(2px, 0.5vw, 4px)",
            marginBottom: "clamp(8px, 2vw, 16px)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        />

        {/* Logo */}
        <img
          src="/logo.png"
          alt="ADDA"
          style={{
            width: "80%",
            height: "auto",
            opacity: 0.9,
            filter: "brightness(0) invert(1)",
          }}
        />

        {/* 文字 */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(8px, 1.5vw, 10px)",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: "auto",
            paddingBottom: "clamp(4px, 1vw, 8px)",
          }}
        >
          drag to interact
        </p>
      </div>
    </div>
  );
}
