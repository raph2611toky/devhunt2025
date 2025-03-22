"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ArrowLeft, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FacialRecognition from "./facial-recognition";

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<"credentials" | "facial">(
    "credentials"
  );
  const [facialScanActive, setFacialScanActive] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-white mb-6 hover:text-yellow transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="bg-light-grey border-2 border-soft-black  p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-soft-black">LOGIN</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setLoginMethod("credentials")}
                className={`p-2 rounded ${
                  loginMethod === "credentials"
                    ? "bg-yellow border-2 border-soft-black"
                    : "bg-soft-grey"
                }`}>
                <User className="h-5 w-5 text-soft-black" />
              </button>
              <button
                onClick={() => setLoginMethod("facial")}
                className={`p-2 rounded ${
                  loginMethod === "facial"
                    ? "bg-yellow border-2 border-soft-black"
                    : "bg-soft-grey"
                }`}>
                <Camera className="h-5 w-5 text-soft-black" />
              </button>
            </div>
          </div>

          {loginMethod === "credentials" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-soft-black font-bold">
                  Username
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10 h-12 border-2 border-soft-black focus:ring-yellow"
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-grey" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-soft-black font-bold">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-12 border-2 border-soft-black focus:ring-yellow"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-grey" />
                </div>
              </div>

              <Button className="w-full h-12 bg-yellow hover:bg-yellow/90 text-soft-black font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1">
                Login
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setLoginMethod("facial")}
                  className="text-soft-black underline hover:text-blue">
                  Login with facial recognition instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!facialScanActive ? (
                <>
                  <div className="bg-violet/30 border-2 border-soft-black p-4 rounded-md">
                    <div className="flex items-start space-x-3">
                      <Camera className="h-6 w-6 text-soft-black mt-1" />
                      <div>
                        <h3 className="font-bold text-soft-black">
                          Facial Recognition Login
                        </h3>
                        <p className="text-sm text-grey">
                          Position your face in front of the camera for quick
                          authentication
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setFacialScanActive(true)}
                    className="w-full h-12 bg-violet hover:bg-violet/90 text-soft-black font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1">
                    Start Camera
                  </Button>
                </>
              ) : (
                <FacialRecognition
                  onComplete={() => console.log("Facial recognition complete")}
                />
              )}

              {!facialScanActive && (
                <div className="text-center">
                  <button
                    onClick={() => setLoginMethod("credentials")}
                    className="text-soft-black underline hover:text-blue">
                    Login with credentials instead
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t-2 border-soft-grey text-center">
            <p className="text-soft-black">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
