'use client';
import React, { useEffect, useRef } from 'react';
import CustomContainer from '../custom-container';
import MenuNavigation from './menu';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Link from 'next/link';
import Image from 'next/image';

const LandingHeader = () => {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!elRef.current) return;
    gsap.to(elRef.current, {
      y: '0px',
      opacity: 1,
      delay: 0.1,
      duration: 2,
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.126,0.382 0.027,0.734 0.184,0.882 0.376,1.062 0.818,1.001 1,1 '
      ),
    });
  }, []);
  return (
    <CustomContainer className="mt-[52px] relative">
      <div
        ref={elRef}
        className="w-full flex items-center justify-between translate-y-[-100%] opacity-0"
      >
        <div className="logo text-xl font-bold text-black">Logo</div>
        <MenuNavigation />
        <Link href={'/login'}>
          <button className="bg-black border-[2px] border-black px-[30px] py-[10px] rounded-lg font-medium text-white">
            Connexion
          </button>
        </Link>
      </div>
    </CustomContainer>
  );
};

export default LandingHeader;
