import React from "react";
import { useRouter } from "next/navigation";

interface MeetingSetupProps {
  onCreate: (roomId: string) => void;
}

export default function MeetingSetup({ onCreate }: MeetingSetupProps) {
  const router = useRouter();

  const createMeetingRoom = () => {
    const uniqueId = Math.random().toString(36).substring(2, 8);
    router.push(`/meet/?roomId=${uniqueId}`);
    onCreate(uniqueId);
    console.log("Nouveau Room ID généré:", uniqueId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={createMeetingRoom}
        className="p-4 bg-blue-600 hover:bg-blue-700 rounded text-white text-lg">
        Créer un salon de réunion
      </button>
    </div>
  );
}
