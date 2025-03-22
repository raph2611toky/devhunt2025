"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { CreditCard, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdScannerProps {
  onComplete: (isValid: boolean) => void;
}

export default function IdScanner({ onComplete }: IdScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadMode) {
      let stream: MediaStream | null = null;

      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          setCameraActive(true);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setUploadMode(true);
        }
      };

      startCamera();

      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [uploadMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Start processing animation
        startProcessing();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        startProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = () => {
    // Simulate processing with progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanComplete(true);
            onComplete(true); // Simulate successful validation
          }, 500);
        }
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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

            {/* ID card outline overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-[85%] h-[70%] border-2 rounded-md transition-colors duration-300 ${
                  scanComplete ? "border-green" : "border-yellow"
                }`}>
                <div className="absolute top-0 left-0 w-full text-center -mt-6">
                  <span className="bg-light-grey px-2 text-xs text-soft-black">
                    Position ID card here
                  </span>
                </div>
              </div>
            </div>

            {/* Scanning animation */}
            {scanProgress > 0 && !scanComplete && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-yellow opacity-70"
                  style={{
                    transform: `translateY(${Math.floor(
                      scanProgress * 2.2
                    )}px)`,
                    transition: "transform 0.1s linear",
                  }}></div>
              </div>
            )}

            {/* Success overlay */}
            {scanComplete && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-green rounded-full p-3">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
            )}

            {/* Capture button */}
            {cameraActive && scanProgress === 0 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={handleCapture}
                  className="bg-yellow hover:bg-yellow/90 text-soft-black font-bold border-2 border-soft-black shadow-[4px_4px_0px_#474747] rounded-full h-12 w-12 p-0">
                  <CreditCard className="h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Upload alternative */}
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
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="ID Card"
                  className={`w-full h-full object-contain ${
                    scanProgress > 0 ? "opacity-70" : ""
                  }`}
                />

                {/* Scanning animation */}
                {scanProgress > 0 && !scanComplete && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-0 left-0 w-full h-1 bg-yellow opacity-70"
                      style={{
                        transform: `translateY(${Math.floor(
                          scanProgress * 2.2
                        )}px)`,
                        transition: "transform 0.1s linear",
                      }}></div>
                  </div>
                )}

                {/* Success overlay */}
                {scanComplete && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-green rounded-full p-3">
                      <Check className="h-8 w-8 text-white" />
                    </div>
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
              className={`h-full ${scanComplete ? "bg-green" : "bg-yellow"}`}
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-grey">
            <span>
              {scanComplete ? "ID verified" : "Processing ID card..."}
            </span>
            <span>{scanProgress}%</span>
          </div>
        </>
      )}
    </div>
  );
}
