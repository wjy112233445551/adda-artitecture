"use client";

import { useState, useEffect, useRef } from "react";
import { navigateWithTransition } from "./TransitionOverlay";

interface Project {
  slug: string; title: string; titleEn: string; city: string; type: string;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [main, renderings] = await Promise.all([
          fetch("/api/projects").then(r => r.ok ? r.json() : []),
          fetch("/api/renderings").then(r => r.ok ? r.json() : []),
        ]);
        setAllProjects([
          ...(Array.isArray(main) ? main : []),
          ...(Array.isArray(renderings) ? renderings : []),
        ]);
      } catch {
        try {
          const main = await fetch("/api/projects").then(r => r.json());
          setAllProjects(Array.isArray(main) ? main : []);
        } catch {}
      }
    })();
  }, []);

  const fuzzyMatch = (text: string, q: string) => {
    const t = String(text || "").toLowerCase();
    const ql = q.toLowerCase();
    let qi = 0;
    for (let i = 0; i < t.length && qi < ql.length; i++) {
      if (t[i] === ql[qi]) qi++;
    }
    return qi === ql.length;
  };

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.trim();
    const matched = allProjects
      .filter(p => fuzzyMatch((p.titleEn || "") + " " + (p.title || "") + " " + (p.city || ""), q))
      .slice(0, 10);
    setResults(matched);
  }, [query, allProjects]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="text-white/40 hover:text-white/80 transition-colors leading-none"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ display: "block", width: "clamp(17px, 2.2vw, 26px)", height: "clamp(17px, 2.2vw, 26px)" }}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.88)", overflowY: "auto" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          {/* 输入框 — 固定位置 */}
          <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: 520, padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 12, marginBottom: 16 }}>
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="搜索项目、城市..." style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "clamp(16px, 2vw, 24px)", outline: "none", fontFamily: "var(--font-display)", letterSpacing: "0.03em" }}
                onKeyDown={e => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "Enter" && results.length > 0) { setOpen(false); navigateWithTransition(`/projects/${results[0].slug}`); }
                }} />
              <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.12)", fontSize: 10, letterSpacing: "0.1em" }}>esc</span>
            </div>
            {!query && (
              <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.08)", fontSize: 10, textAlign: "center", marginTop: 8 }}>
                Type to search · ↑↓ navigate · ↵ open · esc close
              </p>
            )}
          </div>

          {/* 结果列表 — 输入框下方独立滚动 */}
          <div style={{ position: "absolute", top: "55%", left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, padding: "0 20px", maxHeight: "40vh", overflowY: "auto" }}>
            {results.map((p, i) => (
              <button key={p.slug} onClick={() => { setOpen(false); navigateWithTransition(`/projects/${p.slug}`); }}
                style={{ display: "flex", alignItems: "baseline", gap: 12, width: "100%", textAlign: "left", padding: "10px 2px", background: "none", border: "none", borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.12)", fontSize: 10, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.6)", fontSize: "clamp(13px, 1.2vw, 16px)", letterSpacing: "0.02em" }}>{p.titleEn}</span>
                <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.2)", fontSize: 10, marginLeft: "auto", whiteSpace: "nowrap" }}>{p.title}{p.city ? ` · ${p.city}` : ""}</span>
              </button>
            ))}
            {query && results.length === 0 && (
              <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.12)", fontSize: 12, textAlign: "center", padding: 32, fontStyle: "italic" }}>No results</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
