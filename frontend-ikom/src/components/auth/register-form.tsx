"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import IdScanner from "./id-scanner";
import FacialRecognition from "./facial-recognition";

export default function RegisterForm() {
  const [registrationStep, setRegistrationStep] = useState<
    "intro" | "scan-id" | "scan-face" | "complete" | "error"
  >("intro");
  const [idData, setIdData] = useState<null | { valid: boolean }>(null);

  const handleIdScanComplete = (isValid: boolean) => {
    setIdData({ valid: isValid });
    if (isValid) {
      setRegistrationStep("scan-face");
    } else {
      setRegistrationStep("error");
    }
  };

  const handleFacialScanComplete = (success: boolean) => {
    if (success) {
      setRegistrationStep("complete");
    } else {
      setRegistrationStep("error");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-white mb-6 hover:text-yellow transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="bg-light-grey border-2 border-soft-black  p-6 rounded-lg">
          <h1 className="text-3xl font-black text-soft-black mb-6">REGISTER</h1>

          {registrationStep === "intro" && (
            <div className="space-y-6">
              <div className="bg-yellow/30 border-2 border-soft-black p-4 rounded-md">
                <h3 className="font-bold text-soft-black mb-2">
                  Registration Process
                </h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-yellow rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-soft-black font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-soft-black font-medium">
                        Scan your CIN (ID card)
                      </p>
                      <p className="text-sm text-grey">
                        We'll extract your information securely
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-yellow rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-soft-black font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-soft-black font-medium">
                        Facial recognition
                      </p>
                      <p className="text-sm text-grey">
                        We'll capture your face for future logins
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <Button
                onClick={() => setRegistrationStep("scan-id")}
                className="w-full h-12 bg-blue hover:bg-blue/90 text-soft-black font-bold border-2 border-soft-black  rounded-md transition-transform hover:-translate-y-1">
                Start Registration
              </Button>
            </div>
          )}

          {registrationStep === "scan-id" && (
            <div className="space-y-6">
              <div className="bg-yellow/30 border-2 border-soft-black p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-6 w-6 text-soft-black mt-1" />
                  <div>
                    <h3 className="font-bold text-soft-black">
                      Scan Your ID Card
                    </h3>
                    <p className="text-sm text-grey">
                      Position your CIN in front of the camera
                    </p>
                  </div>
                </div>
              </div>

              <IdScanner onComplete={handleIdScanComplete} />
            </div>
          )}

          {registrationStep === "scan-face" && (
            <div className="space-y-6">
              <div className="bg-violet/30 border-2 border-soft-black p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <Camera className="h-6 w-6 text-soft-black mt-1" />
                  <div>
                    <h3 className="font-bold text-soft-black">
                      Facial Recognition
                    </h3>
                    <p className="text-sm text-grey">
                      Position your face in front of the camera
                    </p>
                  </div>
                </div>
              </div>

              <FacialRecognition
                onComplete={() => handleFacialScanComplete(true)}
              />
            </div>
          )}

          {registrationStep === "complete" && (
            <div className="space-y-6 text-center">
              <div className="bg-green/20 border-2 border-green p-6 rounded-md">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-soft-black">
                    Registration Complete!
                  </h3>
                  <p className="text-grey mt-2">
                    Your account has been successfully created
                  </p>
                </div>
              </div>

              <Link href="/login" className="block w-full">
                <Button className="w-full h-12 bg-green hover:bg-green/90 text-white font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1">
                  Proceed to Login
                </Button>
              </Link>
            </div>
          )}

          {registrationStep === "error" && (
            <div className="space-y-6 text-center">
              <div className="bg-rose/20 border-2 border-rose p-6 rounded-md">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-rose rounded-full flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-soft-black">
                    Registration Failed
                  </h3>
                  <p className="text-grey mt-2">
                    {idData === null
                      ? "An error occurred during registration"
                      : !idData.valid
                      ? "Your ID card couldn't be verified"
                      : "Facial recognition failed"}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setRegistrationStep("intro")}
                className="w-full h-12 bg-soft-black hover:bg-soft-black/90 text-white font-bold border-2 border-soft-black  rounded-md transition-transform hover:-translate-y-1">
                Try Again
              </Button>
            </div>
          )}

          {registrationStep !== "complete" && registrationStep !== "error" && (
            <div className="mt-6 pt-6 border-t-2 border-soft-grey text-center">
              <p className="text-soft-black">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue font-bold hover:underline">
                  Login now
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
