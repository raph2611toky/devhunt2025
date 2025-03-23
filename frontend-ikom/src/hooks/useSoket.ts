'use client';

import { useMessageStore } from '@/lib/store';
import { useEffect, useState, useCallback } from 'react';

type SocketMessage = {
  message: string;
};

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const { newMessage } = useMessageStore();

  useEffect(() => {
    const ws: WebSocket = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connecté au serveur WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsedData: SocketMessage = JSON.parse(event.data);
        console.log('message data now :,', parsedData.message);
        newMessage(parsedData.message);
        setMessages((prev) => [...prev, parsedData]);
      } catch (error) {
        const message: SocketMessage = { message: event.data as string };
        setMessages((prev) => [...prev, message]);
      }
    };

    ws.onerror = (error: Event) => {
      console.error('Erreur WebSocket :', error);
    };

    ws.onclose = () => {
      console.log('Déconnecté du serveur');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: string): void => {
    if (socket && isConnected) {
      socket.send(message);
    } else {
      console.log('Socket non connecté');
    }
  };

  const onEvent = useCallback(
    (eventName: string, callback: (data: string | object) => void) => {
      const handler = (message: SocketMessage) => {
        // Puisque 'event' n'existe plus, on ignore eventName
        callback(message.message);
      };

      const currentMessages = messages;
      currentMessages.forEach(handler);

      const messageListener = (event: MessageEvent) => {
        try {
          const parsedData: SocketMessage = JSON.parse(event.data);
          callback(parsedData.message);
        } catch (error) {
          if (eventName === 'message') {
            callback(event.data as string);
          }
        }
      };

      socket?.addEventListener('message', messageListener);

      return () => {
        socket?.removeEventListener('message', messageListener);
      };
    },
    [socket, messages]
  );

  return { isConnected, messages, sendMessage, onEvent };
};

export default useSocket;
