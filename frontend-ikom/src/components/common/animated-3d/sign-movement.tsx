'use client';

import { X } from "lucide-react";
import { useState } from "react";

export default function SignMovement() {
  const baseUrl = 'https://sign.mt/';
  const params = new URLSearchParams({
    embed: '',
    spl: 'fr',
    sil: 'ase',
    text: 'Bonjour toi',
  });
  const [showSignMove,setSHowSignMouve] = useState(false)
  return (
    <>
      <div
        className={`fixed z-50 bottom-3 right-3 rounded-full bg-black ${
          showSignMove ? 'h-0 w-0' : 'w-8 h-8'
        }`}
        onClick={() => setSHowSignMouve(true)}
      ></div>
      <div
        className={`fixed transition-all bottom-3 right-3 z-50 overflow-hidden ${
          showSignMove ? ' h-72 w-60' : ' h-0 w-0'
        }`}
      >
        <div className="relative h-full w-full">
          <iframe
            src={`${baseUrl}?${params.toString()}`}
            allow="camera;microphone"
            title="Sign Language Demo"
            className="h-72 w-60"
            allowFullScreen
          ></iframe>

          <div
            onClick={() => setSHowSignMouve(false)}
            className="absolute cursor-pointer h-11 w-11 top-2 rounded-full right-2 flex items-center justify-center bg-black"
          >
            <X className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </>
  );
}
