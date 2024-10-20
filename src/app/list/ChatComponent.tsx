"use client"

import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  text: string;
  sender: "user" | "ai" | "host";
  avatar?: string;
}

interface ChatComponentProps {
  isDarkMode: boolean;
  initialMessages?: Message[];
  onNewMessage?: () => void;
}

export default function ChatComponent({
  isDarkMode,
  initialMessages = [],
  onNewMessage,
}: ChatComponentProps) {
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [messageInput, setMessageInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = { text: messageInput, sender: "user" };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
      setTimeout(() => {
        const aiResponse: Message = {
          text: "안녕하세요! 활동에 관심 가져주셔서 감사합니다. 어떤 점이 궁금하신가요?",
          sender: "ai",
          avatar: "/ai-avatar.png",
        };
        setChatMessages((prev) => [...prev, aiResponse]);
        if (onNewMessage) {
          onNewMessage();
        }
      }, 1000);
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const newMessage: Message = {
  //       text: "안녕하세요! 이 활동에 대해 궁금한 점이 있으신가요?",
  //       sender: "host",
  //       avatar: "/host-avatar.png",
  //     };
  //     setChatMessages((prev) => [...prev, newMessage]);
  //     if (onNewMessage) {
  //       onNewMessage();
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [onNewMessage]);

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
      <h3 className="text-xl font-semibold mb-4">채팅</h3>
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
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender !== "user" && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src={message.avatar || `/placeholder-${message.sender}.png`}
                  alt={`${message.sender} avatar`}
                />
                <AvatarFallback>
                  {message.sender === "ai" ? "AI" : "H"}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === "user"
                  ? isDarkMode
                    ? "bg-[#7a7bff] text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-[#3c3c45] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            {message.sender === "user" && (
              <Avatar className="w-8 h-8 ml-2">
                <AvatarImage src="/user-avatar.png" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
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
          placeholder="메시지를 입력하세요..."
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
          aria-label="메시지 보내기"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
