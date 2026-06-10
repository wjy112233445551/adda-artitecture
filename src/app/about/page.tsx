"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const defaults = {
  zh: "邸岸空间建筑设计事务所成立于南京，专注于高端住宅、商业空间及文化项目的室内设计与建筑改造。我们相信空间是生活的容器，每一个项目都是与业主共同书写的叙事。",
  en: "ADDA architecture is a Nanjing-based design studio specializing in high-end residential, commercial, and cultural projects. We believe space is the container of life — every project is a narrative co-authored with our clients.",
  location: "南京 · 中国",
  founded: "2020",
  projects: "50+",
  clients: "保利 · 滨江 · 招商",
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(defaults);

  useEffect(() => {
    fetch("/api/pages").then(r => r.json()).then(d => {
      if (d.about) setData({ ...defaults, ...d.about });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 3, ease: "power2.out" });
  }, []);

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-6 pt-32 pb-16 opacity-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h1 className="text-white text-5xl md:text-7xl leading-[1.1] mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Elevating<br />Spaces,<br />Defining<br />Aesthetics
          </h1>
        </div>
        <div className="flex flex-col justify-end gap-8">
          <div>
            <p className="text-white/60 text-sm leading-relaxed tracking-[.05em] mb-4" style={{ fontFamily: "var(--font-body)" }}>{data.zh}</p>
            <p className="text-white/40 text-sm leading-relaxed tracking-[.05em]" style={{ fontFamily: "var(--font-body)" }}>{data.en}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
            {[["Location", data.location], ["Founded", data.founded], ["Projects", data.projects], ["Clients", data.clients]].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-white/30 text-[10px] tracking-[.2em] uppercase mb-1" style={{ fontFamily: "var(--font-body)" }}>{label}</p>
                <p className="text-white/70 text-sm" style={{ fontFamily: "var(--font-body)" }}>{value as string}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 -mx-6 md:col-span-2">
          <img src="/about-image.jpg" alt="ADDA Architecture" className="w-full" />
        </div>
      </div>
    </div>
  );
}
