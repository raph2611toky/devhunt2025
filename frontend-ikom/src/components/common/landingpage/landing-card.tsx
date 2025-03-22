"use client"
import Image from 'next/image';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  title: string;
  text: string;
  imgSrc: string;
  className?: string;
};
const LandingCard = ({ className, title, text, imgSrc }: Props) => {
  useEffect(() => {
    gsap.to('.f-text', {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#fRef',
        start: 'top 50%',
        toggleActions: 'play none none reverse', // play, pause, resume, reverse, restart, reset, complete, none
      },
    });
  }, []);
  return (
    <div
      className={`w-full flex flex-col justify-between h-[500px] font-medium gap-6 text-deep-navy pt-10 pb-5 px-[30px] rounded-2xl border-[2.5px] border-black ${className}`}
    >
      <div className="flex flex-col gap-6">
        <span className="f-text text-[30px] font-semibold translate-y-[100px] opacity-0">
          {title}
        </span>
        <p className="f-text text-[25px] translate-y-[100px] opacity-0">
          {text}
        </p>
      </div>
      <Image
        src={imgSrc}
        height={1000}
        width={1000}
        className="h-36 w-56"
        alt={title}
      />
    </div>
  );
};

export default LandingCard;
