import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const CustomContainer = ({ children, className }: Props) => {
  return <div className={`w-full px-[137px] ${className}`}>{children}</div>;
};

export default CustomContainer;