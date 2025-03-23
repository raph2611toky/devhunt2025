'use client';

import { useMessageStore } from '@/lib/store';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SignMovement() {
  const baseUrl = 'https://sign.mt/';
  const params = new URLSearchParams({
    embed: '',
    spl: 'fr',
    sil: 'ase',
    text: 'Bonjour toi',
  });
  const [showSignMove, setSHowSignMouve] = useState(false);
  const [urlParams, setSearchParams] = useState(params);
  const { message } = useMessageStore();

  useEffect(() => {
    if (message && message !== 'Connexion établie avec succès !') {
      setSHowSignMouve(true);
      const newParams = new URLSearchParams({
        embed: '',
        spl: 'fr',
        sil: 'ase',
        text: message,
      });
      setSearchParams(newParams);
    }
  }, [message]);

  return (
    <>
      <div
        className={`fixed z-50 bottom-12 right-3 rounded-full bg-black ${
          showSignMove ? 'h-0 w-0' : 'w-8 h-8'
        }`}
        onClick={() => setSHowSignMouve(true)}
      ></div>
      <div
        className={`fixed transition-all bottom-12 right-3 z-50 overflow-hidden ${
          showSignMove ? ' h-72 w-60' : ' h-0 w-0'
        }`}
      >
        <div className="relative h-full w-full">
          <iframe
            src={`${baseUrl}?${urlParams.toString()}`}
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
          {!showSignMove && (
            <div className="h-5 w-5">
              <Image
                src={'/assets/icons/sign-icon.svg'}
                width={1000}
                height={1000}
                alt="sign-icon"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
