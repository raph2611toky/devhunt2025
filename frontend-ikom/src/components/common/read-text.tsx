
'use client';

import useSocket from '@/hooks/useSoket';
import { useMessageStore } from '@/lib/store';
import { Volume2, Volume2Icon, VolumeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

interface CustomWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
  speechSynthesis: SpeechSynthesis;
  SpeechSynthesisUtterance: new (text: string) => SpeechSynthesisUtterance;
}

declare const window: CustomWindow;

const ReadText = () => {
  const { message } = useMessageStore();
  const [isListening, setIsListening] = useState<boolean>(false);
  const { sendMessage } = useSocket('ws://192.168.0.103:8000/ws/chat/');

  const SpeechRecognition: (new () => SpeechRecognition) | undefined =
    typeof window !== 'undefined'
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
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spokenText: string = event.results[0][0].transcript.trim();
      console.log('Texte reconnu :', spokenText); // Logger le résultat de l'écoute
        sendMessage(spokenText);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Erreur de reconnaissance vocale :', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  // Fonction pour lire le texte à haute voix
  const speakText = (text: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find((voice) => voice.lang === 'fr-FR');
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("La synthèse vocale n'est pas supportée par ce navigateur.");
    }
  };

  // Lire le message du store lorsqu'il change
  useEffect(() => {
    if (message && message !== 'Connexion établie avec succès !') {
      speakText(message);
    }
  }, [message]);

  // Gérer le clic sur l'icône pour activer/désactiver l'écoute
  const toggleListening = (): void => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed z-50 bottom-2 right-3 h-8 w-8 flex justify-center items-center bg-black rounded-full text-white">
      <button
        onClick={toggleListening}
        className="flex justify-center items-center w-full h-full"
        aria-label={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute"}
      >
        <Volume2
          className={`h-4 w-4 ${
            isListening ? 'text-yellow' : 'text-white'
          }`}
        />
      </button>
    </div>
  );
};

export default ReadText;
