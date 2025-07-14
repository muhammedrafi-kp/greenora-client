import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getCollectorData } from '../../services/collectorService';
import { getAdminData } from '../../services/userService';
import { initiateChat } from '../../services/chatService';
import EmojiPicker from 'emoji-picker-react';
import { ApiResponse } from '../../types/common';
import { IChat, IMessage } from '../../types/chat';
import { ICollector, IAdmin } from '../../types/user';
import socket from "../../sockets/chatSocket";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const navigate = useNavigate();
  const [collectorData, setCollectorData] = useState<ICollector>({} as ICollector);
  const [adminId, setAdminId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [adminStatus, setAdminStatus] = useState<'online' | 'offline'>('offline');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // const { isLoggedIn, role, token } = useSelector((state: any) => state.auth);

  // console.log("isLoggedIn:", isLoggedIn);
  // console.log("role:", role);
  // console.log("token:", token);


  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    socket.connect();

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fetchCollectorData = async () => {
          const res: ApiResponse<ICollector> = await getCollectorData();
          console.log("collector res:", res);
          if (res.success) {
            setCollectorData(res.data);
            setUserId(res.data._id || '');
            return res.data;
          }
          throw new Error('Failed to fetch collector data');
        };

        const fetchAdminData = async () => {
          const res: ApiResponse<IAdmin> = await getAdminData();
          console.log("admin res:", res);
          if (res.success) {
            setAdminId(res.data._id);
            return res.data._id;
          }
          throw new Error('Failed to fetch admin data');
        };

        try {
          const [collector, adminId] = await Promise.all([
            fetchCollectorData(),
            fetchAdminData()
          ]);

          if (!collector || !adminId) {
            throw new Error('Required data not available');
          }

          // Initialize chat
          const chatResponse: ApiResponse<IChat> = await initiateChat({
            participant1: adminId,
            participant2: collector._id,
            participant2Name: collector.name,
            participant2ProfileUrl: collector.profileUrl,
            participant1Role: 'admin',
            participant2Role: 'collector'
          });

          console.log("chat response:", chatResponse);

          if (chatResponse.success && chatResponse.data) {
            const chatId = chatResponse.data._id;
            socket.emit("join_room", { chatId, userId: collector._id });
            socket.emit("get_chat_history", { chatId });
            socket.emit("user_connected", collector._id);
            socket.emit("user_online", collector._id);
            socket.emit("get_admin_online_status");
          }
        } catch (error) {
          console.error("Error initializing chat:", error);
          setError('Failed to initialize chat');
          navigate('/collector');
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError('Failed to initialize chat');
        navigate('/collector');
      }
    };


    initializeChat();

    socket.on('receive_message', (message: IMessage) => {
      console.log("received message:", message);
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    });

    socket.on('chat_history', (data: { messages: IMessage[] }) => {
      console.log("chat history:", data);
      // setIsLoading(false);
      if (data.messages) {
        const formattedMessages = data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    });

    socket.on("admin_online_status", (status) => {
      console.log("admin online status:", status);
      setAdminStatus(status ? 'online' : 'offline');
    });

    socket.on('admin_typing', () => {
      console.log("Admin is typing...");
      setIsAdminTyping(true);
    });

    socket.on('admin_stop_typing', () => {
      console.log("Admin stopped typing...");
      setIsAdminTyping(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('chat_history');
      socket.off('admin_online_status');
      socket.off('admin_typing');
      socket.off('admin_stop_typing');
      socket.emit("leave_room", "admin-room");
      socket.emit("disconnect_admin");
      socket.disconnect();
      isInitialized.current = false;
    };
  }, [navigate]);

  

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

    console.log("newMessage:", newMessage);

    // Send message via socket
    socket.emit('send_message', {
      message: newMessage,
      senderId: collectorData._id,
      receiverId: adminId,
      timestamp: new Date()
    });

    setNewMessage('');
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (userId) {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing event
      socket.emit('typing', {
        userId: userId,
        chatId: messages[0]?.chatId
      });

      // Set timeout to emit stop typing after 1 second of no typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', {
          userId: userId,
          chatId: messages[0]?.chatId
        });
      }, 1000);
    }
  };

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Initializing chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 items-center justify-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/collector')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go Back
        </button>
      </div>
    );
  }

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
              {isAdminTyping ? 'typing...' : (adminStatus === 'online' ? 'Online' : 'Offline')}
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
              className={`max-w-[75%] rounded-lg p-3 ${message.senderId === userId
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
          <div className="relative group" ref={emojiPickerRef}>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-green-600 transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile size={20} />
            </button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Emoji
            </span>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-green-900"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
            disabled={newMessage.trim() === ''}
          >
            <BsSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
