'use client';
import React, { useEffect, useRef } from 'react';
import CustomContainer from '../custom-container';
import LandingCard from './landing-card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Fonctionnality = () => {
  const fTitleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fTitleRef.current || !containerRef.current) return;
    gsap.to(fTitleRef.current, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <CustomContainer className="mt-6">
      <div id="fRef" className="pt-24 flex flex-col gap-16" ref={containerRef}>
        <h1
          className="text-center opacity-0 translate-y-[100px] text-deep-navy text-[58px] font-semibold"
          ref={fTitleRef}
        >
          3 . Fonctionnalités Principales ✌️
        </h1>
        <div className="flex gap-8">
          <LandingCard
            title="Cours Audio pour Aveugles"
            text="Audio-description des leçons pour un apprentissage immersif."
            imgSrc="/assets/images/f1.png"
            className="bg-blue"
          />
          <LandingCard
            title="Leçons Signées en Direct"
            text="Vidéos en langue des signes pour un suivi instantané."
            imgSrc="/assets/images/f2.png"
            className="bg-[#ecefec]"
          />
          <LandingCard
            title="Guidage Gestuel et Vocal"
            text="Instructions vocales et gestuelles pour un suivi facile."
            imgSrc="/assets/images/f3.png"
            className="bg-yellow"
          />
        </div>
      </div>
    </CustomContainer>
  );
};

export default Fonctionnality;
