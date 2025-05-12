import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getUserData, getAdminData } from '../../services/userService';
import { initiateChat } from '../../services/chatService';

const socket = io(import.meta.env.VITE_CHAT_SERVICE_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
});

interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    timestamp: Date;
    senderId: string;
    receiverId: string;
    isRead?: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  // const [isLoading, setIsLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    socket.connect();
    
    const initializeChat = async () => {
      try {
        // Get user data
        const userResponse = await getUserData();
        if (userResponse.success) {
          setUserId(userResponse.data._id);
          
          // Get admin data
          const adminResponse = await getAdminData();
          if (adminResponse.success) {
            setAdminId(adminResponse.data._id);
            
            // Initialize chat
            const chatResponse = await initiateChat({
              // participant1: userResponse.data.id,
              // participant2: adminResponse.data._id,
              // participant1Role: 'user',
              // participant2Role: 'admin'
            });

            if (chatResponse.success && chatResponse.data) {
              const chatId = chatResponse.data._id;
              socket.emit("join-room", { chatId, userId: userResponse.data._id });
              socket.emit("get-chat-history", { chatId });
            }
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    // Socket event listeners
    socket.on("status-updated", ({ userId, status }) => {
      console.log(`${userId} is ${status}`);
      if (userId === adminId) {
        setAdminStatus(status);
      }
    });

    socket.on('receive-message', (message: IMessage) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    });

    socket.on('chat-history', (data: { messages: IMessage[] }) => {
      // setIsLoading(false);
      if (data.messages) {
        const formattedMessages = data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    });

    return () => {
      socket.off('receive-message');
      socket.off('chat-history');
      socket.off('status-updated');
      socket.disconnect();
    };
  }, [adminId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Send message via socket
    socket.emit('send-message', {
      message: newMessage,
      participant1: userId,
      participant2: adminId,
      participant1Role: 'user',
      participant2Role: 'admin',
      timestamp: new Date()
    });

    setNewMessage('');
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3 text-gray-600 hover:text-green-700"
        >
          <IoMdArrowBack size={20} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-800">Admin Support</h2>
            <p className={`text-xs ${adminStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
              {adminStatus === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                message.senderId === userId 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${message.senderId === userId ? 'text-green-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button 
            type="button" 
            className="p-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
            disabled={newMessage.trim() === ''}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
