'use client';
import Faq from '@/components/common/landingpage/faq';
import Fonctionnality from '@/components/common/landingpage/fonctionnality';
import Footer from '@/components/common/landingpage/footer';
import Gallery from '@/components/common/landingpage/gallery';
import LandingHeader from '@/components/common/landingpage/header';
import HeroSection from '@/components/common/landingpage/hero-section';
import LandingMarquee from '@/components/common/landingpage/marquee';
import { TestimonialCarousel } from '@/components/common/landingpage/testimonial-caroussel';
import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }, []);
  return (
    <div className="w-full min-h-screen max-h-fit overflow-hidden bg-white text-black">
      <LandingHeader />
      <HeroSection />
      <LandingMarquee />
      <Fonctionnality />
      <Gallery />
      <Faq />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
}
