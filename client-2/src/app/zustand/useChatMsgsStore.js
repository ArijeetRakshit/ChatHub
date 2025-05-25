import { create } from 'zustand';

export const useChatMsgsStore = create( set => ({
   chatMsgs: [],
   updateChatMsgs: (newMsg) =>
      set((state) => ({
         chatMsgs: [...state.chatMsgs, newMsg],
      })),
   setInitialChatMsgs: (msgs) =>
      set({ chatMsgs: msgs }),
   setEmptyChatMsgs: ()=> 
      set({ chatMsgs: [] }),
}));