'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Camera, Check, X } from 'lucide-react';
import Image from 'next/image';
import { login } from '@/lib/services/auth/auth';

interface FacialRecognitionProps {
  onComplete: (success: boolean) => void;
  type: 'login' | 'register';
  setCinImage?: Dispatch<SetStateAction<string | File | null | undefined>>;
  cinImage?: File | string | null;
}

export default function FacialRecognition({
  onComplete,
  type,
  setCinImage,
  cinImage,
}: FacialRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanStarted, setScanStarted] = useState(false); // État pour lancer le scan
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Stocker l'image
  const [isLoading, setIsLoading] = useState(false); // État pour le loader
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null); // Résultat
  const [stream, setStream] = useState<MediaStream | null>(null); // Stocker le flux pour l'éteindre

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
        setCameraActive(true);
      } catch (err) {
        console.error("Erreur d'accès à la caméra :", err);
        onComplete(false);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [onComplete]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const startScan = () => {
    setScanStarted(true);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          captureImage(); // Capturer l'image quand l'animation est terminée
        }
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        if (setCinImage) setCinImage(imageData);
        setScanComplete(true);
        stopCamera();
        verifyImage(imageData);
      }
    }
  };

  const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const verifyImage = async (imageData: string) => {
    setIsLoading(true);

    try {
      const imageBlob = dataURLtoBlob(imageData);
      const formData = new FormData();
      formData.append('face_image', imageBlob, 'captured-image.jpg');
      formData.append('email', 'exemple@gmail.com');

      if (type === 'login') {
        console.log('Loginnn...');
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/login/face/',
          {
            method: 'POST',
            body: formData,
          }
        );
        const result = await response.json();
      } else {
        if (cinImage) {
          if (typeof cinImage === 'string') {
            const cinImageBlob = dataURLtoBlob(cinImage);
            formData.append('cin_image', cinImageBlob, 'cin-image.jpg');
          } else if (cinImage instanceof File) {
            formData.append('cin_image', cinImage);
          }
        } else {
          throw new Error('Aucune image CIN fournie');
        }
        console.log('Registerrr...');
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/register/face/',
          {
            method: 'POST',
            body: formData,
          }
        );
        const result = await response.json();
      }

      const isValid = Math.random() > 0.3;

      setIsLoading(false);
      setScanSuccess(isValid);

      if (isValid) {
        onComplete(true); // Succès
      } else {
        onComplete(false); // Échec
      }
    } catch (error) {
      console.error('Erreur lors de la vérification :', error);
      setIsLoading(false);
      setScanSuccess(false);
      onComplete(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative border-4 border-dashed border-violet rounded-lg overflow-hidden bg-soft-black">
        {cameraActive && !scanComplete ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[300px] object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay de contour du visage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-48 h-64 border-2 rounded-full transition-colors duration-300 ${
                  scanComplete && scanSuccess === null
                    ? 'border-violet'
                    : scanSuccess
                    ? 'border-green'
                    : scanSuccess === false
                    ? 'border-red'
                    : 'border-violet'
                }`}
              ></div>
            </div>

            {/* Animation de balayage */}
            {scanStarted && !scanComplete && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-violet opacity-70"
                  style={{
                    transform: `translateY(${Math.floor(scanProgress * 3)}px)`,
                    transition: 'transform 0.1s linear',
                  }}
                ></div>
              </div>
            )}
          </>
        ) : capturedImage ? (
          <>
            <img
              src={capturedImage}
              alt="Captured face"
              className="w-full h-[300px] object-cover"
            />

            {/* Loader pendant la vérification */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Image
                  src={'/assets/icons/bars-rotate-fade.svg'}
                  width={100}
                  height={100}
                  className="w-[3rem]"
                  alt="bar-rotate"
                />
              </div>
            )}

            {/* Overlay de succès ou échec */}
            {scanComplete && !isLoading && scanSuccess !== null && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                {scanSuccess ? (
                  <div className="bg-green rounded-full p-3">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <div className="bg-red rounded-full p-3">
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Activation de la caméra...</p>
            </div>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      {scanStarted && (
        <div className="h-2 w-full bg-light-grey rounded-full overflow-hidden">
          <div
            className={`h-full ${
              scanComplete && scanSuccess === null
                ? 'bg-violet'
                : scanSuccess
                ? 'bg-green'
                : scanSuccess === false
                ? 'bg-red'
                : 'bg-violet'
            }`}
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      )}

      {/* Bouton pour lancer le scan */}
      {cameraActive && !scanStarted && (
        <button
          onClick={startScan}
          className="w-full h-12 bg-violet hover:bg-violet/90 text-soft-black font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1"
        >
          Lancer le scan
        </button>
      )}

      {/* Bouton pour recommencer en cas d'échec */}
      {scanComplete && !isLoading && scanSuccess === false && (
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="w-full bg-yellow h-12 bg-red hover:bg-red/90 text-red-500 font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1"
        >
          Recommencer
        </button>
      )}

      {/* Texte de statut */}
      {scanStarted && (
        <div className="flex justify-between text-xs text-grey">
          <span>
            {isLoading
              ? 'Vérification en cours...'
              : scanComplete && scanSuccess === null
              ? 'Scan terminé'
              : scanSuccess
              ? 'Visage vérifié'
              : scanSuccess === false
              ? 'Échec de la vérification'
              : 'Scan en cours...'}
          </span>
          <span>{scanProgress}%</span>
        </div>
      )}
    </div>
  );
}
