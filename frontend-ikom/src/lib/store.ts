import { create } from 'zustand';


interface VoiceInterface {
  message: string;
  newMessage: (message: string) => void;
  clearMessage: () => void;
}

export const useMessageStore = create<VoiceInterface>((set)=>({
    message:'',
    newMessage: (message)=>set((state)=>({message})),
    clearMessage:()=>set(()=>({message:''}))
}))