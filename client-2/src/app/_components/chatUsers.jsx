import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import axios from 'axios';

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { authName } = useAuthStore();
  const { setInitialChatMsgs, setEmptyChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  };

  useEffect(()=>{
    const getMsgs = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_BE_URL}:${process.env.NEXT_PUBLIC_CHAT_BE_PORT}/msgs`,
        {
          params: {
            'user1': authName,
            'user2': chatReceiver
          }
        }, {
          withCredentials: true
      });
      
      if (res.data.length !== 0) {
        setInitialChatMsgs(res.data);
      } else {
        setEmptyChatMsgs();
      }
    }

    if(chatReceiver) {
        getMsgs();
    }
    
  },[chatReceiver])

  return (
    <div>
      {users.map((user, index) => {
        const isSelected = chatReceiver === user.username;
        return (
          <div
            key={index}
            onClick={() => setChatReceiver(user)}
            className={`rounded-xl m-3 p-5 cursor-pointer ${
              isSelected ? 'bg-blue-500 text-white' : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {user.username}
          </div>
        );
      })}
    </div>
  );
};

export default ChatUsers;

