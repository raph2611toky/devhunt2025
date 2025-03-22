'use client';
import React, { useEffect, useRef } from 'react';
import CustomContainer from '../custom-container';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const fData = [
  {
    id: 1,
    icon: '/assets/images/icon-1.png',
    img: '/assets/images/img-1.png',
    text: "Capture d'écran de l'application montrant la visite augmentée.",
    title: 'Galerie Interactive ',
  },
  {
    id: 2,
    icon: '/assets/images/icon-2.png',
    img: '/assets/images/img-2.png',
    text: "Capture d'écran de l'application montrant la visite augmentée.",
    title: 'Galerie Interactive ',
  },
  {
    id: 2,
    icon: '/assets/images/icon-3.png',
    img: '/assets/images/img-3.png',
    text: "Capture d'écran de l'application montrant la visite augmentée.",
    title: 'Galerie Interactive ',
  },
  {
    id: 2,
    icon: '/assets/images/icon-4.png',
    img: '/assets/images/img-4.png',
    text: "Capture d'écran de l'application montrant la visite augmentée.",
    title: 'Galerie Interactive',
  },
];

const Gallery = () => {
  const detailContainerRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photos: HTMLElement[] = gsap.utils.toArray(
      '.photocontainer:not(:first-child)'
    ) as HTMLElement[];
    const details: HTMLElement[] = gsap.utils.toArray(
      '.detail:not(:first-child)'
    ) as HTMLElement[];
    const icons: HTMLElement[] = gsap.utils.toArray(
      '.gallery-icon:not(:first-child)'
    ) as HTMLElement[];

    gsap.set(details, { yPercent: 101 });

    const allDetails: HTMLElement[] = gsap.utils.toArray(
      '.detail'
    ) as HTMLElement[];

    if (!photos || !details) return;

    photos.forEach((photo, index) => {
      const animation = gsap
        .timeline()
        .fromTo(
          details[index],
          {
            opacity: 0,
            yPercent: 100,
          },
          { yPercent: 0, opacity: 1 },
          0
        )
        .fromTo(
          icons[index],
          {
            background: 'transparent',
            borderColor: 'transparent',
          },
          {
            background: '#fbe74e',
            borderColor: 'black',
            duration: 1,
            ease: 'power3.out',
          }
        )
        .set(allDetails[index], { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: photo,
        start: 'top 80%',
        end: 'top 50%',
        animation: animation,
        scrub: true,

        onLeaveBack: () => {
          gsap.to(icons[index], {
            background: 'transparent',
            borderColor: 'transparent',
          });
        },
      });
    });

    // Gestion de la position fixed
    const detailContainer = detailContainerRef.current;
    const galleryContainer = galleryContainerRef.current;
    if (!detailContainer || !galleryContainer) return;

    const updatePosition = () => {
      const rect = galleryContainer.getBoundingClientRect();
      const topOffset = 44; // Correspond à top-11 (environ 2.75rem)
      const windowHeight = window.innerHeight;
      const detailHeight = detailContainer.offsetHeight;

      if (rect.top <= topOffset && rect.bottom >= topOffset + detailHeight) {
        detailContainer.style.position = 'fixed';
        detailContainer.style.top = `${topOffset}px`;
        detailContainer.style.left = `${rect.left}px`;
        detailContainer.style.width = '400px';
      } else if (rect.top > topOffset) {
        detailContainer.style.position = 'absolute';
        detailContainer.style.top = '0';
        detailContainer.style.left = '0';
      } else if (rect.bottom < topOffset + detailHeight) {
        detailContainer.style.position = 'absolute';
        detailContainer.style.top = `${rect.height - detailHeight}px`;
        detailContainer.style.left = '0';
      }
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    updatePosition();

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <CustomContainer className="pb-28">
      <div className="font-power-gotesk flex flex-col gap-3 pt-24 font-medium">
        <span className="text-[34px] text-deep-navy">
          Vidéos Démonstratives
        </span>
        <h1 className="text-[40px] max-w-[800px] mb-20">
          <span className="bg-yellow ">Démonstrations en</span> vidéos des
          outils pour l’éducation adaptée.
        </h1>
      </div>
      <div className="relative">
        <div
          ref={galleryContainerRef}
          className="gallery-container grid grid-cols-1 md:grid-cols-[400px_1fr] gap-20 p-20 min-h-screen"
        >
          <div className="flex-1 w-[400px] ">
            <div
              ref={detailContainerRef}
              className="detail-container relative flex flex-col gap-2 w-[400px] h-fit"
            >
              <div className="flex gap-3">
                {fData.map((data, i) => (
                  <div
                    key={i + data.icon}
                    className="gallery-icon p-5 rounded-full bg-yellow border border-black"
                  >
                    <Image
                      height={24}
                      width={24}
                      src={data.icon}
                      alt="icon"
                      className="w-6 h-6"
                    />
                  </div>
                ))}
              </div>
              <div className="w-[400px] h-[200px] rounded-3xl overflow-hidden relative">
                {fData.map((data, i) => (
                  <div
                    key={i + data.id}
                    className="detail flex absolute left-0 top-0 w-full h-full flex-col font-montserrat text-deep-navy gap-4 p-6 bg-white rounded-3xl"
                  >
                    <h1 className="font-bold text-[38px]">{data.title}</h1>
                    <p className="font-medium text-[24px] font-power-gotesk">
                      {data.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-32">
            {fData.map((data, i) => (
              <div key={i + data.text} className="photocontainer">
                <Image src={data.img} alt="image" height={1000} width={1000} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomContainer>
  );
};

export default Gallery;
