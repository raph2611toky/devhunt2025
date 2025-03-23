import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface ControlsProps {
  roomId: string;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  leaveCall: () => void;
}

export default function Controls({
  roomId,
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  leaveCall,
}: ControlsProps) {
  return (
    <div className="h-20 bg-gray-900 flex items-center justify-center gap-6 px-4 shadow-lg">
      <button
        onClick={toggleMute}
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isMuted
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-700 hover:bg-gray-600"
        } transition`}
        aria-label={isMuted ? "Activer le micro" : "Couper le micro"}>
        {isMuted ? (
          <MicOff size={24} className="text-white" />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </button>
      <button
        onClick={toggleVideo}
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isVideoOff
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-700 hover:bg-gray-600"
        } transition`}
        aria-label={isVideoOff ? "Activer la vidéo" : "Couper la vidéo"}>
        {isVideoOff ? (
          <VideoOff size={24} className="text-white" />
        ) : (
          <Video size={24} className="text-white" />
        )}
      </button>
      <button
        onClick={leaveCall}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition"
        aria-label="Quitter l'appel">
        <PhoneOff size={24} className="text-white" />
      </button>
      <div className="bg-blue-900/40 px-4 py-2 rounded-lg text-sm text-white">
        <span className="font-semibold">Room ID:</span> {roomId}
      </div>
    </div>
  );
}
