"use client";

import { useRef, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navigateWithTransition } from "./TransitionOverlay";

const PAGE_ORDER = ["/", "/about", "/contact"];

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  const currentIndex = PAGE_ORDER.indexOf(pathname);
  const isMainPage = currentIndex !== -1;

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      // 详情页打开时不触发页面滑动
      if (!isMainPage || document.getElementById("modal-overlay")) return;
      startX.current = clientX;
      startY.current = clientY;
      tracking.current = true;
    },
    [isMainPage]
  );

  const handleEnd = useCallback(
    (clientX: number, clientY: number) => {
      if (!tracking.current || !isMainPage) return;
      tracking.current = false;

      const dx = clientX - startX.current;
      const dy = clientY - startY.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // 必须是水平主导且超过阈值
      const threshold = Math.min(window.innerWidth * 0.25, 120);
      if (absDx > absDy && absDx > threshold) {
        if (dx < 0 && currentIndex < PAGE_ORDER.length - 1) {
          // 左滑 → 下一页
          navigateWithTransition(PAGE_ORDER[currentIndex + 1]);
        } else if (dx > 0 && currentIndex > 0) {
          // 右滑 → 上一页
          navigateWithTransition(PAGE_ORDER[currentIndex - 1]);
        }
      }
    },
    [isMainPage, currentIndex]
  );

  // 触摸事件
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleStart, handleEnd]);

  // 鼠标事件
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest("a") ||
          e.target.closest("button") ||
          e.target.closest("input") ||
          e.target.closest("textarea") ||
          e.target.closest("nav") ||
          e.target.closest("[data-no-swipe]"))
      )
        return;
      handleStart(e.clientX, e.clientY);
    };

    const onMouseUp = (e: MouseEvent) => {
      handleEnd(e.clientX, e.clientY);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleStart, handleEnd]);

  if (!isMainPage) return <>{children}</>;

  return <>{children}</>;
}
