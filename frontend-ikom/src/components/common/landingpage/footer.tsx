"use client"
import React from 'react';
import CustomContainer from '../custom-container';
import { Instagram, Apple } from 'lucide-react';

const Footer = () => {
  return (
    <CustomContainer>
      <div className="flex justify-between items-start text-deep-navy py-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-10 p-6 rounded-2xl bg-soft-grey border-[2px] border-black">
            <h1 className="text-[24px] font-bold text-black">Logo</h1>
            <span className="text-[28px]">By Pioneer</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center border rounded-full border-black h-12 w-12">
                <Apple className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-center border rounded-full border-black h-12 w-12">
                <Instagram className="w-4 h-4" />
              </div>
            </div>
          </div>
          <p className="text-[28px]">©2025 HIU. Created by Pioneer</p>
        </div>
        <div className="flex flex-col gap-4">
          <ul className="list-none flex flex-col gap-2 text-[20px] font-medium">
            <li className="hover:underline cursor-pointer">Questions ?</li>
            <li className="hover:underline cursor-pointer">Plus d'info!</li>
            <li className="hover:underline cursor-pointer">Comment ?</li>
          </ul>
          <div className="flex gap-5 items-center">
            <div className="flex items-center justify-center border rounded-full border-deep-navy h-12 w-12">
              <Apple className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center border rounded-full border-deep-navy h-12 w-12">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center border rounded-full border-deep-navy h-12 w-12">
              <Instagram className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </CustomContainer>
  );
};

export default Footer;
