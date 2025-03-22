'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MenuNavigation() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const tl = gsap.timeline();

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    tl.to(containerRef.current, {
      width: '466px',
      delay: 0.3,
      duration: 1,
      ease: 'power3.inOut',
    }).to(
      contentRef.current,
      {
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      const currentItem = itemRefs.current[activeIndex];

      if (currentItem) {
        setIndicatorStyle({
          left: currentItem.offsetLeft,
          width: currentItem.offsetWidth,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative h-[46px] w-[45px] overflow-hidden rounded-lg bg-yellow border-[2px] border-black"
    >
      <div
        className="absolute z-10 flex items-center justify-center bg-black rounded-3xl transition-all duration-300 ease-in-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: '33px',
          top: '6px',
          opacity: indicatorStyle.opacity,
          pointerEvents: 'none',
        }}
      />

      <ul
        ref={contentRef}
        className="overflow-hidden z-[15] opacity-0 rounded-xl md:w-[466px] h-[45px] flex items-center gap-[6px] text-black font-montserrat list-none text-[14px] font-medium px-[16px] relative"
      >
        <li
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          className="relative z-20 flex items-center justify-center rounded-3xl px-6 py-[6px] cursor-pointer hover:text-white"
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          Home
        </li>
        <hr className="relative z-20 h-[16px] w-[1px] bg-black" />
        <li
          ref={(el) => {
            itemRefs.current[1] = el;
          }}
          className="relative z-20 flex items-center justify-center rounded-3xl px-6 py-[6px] cursor-pointer hover:text-white"
          onMouseEnter={() => setActiveIndex(1)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          About
        </li>
        <hr className="relative z-20 h-[16px] w-[1px] bg-black" />
        <li
          ref={(el) => {
            itemRefs.current[2] = el;
          }}
          className="relative z-20 flex items-center justify-center rounded-3xl px-6 py-[6px] cursor-pointer hover:text-white"
          onMouseEnter={() => setActiveIndex(2)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          Ressource
        </li>
        <hr className="relative z-20 h-[16px] w-[1px] bg-black" />
        <li
          ref={(el) => {
            itemRefs.current[3] = el;
          }}
          className="relative z-20 flex items-center justify-center rounded-3xl px-6 py-[6px] cursor-pointer hover:text-white"
          onMouseEnter={() => setActiveIndex(3)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          Contact
        </li>
      </ul>
    </div>
  );
}
