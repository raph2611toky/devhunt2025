import React, { RefObject } from "react";
import VideoGrid from "./videoGrid";
import Controls from "./controls";

interface MeetingRoomProps {
  stream: MediaStream | null;
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteStreams: Map<string, MediaStream>;
  roomId: string;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  leaveCall: () => void;
}

export default function MeetingRoom({
  stream,
  localVideoRef,
  remoteStreams,
  roomId,
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  leaveCall,
}: MeetingRoomProps) {
  return (
    <>
      <VideoGrid
        stream={stream}
        localVideoRef={localVideoRef}
        remoteStreams={remoteStreams}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
      />
      <Controls
        roomId={roomId}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        leaveCall={leaveCall}
      />
    </>
  );
}
