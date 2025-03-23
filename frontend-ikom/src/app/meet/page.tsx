"use client";

import { useState, useEffect, useRef } from "react";
import MeetingSetup from "./meetingSetup";
import MeetingJoin from "./meetingJoin";
import MeetingRoom from "./meetingRoom";
import {
  initStream,
  createAndRunMeet,
  toggleAudio,
  toggleVideo,
  leaveMeet,
} from "@/lib/services/webrtc";
import Peer from "simple-peer";
import { useRouter, useSearchParams } from "next/navigation";

export default function VideoMeeting() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [roomId, setRoomId] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isMeetingRoomCreated, setIsMeetingRoomCreated] =
    useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const userId = useRef<string>(Math.random().toString(36).substring(2, 8));

  const router = useRouter();
  const searchParams = useSearchParams();

  // Générer le lien partageable une fois le roomId défini
  useEffect(() => {
    if (roomId) {
      const link = `${window.location.origin}/meet/?roomId=${roomId}`;
      console.log("Lien de la réunion:", link);
    }
  }, [roomId]);

  useEffect(() => {
    const urlRoomId = searchParams.get("roomId");
    if (urlRoomId) {
      setRoomId(urlRoomId);
      setIsMeetingRoomCreated(true);
      console.log("Room ID récupéré depuis l'URL:", urlRoomId);
    }
  }, [searchParams]);

  // Fonction pour lancer la réunion
  const startMeeting = async () => {
    const newStream = await initStream(setStream);
    if (!newStream) {
      console.error("Échec de l'initialisation du stream");
      return;
    }
    console.log("Stream initialisé avec succès:", newStream);
    if (roomId) {
      await createAndRunMeet(
        roomId,
        newStream,
        userId.current,
        peersRef,
        setIsJoined,
        setRemoteStreams
      );
    }
  };

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream, isJoined, isVideoOff]);

  useEffect(() => {
    remoteStreams.forEach((stream, peerId) => {
      const videoElement = document.getElementById(
        `remote-video-${peerId}`
      ) as HTMLVideoElement;
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
        videoElement
          .play()
          .catch((err) =>
            console.error(
              `Erreur lors de la lecture distante pour ${peerId}:`,
              err
            )
          );
      }
    });
  }, [remoteStreams]);

  useEffect(() => {
    return () => {
      console.log("Nettoyage en cours...");
      stream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => {
        if (!peer.destroyed) peer.destroy();
      });
      peersRef.current.clear();
    };
  }, [stream]);

  const handleToggleMute = () => {
    if (stream) {
      toggleAudio(stream, setIsMuted);
      console.log(
        "Micro togglé, isMuted:",
        !stream.getAudioTracks()[0]?.enabled
      );
    } else {
      console.error("Aucun stream disponible pour couper le micro");
    }
  };

  const handleToggleVideo = () => {
    if (stream) {
      toggleVideo(stream, setIsVideoOff);
      console.log(
        "Vidéo togglée, isVideoOff:",
        !stream.getVideoTracks()[0]?.enabled
      );
    } else {
      console.error("Aucun stream disponible pour couper la vidéo");
    }
  };

  const leaveCall = async () => {
    leaveMeet({
      peersRef,
      stream,
      roomId,
      userId,
      setIsJoined,
      setRemoteStreams,
      setStream,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateRoom = (newRoomId: string) => {
    setRoomId(newRoomId);
    setIsMeetingRoomCreated(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {!isJoined ? (
        <>
          {!isMeetingRoomCreated ? (
            <MeetingSetup onCreate={handleCreateRoom} />
          ) : searchParams.get("roomId") ? (
            <MeetingJoin onJoin={startMeeting} />
          ) : (
            ""
          )}
        </>
      ) : (
        <MeetingRoom
          stream={stream}
          localVideoRef={localVideoRef}
          remoteStreams={remoteStreams}
          roomId={roomId}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          toggleMute={handleToggleMute}
          toggleVideo={handleToggleVideo}
          leaveCall={leaveCall}
        />
      )}
    </div>
  );
}
