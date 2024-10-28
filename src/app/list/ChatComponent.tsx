"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// @ts-ignore
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Message {
  type: string;
  content: string;
  sender: string;
  senderId: string;
  eventId: string;
  timestamp: string;
  avatar?: string;
}

interface ChatComponentProps {
  isDarkMode: boolean;
  initialMessages?: Message[];
  eventId: string; // 이벤트 ID를 prop으로 전달
  userId: string; // 사용자 이름을 prop으로 전달
  onNewMessage?: () => void;
}

export default function ChatComponent({
  isDarkMode,
  initialMessages = [],
  eventId,
  userId,
}: ChatComponentProps) {
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [messageInput, setMessageInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // STOMP 클라이언트 설정
    const socket = new SockJS("/ws-chat"); // Spring의 WebSocket 엔드포인트
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to STOMP server");

        // 채팅 메시지 구독
        client.subscribe(`/topic/${eventId}`, (message: IMessage) => {
          const receivedMessage: Message = JSON.parse(message.body);
          setChatMessages((prev) => [...prev, receivedMessage]);
        });

        // 채팅 히스토리 구독
        client.subscribe(`/queue/history/${eventId}`, (message: IMessage) => {
          const history: Message[] = JSON.parse(message.body);
          setChatMessages(history);
        });

        // 사용자 추가 메시지 전송 (JOIN)
        client.publish({
          destination: `/app/chat.addUser/${eventId}`,
          body: JSON.stringify({
            senderId: userId,
            type: "JOIN",
          }),
        });
      },
      // @ts-ignore
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current && clientRef.current.active) {
        if (clientRef.current.connected) {
          // 사용자 제거 메시지 전송 (LEAVE)
          clientRef.current.publish({
            destination: `/app/chat.addUser/${eventId}`,
            body: JSON.stringify({
              senderId: userId,
              type: "LEAVE",
            }),
          });
        }
        clientRef.current.deactivate();
      }
    };
  }, [eventId, userId]);

  const handleSendMessage = () => {
    if (
      messageInput.trim() &&
      clientRef.current &&
      clientRef.current.connected
    ) {
      const message = {
        senderId: userId,
        content: messageInput,
        type: "CHAT",
        eventId: eventId,
      };
      clientRef.current.publish({
        destination: `/app/chat.sendMessage/${eventId}`,
        body: JSON.stringify(message),
      });
      setMessageInput("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div
      className={`w-full ${
        isDarkMode ? "bg-[#2c2c35]" : "bg-white"
      } rounded-lg shadow-lg p-4`}
    >
      <h3 className="text-xl font-semibold mb-4">Chat</h3>
      <div
        ref={chatContainerRef}
        className={`h-80 overflow-y-auto mb-4 p-4 ${
          isDarkMode ? "bg-[#1c1c23]" : "bg-gray-100"
        } rounded-lg`}
      >
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              message.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            {message.senderId !== userId && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src={message.avatar || `/placeholder-${message.senderId}.png`}
                  alt={`${message.senderId} avatar`}
                />
                <AvatarFallback>
                  {message.senderId === "ai" ? "AI" : "H"}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === userId
                  ? isDarkMode
                    ? "bg-[#7a7bff] text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-[#3c3c45] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            {message.senderId === userId && (
              <Avatar className="w-8 h-8 ml-2">
                <AvatarImage src="/user-avatar.png" alt="User avatar" />
                <AvatarFallback>{message.sender}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <button
          className={`p-2 rounded-lg ${
            isDarkMode
              ? "bg-[#3c3c45] text-gray-300 hover:text-white"
              : "bg-gray-200 text-gray-600 hover:text-gray-900"
          } transition-colors duration-200`}
          aria-label="이모티콘 선택"
        >
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Input messages"
          className={`flex-1 p-2 rounded-lg ${
            isDarkMode ? "bg-[#3c3c45] text-white" : "bg-gray-100 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-[#7a7bff]`}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className={`p-2 rounded-lg ${
            isDarkMode ? "bg-[#7a7bff] text-white" : "bg-blue-500 text-white"
          } hover:opacity-90 transition-opacity duration-200`}
          aria-label="send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
