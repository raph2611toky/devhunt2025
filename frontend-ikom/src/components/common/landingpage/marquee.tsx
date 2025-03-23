import React from 'react';
import { InfiniteMarquee } from '../infinite-marquee'; 

const LandingMarquee = () => {
  return (
    <div className="pt-28">
      <div className="w-full bg-rose py-1 border border-black">
        <InfiniteMarquee numberOfClone={5} direction="right">
          <div className="flex gap-9 ml-9 text-center items-center text-[28px] text-deep-navy font-medium">
            <span>Education</span>
            <div className="h-6 w-6 border border-deep-navy rotate-[45deg] bg-green"></div>
            <span>Inclusion</span>
            <div className="h-6 w-6 border border-deep-navy rotate-[45deg] bg-green"></div>
          </div>
        </InfiniteMarquee>
      </div>
    </div>
  );
};

export default LandingMarquee;
