'use client';
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

export default function BlobCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: any) => {
    if (!containerRef.current || !blobRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX || 0;
    const y = e.clientY || e.touches?.[0]?.clientY || 0;
    gsap.to(blobRef.current, { x: x - rect.left, y: y - rect.top, duration: 0.08, ease: 'power3.out' });
  }, []);

  return (
    <div ref={containerRef} onMouseMove={handleMove} onTouchMove={handleMove}
      style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div ref={blobRef} style={{
        position: 'absolute', width: 60, height: 60, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.4)', transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 16, height: 16, top: 22, left: 22,
          backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%',
        }} />
      </div>
    </div>
  );
}
