import Peer from "simple-peer";
import axios from "axios";
import https from "https";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Initialisation du stream (inchangé)
export const initStream = async (
  setStream: (stream: MediaStream | null) => void
) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
    return stream;
  } catch (err) {
    console.error("Erreur d'accès à la caméra/micro :", err);
    return null;
  }
};

// Fonction pour créer un peer (inchangé)
export function createPeer(
  peerId: string,
  isInitiator: boolean,
  stream: MediaStream,
  userId: string,
  setRemoteStreams: React.Dispatch<
    React.SetStateAction<Map<string, MediaStream>>
  >
) {
  const peer = new Peer({
    initiator: isInitiator,
    stream,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    },
  });

  peer.on("signal", async (signal) => {
    console.log("Signal envoyé à", peerId, ":", signal);
    try {
      await axiosInstance.post(`${API_URL}/signal`, {
        to: peerId,
        signal,
        from: userId,
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi du signal :", err);
    }
  });

  peer.on("stream", (peerStream) => {
    console.log("Flux distant reçu de", peerId);
    setRemoteStreams((prev) => {
      const updated = new Map(prev);
      updated.set(peerId, peerStream);
      return updated;
    });
  });

  peer.on("error", (err) => console.error("Erreur Peer:", err));

  return peer;
}

export async function createAndRunMeet(
  roomId: string,
  stream: MediaStream,
  userId: string,
  peersRef: React.MutableRefObject<Map<string, Peer.Instance>>,
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setRemoteStreams: React.Dispatch<
    React.SetStateAction<Map<string, MediaStream>>
  >
) {
  if (!stream || !roomId || !userId) {
    console.error(
      "Impossible de créer/lancer la réunion - Données manquantes:",
      {
        stream,
        roomId,
        userId,
      }
    );
    return;
  }

  try {
    // Créer ou rejoindre la salle via le backend
    const response = await axiosInstance.post(`${API_URL}/join-room`, {
      roomId,
      userId,
    });
    const { allUsers } = response.data;

    console.log("Utilisateurs existants dans la salle:", allUsers);

    // Créer des peers pour les utilisateurs existants
    allUsers.forEach((id: string) => {
      if (id !== userId) {
        const peer = createPeer(id, true, stream, userId, setRemoteStreams);
        peersRef.current.set(id, peer);
      }
    });

    setIsJoined(true);

    // Polling pour détecter les nouveaux utilisateurs et signaux
    const pollUsersAndSignals = async () => {
      try {
        const usersResponse = await axiosInstance.get(
          `${API_URL}/room/${roomId}/users`
        );
        const { users } = usersResponse.data;
        users.forEach((id: string) => {
          if (id !== userId && !peersRef.current.has(id)) {
            console.log("Nouvel utilisateur détecté:", id);
            const peer = createPeer(
              id,
              false,
              stream,
              userId,
              setRemoteStreams
            );
            peersRef.current.set(id, peer);
          }
        });

        const signalsResponse = await axiosInstance.get(
          `${API_URL}/signals/${userId}`
        );
        const { signals } = signalsResponse.data;
        signals.forEach(({ from, signal }: { from: string; signal: any }) => {
          const peer = peersRef.current.get(from);
          if (peer) {
            console.log(`Signal reçu de ${from}:`, signal);
            peer.signal(signal);
          } else {
            console.log(`Création d'un nouveau peer pour ${from}`);
            const newPeer = createPeer(
              from,
              false,
              stream,
              userId,
              setRemoteStreams
            );
            newPeer.signal(signal);
            peersRef.current.set(from, newPeer);
          }
        });
      } catch (err) {
        console.error("Erreur lors du polling :", err);
      }
    };

    const interval = setInterval(pollUsersAndSignals, 2000);
    return () => clearInterval(interval);
  } catch (err) {
    console.error("Erreur lors de la création/lancement de la réunion :", err);
  }
}

// Nouvelles fonctions pour mute/unmute
export const toggleAudio = (
  stream: MediaStream,
  setIsMuted: (value: boolean) => void
) => {
  const audioTrack = stream.getAudioTracks()[0];
  if (!audioTrack) {
    console.error("Aucune piste audio disponible dans le stream");
    return;
  }
  audioTrack.enabled = !audioTrack.enabled;
  console.log("Audio track togglé:", audioTrack.enabled);
  setIsMuted(!audioTrack.enabled);
};

export const toggleVideo = (
  stream: MediaStream,
  setIsVideoOff: (value: boolean) => void
) => {
  const videoTracks = stream.getVideoTracks();
  console.log("Pistes vidéo disponibles:", videoTracks);
  if (videoTracks.length === 0) {
    console.error("Aucune piste vidéo disponible dans le stream");
    return;
  }
  const videoTrack = videoTracks[0];
  videoTrack.enabled = !videoTrack.enabled;
  console.log("État de la piste vidéo après toggle:", videoTrack.enabled);
  setIsVideoOff(!videoTrack.enabled);
};

export const leaveMeet = async ({
  peersRef,
  stream,
  roomId,
  userId,
  setIsJoined,
  setRemoteStreams,
  setStream,
}: {
  peersRef: React.MutableRefObject<Map<string, any>>;
  stream: MediaStream | null;
  roomId: string;
  userId: React.MutableRefObject<string>;
  setIsJoined: (value: boolean) => void;
  setRemoteStreams: (value: Map<string, MediaStream>) => void;
  setStream: (value: MediaStream | null) => void;
}) => {
  try {
    // Détruire toutes les connexions Peer
    peersRef.current.forEach((peer) => {
      if (!peer.destroyed) peer.destroy();
    });
    peersRef.current.clear();

    // Arrêter tous les tracks du stream local
    stream?.getTracks().forEach((track) => track.stop());

    // Informer le backend qu'on quitte la salle
    await axios.post(
      `${API_URL}/signals/${userId}/leave-room`,
      { roomId, userId: userId.current },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setIsJoined(false);
    setRemoteStreams(new Map());
    setStream(null);
  } catch (error) {
    console.error("Erreur lors de la sortie du meeting :", error);
  }
};
