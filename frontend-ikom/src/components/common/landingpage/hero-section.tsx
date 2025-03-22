'use client';
import React, { useEffect, useRef } from 'react';
import CustomContainer from '../custom-container';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { MouseIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const rRef = useRef<HTMLDivElement>(null);
  const CRef = useRef<HTMLDivElement>(null);
  const CText = useRef<HTMLDivElement>(null);
  const CtText = useRef<HTMLDivElement>(null);
  const hText = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btTextRef = useRef<HTMLDivElement>(null);
  const btIconRef = useRef<HTMLDivElement>(null);
  const tl = gsap.timeline();
  const BtTl = gsap.timeline();

  useEffect(() => {
    if (!rRef.current || !CRef.current || !CText.current) return;
    tl.to(CRef.current, {
      scale: 1,
      duration: 1,
      transformOrigin: 'left',
      ease: 'power3.inOut',
    })
      .to(CText.current, {
        y: 0,
        duration: 1,
        ease: 'power3.inOut',
      })
      .to(CtText.current, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      })
      .to(rRef.current, {
        rotate: '45deg',
        scaleX: 1,
        width: '64px',
        height: '64px',
        duration: 0.8,
        ease: 'power3.inOut',
      });
    gsap.to(hText.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.inOut',
    });
    BtTl.to(btnRef.current, {
      opacity: 1,
      width: 200,
      bottom: '80px',
      duration: 0.8,
      ease: 'power3.inOut',
    })
      .to(btTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      })
      .to(btIconRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });

    const scrollTrigger = ScrollTrigger.create({
      trigger: '#fRef',
      start: 'top bottom',
      onEnter: () => {
        BtTl.reverse();
      },
      onLeaveBack: () => {
        BtTl.play();
      },
    });
  }, []);

  return (
    <CustomContainer className="flex flex-col pt-[100px] items-center justify-center gap-[45px]">
      <h1
        ref={hText}
        className="font-power-gotesk font-semibold text-[32px] text-deep-navy text-center translate-y-[60px] opacity-0"
      >
        <span className="block">Éducation Inclusive</span>
        <span>Découvrez une Culture Sans Limites</span>
      </h1>
      <div className="relative flex items-center gap-[60px] text-deep-navy font-bold text-[70px] font-power-gotesk">
        <div
          ref={CRef}
          className="relative left-0 px-[63px] py-[12px] scale-x-[0.05] origin-left border-green border-[2px] overflow-hidden"
        >
          <div ref={CText} className="translate-y-[100%]">
            <span>Éducation</span>
          </div>
        </div>
        <div
          ref={rRef}
          className="h-0 w-0 bg-yellow border border-black rotate-0"
        ></div>
        <div className="relative px-[12px] py-[20px]">
          <div
            ref={CtText}
            className="absolute z-[2] h-full w-full left-0 top-0 bg-white scale-x-[1] origin-right"
          ></div>
          <div className="translate-x-[-12px]">
            <span className="">Accessibilité</span>
          </div>
        </div>
      </div>
      <button
        ref={btnRef}
        className="fixed z-50 bottom-[30px] border w-[50px] h-[50px] overflow-hidden opacity-1 px-[34px] font-semibold py-[12px] rounded-3xl border-deep-navy bg-yellow text-deep-navy"
      >
        <div
          ref={btIconRef}
          className="absolute opacity-1 top-0 left-0 h-full w-full flex items-center bg-yellow justify-center"
        >
          <MouseIcon className="w-6 h-6 text-black" />
        </div>

        <div
          ref={btTextRef}
          className="absolute opacity-0 top-0 left-0 h-full w-full flex items-center bg-yellow justify-center translate-y-[100%]"
        >
          <span>Commencer</span>
        </div>
      </button>
    </CustomContainer>
  );
};

export default HeroSection;
