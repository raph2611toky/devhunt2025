"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CreditCard, Check, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type CinImage = File | string | null;

interface IdScannerProps {
  onComplete: (isValid: boolean) => void;
  setCinImage: Dispatch<SetStateAction<string | File | null | undefined>>;
}

export default function IdScanner({ onComplete, setCinImage }: IdScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!uploadMode) {
      let stream: MediaStream | null = null;

      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraActive(true);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setUploadMode(true);
        }
      };

      startCamera();

      return () => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [uploadMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        setCinImage(imageData);
        setPreviewImage(imageData);
        startProcessing(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCinImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
        startProcessing(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = (imageData: string) => {
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          verifyImage(imageData);
        }
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);
  };

  const verifyImage = async (imageData: string) => {
    setIsVerifying(true);
    try {
      // Simulation d'une vérification avec une API (remplacez par une vraie API)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Délai de 2 secondes
      const isValid = true; // 70% de chance de succès (simulation)

      setIsVerifying(false);
      setVerificationResult(isValid);

      if (isValid) {
        onComplete(true); // Passer au processus suivant uniquement si valide
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'image:", error);
      setIsVerifying(false);
      setVerificationResult(false);
    }
  };

  const resetScan = () => {
    setScanProgress(0);
    setScanComplete(false);
    setPreviewImage(null);
    setVerificationResult(null);
    setIsVerifying(false);
    if (!uploadMode && videoRef.current) {
      setCameraActive(true); // Réactiver la caméra si en mode caméra
    }
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  return (
    <div className="space-y-4">
      <div className="relative border-4 border-dashed border-yellow rounded-lg overflow-hidden bg-soft-black">
        {!uploadMode ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-[220px] object-cover ${
                scanProgress > 0 ? "opacity-70" : ""
              }`}
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-[85%] h-[70%] border-2 rounded-md transition-colors duration-300 ${
                  verificationResult === null
                    ? "border-yellow"
                    : verificationResult
                    ? "border-green"
                    : "border-red"
                }`}>
                <div className="absolute top-0 left-0 w-full text-center -mt-6">
                  <span className="bg-light-grey px-2 text-xs text-soft-black">
                    Position ID card here
                  </span>
                </div>
              </div>
            </div>
            {scanProgress > 0 && !scanComplete && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-yellow opacity-70"
                  style={{
                    transform: `translateY(${Math.floor(
                      scanProgress * 2.2
                    )}px)`,
                    transition: "transform 0.1s linear",
                  }}
                />
              </div>
            )}
            {scanComplete && isVerifying && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-lg font-bold">
                  Vérification en cours...
                </div>
              </div>
            )}
            {scanComplete && !isVerifying && verificationResult !== null && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                {verificationResult ? (
                  <div className="bg-green rounded-full p-3">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <div className="bg-red rounded-full p-3">
                    <X className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            )}
            {cameraActive && scanProgress === 0 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={handleCapture}
                  className="bg-yellow hover:bg-yellow/90 text-soft-black font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747] rounded-full h-12 w-12 p-0">
                  <CreditCard className="h-6 w-6" />
                </Button>
              </div>
            )}
            {cameraActive && scanProgress === 0 && (
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadMode(true)}
                  className="bg-light-grey border-soft-black text-soft-black text-xs">
                  Upload
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="h-[220px] flex items-center justify-center">
            {previewImage ? (
              <div className="relative w-full h-full">
                <Image
                  width={1000}
                  height={1000}
                  src={previewImage}
                  alt="ID Card"
                  className={`w-full h-full object-contain ${
                    scanProgress > 0 ? "opacity-70" : ""
                  }`}
                />
                {scanProgress > 0 && !scanComplete && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-0 left-0 w-full h-1 bg-yellow opacity-70"
                      style={{
                        transform: `translateY(${Math.floor(
                          scanProgress * 2.2
                        )}px)`,
                        transition: "transform 0.1s linear",
                      }}
                    />
                  </div>
                )}
                {scanComplete && isVerifying && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-lg font-bold">
                      Vérification en cours...
                    </div>
                  </div>
                )}
                {scanComplete &&
                  !isVerifying &&
                  verificationResult !== null && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      {verificationResult ? (
                        <div className="bg-green rounded-full p-3">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red rounded-full p-3">
                          <X className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center p-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-2 text-yellow" />
                <p className="text-white mb-4">Upload your ID card</p>
                <Button
                  onClick={triggerFileUpload}
                  className="bg-yellow hover:bg-yellow/90 text-soft-black font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747]">
                  Select File
                </Button>
                <button
                  onClick={() => setUploadMode(false)}
                  className="block mx-auto mt-4 text-xs text-blue underline">
                  Use camera instead
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {scanProgress > 0 && (
        <>
          <div className="h-2 w-full bg-light-grey rounded-full overflow-hidden">
            <div
              className={`h-full ${
                verificationResult === null
                  ? "bg-yellow"
                  : verificationResult
                  ? "bg-green"
                  : "bg-red"
              }`}
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-grey">
            <span>
              {isVerifying
                ? "Vérification en cours..."
                : scanComplete && verificationResult === null
                ? "Scan terminé"
                : verificationResult
                ? "ID vérifiée"
                : verificationResult === false
                ? "Échec de la vérification"
                : "Traitement de l'image..."}
            </span>
            <span>{scanProgress}%</span>
          </div>
        </>
      )}

      {scanComplete && !isVerifying && verificationResult === false && (
        <Button
          onClick={resetScan}
          className="w-full bg-red hover:bg-red/90 text-white font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747]">
          Recommencer
        </Button>
      )}
    </div>
  );
}
