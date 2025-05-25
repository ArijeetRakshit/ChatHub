'use client'
import React, { useState, useEffect, useRef } from 'react'
import io from "socket.io-client"
import Header from '../_components/header'
import { useAuthStore } from '../zustand/useAuthStore'
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useUsersStore } from '../zustand/useUsersStore'
import ChatUsers from '../_components/chatUsers'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore'
import { useChatMsgsStore } from '../zustand/useChatMsgsStore'

const Chat = () => {
    const [msg, setMsg] = useState('')
    const [socket, setSocket] = useState(null)
    const { authName } = useAuthStore()
    const { updateUsers } = useUsersStore()
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsgs } = useChatMsgsStore();
    const chatReceiverRef = useRef(chatReceiver)
    const bottomRef = useRef(null);
    const router = useRouter()

    const getUserData = async() => {
        try{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_BE_URL}:${process.env.NEXT_PUBLIC_AUTH_BE_PORT}/users`, {
                withCredentials: true
            })
            updateUsers(res.data)
        } catch(error){
            router.push("/");
            alert('Wrong credentials');
            console.log("Error in getting all users : ", error.message);
        }
    }

    useEffect(()=>{
        chatReceiverRef.current = chatReceiver;
    }, [chatReceiver])

    useEffect(()=>{
        if(bottomRef.current)
            bottomRef.current.scrollIntoView({
                behaviour: "smooth"
            })
    },[chatMsgs])

    useEffect(() => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_BE_URL}:${process.env.NEXT_PUBLIC_CHAT_BE_PORT}`, {
            query: {
                username: authName
            }
        });

        setSocket(newSocket);
        newSocket.on("chat_msg", msg => {
            if(msg.sender === chatReceiverRef.current)
                updateChatMsgs(msg)
        })

        getUserData();

        return () => newSocket.close();
    }, []);


    const sendMsg = (e) => {
        e.preventDefault();
        const msgToSent = {
            text: msg,
            sender: authName,
            receiver: chatReceiver,
        }
        if (socket) {
            socket.emit('chat_msg', msgToSent)
            updateChatMsgs(msgToSent)
            setMsg('')
        }
    }

    return (
        <>
            <Header />
            <div className="h-screen flex divide-x-4">
                <div className="w-1/5">
                    <ChatUsers />
                </div>

                <div className="w-4/5 flex flex-col">
                    <div className='msgs-container h-4/5 overflow-scroll'>
                        {chatMsgs.map((msg, index) => (
                            <div key={index} className={`m-4 ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                                <span className={`${msg.sender === authName ? 'bg-blue-200' : 'bg-green-200'} p-2 rounded-lg`}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        <div ref={bottomRef}/>
                    </div>
                
                    <div className='h-1/5 flex items-center justify-center'>
                        <form onSubmit={sendMsg} className="w-1/2">
                            <div className="relative">
                                <input type="text"
                                    value={msg}
                                    disabled={chatReceiver === ''}
                                    onChange={(e) => setMsg(e.target.value)}
                                    placeholder={chatReceiver === '' ? "First select users to chat" : "Type your text here"}
                                    required
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                <button
                                    type="submit"
                                    disabled={chatReceiver === ''}
                                    className="text-white absolute end-2.5 bottom-2.5 
                                                bg-blue-700 hover:bg-blue-800 
                                                focus:ring-4 focus:outline-none focus:ring-blue-300 
                                                font-medium rounded-lg text-sm px-4 py-2 
                                                dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
                                                disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                                    >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat