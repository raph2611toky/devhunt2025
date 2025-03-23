"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Définir une interface pour SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Étendre l'interface Window pour inclure SpeechRecognition
interface CustomWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

declare const window: CustomWindow;

export default function VoiceNavigation() {
  const router = useRouter();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

  // Initialiser SpeechRecognition
  const SpeechRecognition: (new () => SpeechRecognition) | undefined =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : undefined;

  const recognition: SpeechRecognition | null = SpeechRecognition
    ? new SpeechRecognition()
    : null;

  useEffect(() => {
    if (!recognition) {
      console.log(
        "La reconnaissance vocale n'est pas supportée par ce navigateur."
      );
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const command: string = event.results[0][0].transcript
        .toLowerCase()
        .trim();
      setTranscript(command);
      handleVoiceCommand(command);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  const startListening = (): void => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = (): void => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command: string): void => {
    if (command.includes("cours")) {
      router.push("/userspace/cours");
    } else if (
      command.includes("aller à propos") ||
      command.includes("à propos")
    ) {
      router.push("/about");
    } else if (
      command.includes("aller au contact") ||
      command.includes("contact")
    ) {
      router.push("/contact");
    } else {
      setTranscript("Commande non reconnue : " + command);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className="bg-yellow hover:bg-yellow/90 text-black font-bold border-2 border-black py-2 px-4"
        aria-label={
          isListening
            ? "Arrêter la navigation par voix"
            : "Activer la navigation par voix"
        }>
        {isListening ? "Arrêter l'écoute" : "Navigation par voix"}
      </button>
      <p className="mt-2 text-white">Commande reconnue : {transcript}</p>
      <p className="text-grey text-sm mt-2">
        Essayez : "aller au section cours", "aller à propos", "aller au contact"
      </p>
    </div>
  );
}
