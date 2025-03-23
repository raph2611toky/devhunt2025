import React from "react";

interface MeetingJoinProps {
  onJoin: () => void;
}

export default function MeetingJoin({ onJoin }: MeetingJoinProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-white mb-4">Rejoindre la réunion en cours...</p>
      <button
        onClick={onJoin}
        className="p-2 bg-green-600 hover:bg-green-700 rounded text-white">
        Rejoindre la réunion
      </button>
    </div>
  );
}
