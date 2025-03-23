import React from 'react';

type MarqueeItemProps = {
  children: React.ReactNode;
  speed: number;
  direction?: 'left' | 'right';
  isMouseHover: boolean;
};

const MarqueeItem: React.FC<MarqueeItemProps> = ({
  children,
  speed,
  direction = 'left',
  isMouseHover,
}) => {
  const style = {
    animation: `marquee ${speed * 10}s linear infinite`,
    animationDirection: `${direction === 'right' ? 'reverse' : 'normal'}`,
  };
  return (
    <div
      className={`animate-marquee group-hover:paused flex items-center whitespace-nowrap select-none ${
        isMouseHover ? 'paused' : 'running'
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

type MarqueeProps = {
  speed?: number;
  wheelFactor?: number;
  dragFactor?: number;
  children: React.ReactNode;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  numberOfClone?: number;
};

export const InfiniteMarquee: React.FC<MarqueeProps> = ({
  speed = 2,
  children,
  direction = 'left',
  pauseOnHover = true,
  numberOfClone = 4,
}) => {
  return (
    <div className="group flex w-full items-center overflow-hidden select-none">
      {Array.from({ length: numberOfClone }, (_, index) => (
        <MarqueeItem
          key={index}
          speed={speed}
          direction={direction}
          isMouseHover={pauseOnHover}
        >
          {children}
        </MarqueeItem>
      ))}
    </div>
  );
};
