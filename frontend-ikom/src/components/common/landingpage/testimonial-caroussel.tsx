'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard, type Review } from './review-card';
import { getRandomThemeColor } from '@/lib/generate-color'; 
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const reviews: Review[] = [
  {
    id: 1,
    name: 'Nicholas Robson',
    handle: 'nic67',
    rating: 5,
    comment:
      "Merci pour le plateforme, c'est très utile! J'ai pu m'amelioré en communication avec tous!",
    date: '20 Mar, 2024',
    avatar: '/assets/images/f1.png',
    color: getRandomThemeColor(),
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    handle: 'sarahj',
    rating: 5,
    comment:
      "C'est très instructif et en même temps amusant !",
    date: '19 Mar, 2024',
    avatar: '/assets/images/f1.png',
    color: getRandomThemeColor(),
  },
  {
    id: 3,
    name: 'Mike Peters',
    handle: 'mikep',
    rating: 5,
    comment:
      "J'aime l'application, je donne une pouce, ça marche vachement bien!",
    date: '18 Mar, 2024',
    avatar: '/assets/images/f1.png',
    color: getRandomThemeColor(),
  },
  {
    id: 4,
    name: 'Jean Herlin',
    handle: 'rjh',
    rating: 5,
    comment:
      "C'était une grande opportunité d'avaoir pu utiliser cette application!",
    date: '18 Mar, 2024',
    avatar: '/assets/images/f1.png',
    color: getRandomThemeColor(),
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const getCardPosition = (index: number, activeIndex: number) => {
    const totalCards = reviews.length;
    let relativePos = (index - activeIndex + totalCards) % totalCards;

    if (relativePos > totalCards / 2) {
      relativePos = relativePos - totalCards;
    }

    return relativePos;
  };

  const updateCardsPosition = (activeIndex: number) => {
    reviews.forEach((_, index) => {
      const card = cardsRef.current[index];
      if (!card) return;

      const relativePos = getCardPosition(index, activeIndex);

      if (relativePos === 0) {
        gsap.to(card, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          rotate: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      } else if (relativePos === -1 || relativePos === reviews.length - 1) {
        gsap.to(card, {
          x: '-15%',
          y: '5%',
          scale: 0.9,
          opacity: 0.7,
          zIndex: 20,
          rotate: -5,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      } else if (relativePos === 1 || relativePos === -(reviews.length - 1)) {
        gsap.to(card, {
          x: '15%',
          y: '5%',
          scale: 0.9,
          opacity: 0.7,
          zIndex: 10,
          rotate: 5,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          zIndex: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      }
    });
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % reviews.length;
    setCurrentIndex(nextIndex);
    updateCardsPosition(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    setCurrentIndex(prevIndex);
    updateCardsPosition(prevIndex);
  };

  useEffect(() => {
    gsap.to('.testi-text', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.inOut',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.testi-container',
        start: 'top bottom',
        toggleActions: 'play none none none',
      },
    });

    ScrollTrigger.create({
      trigger: '.testi-container',
      start: 'top bottom',
      onEnter: () => {
        updateCardsPosition(currentIndex);
      },
    });
  }, []);

  return (
    <div className="testi-container bg-white font-montserrat text-deep-navy min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <p className="testi-text text-xl mb-2 opacity-0 translate-y-5">
          Rating & Reviews
        </p>
        <h2 className="testi-text text-4xl font-bold opacity-0 translate-y-5">
          What people are saying
        </h2>
      </div>

      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <button
          className="absolute left-4 z-40 p-4 border border-deep-navy rounded-full text-deep-navy hover:bg-deep-navy hover:border-white hover:text-white"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={carouselRef}
          className="relative w-full max-w-md h-[300px] mx-auto"
        >
          {reviews.map((review, index) => (
            <div
              key={review.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="card-content absolute top-0 left-0 w-full"
              style={{
                transformOrigin: 'center center',
              }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        <button
          className="absolute right-4 z-40 p-4 border border-deep-navy rounded-full text-deep-navy hover:bg-deep-navy hover:border-white hover:text-white"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
