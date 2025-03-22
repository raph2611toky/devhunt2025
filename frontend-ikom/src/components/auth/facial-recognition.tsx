"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, X } from "lucide-react";
import Image from "next/image";

interface FacialRecognitionProps {
  onComplete: (success: boolean) => void;
}

export default function FacialRecognition({
  onComplete,
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
          video: { facingMode: "user" },
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
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir en base64 et stocker
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        setScanComplete(true);
        stopCamera(); // Éteindre la caméra après la capture
        verifyImage(imageData); // Vérifier l'image
      }
    }
  };

  const verifyImage = async (imageData: string) => {
    setIsLoading(true); // Afficher le loader

    try {
      // Simulation d'une requête backend (remplacez par un vrai appel API)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simuler un délai de 2 secondes

      // Simuler une vérification (70% de chance de succès)
      const isValid = Math.random() > 0.3;

      setIsLoading(false);
      setScanSuccess(isValid);

      if (isValid) {
        onComplete(true); // Succès
      } else {
        onComplete(false); // Échec
      }
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
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
                    ? "border-violet"
                    : scanSuccess
                    ? "border-green"
                    : scanSuccess === false
                    ? "border-red"
                    : "border-violet"
                }`}></div>
            </div>

            {/* Animation de balayage */}
            {scanStarted && !scanComplete && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-violet opacity-70"
                  style={{
                    transform: `translateY(${Math.floor(scanProgress * 3)}px)`,
                    transition: "transform 0.1s linear",
                  }}></div>
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
                  src={"/assets/icons/bars-rotate-fade.svg"}
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
                ? "bg-violet"
                : scanSuccess
                ? "bg-green"
                : scanSuccess === false
                ? "bg-red"
                : "bg-violet"
            }`}
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      )}

      {/* Bouton pour lancer le scan */}
      {cameraActive && !scanStarted && (
        <button
          onClick={startScan}
          className="w-full h-12 bg-violet hover:bg-violet/90 text-soft-black font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747] rounded-md transition-transform hover:-translate-y-1">
          Lancer le scan
        </button>
      )}

      {/* Bouton pour recommencer en cas d'échec */}
      {scanComplete && !isLoading && scanSuccess === false && (
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="w-full bg-yellow h-12 bg-red hover:bg-red/90 text-red-500 font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747] rounded-md transition-transform hover:-translate-y-1">
          Recommencer
        </button>
      )}

      {/* Texte de statut */}
      {scanStarted && (
        <div className="flex justify-between text-xs text-grey">
          <span>
            {isLoading
              ? "Vérification en cours..."
              : scanComplete && scanSuccess === null
              ? "Scan terminé"
              : scanSuccess
              ? "Visage vérifié"
              : scanSuccess === false
              ? "Échec de la vérification"
              : "Scan en cours..."}
          </span>
          <span>{scanProgress}%</span>
        </div>
      )}
    </div>
  );
}
