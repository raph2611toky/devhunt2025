import React from "react";
import { MicOff, VideoOff } from "lucide-react";
import { RefObject } from "react";

interface VideoGridProps {
  stream: MediaStream | null;
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteStreams: Map<string, MediaStream>;
  isMuted: boolean;
  isVideoOff: boolean;
}

export default function VideoGrid({
  stream,
  localVideoRef,
  remoteStreams,
  isMuted,
  isVideoOff,
}: VideoGridProps) {
  console.log("VideoGrid rendu - isVideoOff:", isVideoOff); // Log pour vérifier
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {stream && (
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted={true}
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-black flex items-center justify-center text-white">
              Vidéo désactivée
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded flex items-center gap-1">
            Vous
            {isMuted && <MicOff size={16} />}
            {isVideoOff && <VideoOff size={16} />}
          </div>
        </div>
      )}
      {Array.from(remoteStreams.entries()).map(([peerId, remoteStream]) => (
        <div
          key={peerId}
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            id={`remote-video-${peerId}`}
            autoPlay
            playsInline
            ref={(videoElement) => {
              if (videoElement && remoteStream) {
                videoElement.srcObject = remoteStream;
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
            Participant {peerId.substring(0, 4)}
          </div>
        </div>
      ))}
      {remoteStreams.size === 0 && !stream && (
        <div className="col-span-full text-center text-gray-400 py-10">
          En attente d'autres participants...
        </div>
      )}
    </div>
  );
}
