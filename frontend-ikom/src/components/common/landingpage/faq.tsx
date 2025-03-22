'use client';

import React, { useEffect, useRef, useState } from 'react';
import CustomContainer from '../custom-container';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

interface FaqItemProps {
  title: string;
  text: string;
}

const FaqItem = ({ title, text }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);
  return (
    <div className="faq-item translate-y-5 flex opacity-0 justify-between items-center p-6 rounded-3xl bg-soft-blue text-deep-navy">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <span className="font-power-gotesk text-[28px] font-medium">
            {title}
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-yellow w-9 h-9 rounded-lg flex items-center justify-center border"
          >
            <div className="absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300"></div>
            <div
              className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-0 opacity-0' : 'rotate-90 opacity-100'
              }`}
            ></div>
          </button>
        </div>
        <div
          ref={contentRef}
          className={`overflow-hidden transition-all duration-300 ease-in-out`}
          style={{ height: `${height}px` }}
        >
          <p className="text-[18px]">{text}</p>
        </div>
      </div>
    </div>
  );
};

const FaqTag = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2 py-3 px-4 bg-white rounded-xl">
      <div className="h-1 w-1 rounded-full bg-black" />
      <span>{text}</span>
    </div>
  );
};

const Faq = () => {
  useEffect(() => {
    gsap.to('.faq-item', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power3.inOut',
      stagger: 0.3,
      scrollTrigger: {
        trigger: '.faq-container',
        start: 'top bottom',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <CustomContainer>
      <div className="flex gap-9 pb-10 faq-container">
        <div className="flex-[1.3] bg-soft-blue rounded-3xl">
          <div className="flex">
            <div className="min-h-full relative w-fit flex gap-4 items-center bg-white py-2 pr-7 rounded-br-[35px] iverted-border-radius">
              <div className="rounded-full h-6 w-6 bg-green"></div>
              <h1 className="font-power-gotesk text-[40px]">Les questions</h1>
            </div>
            <div className="h-14 w-14 rounded-tl-2xl rounded-tr-2x"></div>
          </div>
          <div className="w-full h-full rounded-3xl p-8 flex gap-12 justify-between">
            <div className="pb-14">
              <Image
                src="/assets/images/iphone-mok-up.png"
                height="1000"
                width="1000"
                alt="iphone-mok-up"
              />
            </div>
            <div className="pt-14">
              <Image
                src="/assets/images/iphone-mok-up.png"
                height="1000"
                width="1000"
                alt="iphone-mok-up"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-7">
          <div className="pt-6 pb-10 px-6 rounded-3xl bg-yellow font-power-gotesk">
            <h1 className="font-medium text-[28px] mb-4">Appartement</h1>
            <div className="flex flex-wrap gap-3">
              <FaqTag text="Appartement" />
              <FaqTag text="Appartement" />
              <FaqTag text="Questions" />
              <FaqTag text="Mobile" />
              <FaqTag text="Appartement" />
            </div>
          </div>
          <FaqItem title="Question 1" text="Voici la description du text-1" />
          <FaqItem title="Question 2" text="Voici la description du text-2" />
          <FaqItem title="Question 3" text="Voici la description du text-3" />
          <FaqItem title="Question 4" text="Voici la description du text-4" />
        </div>
      </div>
    </CustomContainer>
  );
};

export default Faq;
