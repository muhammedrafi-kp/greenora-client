import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { FaRobot, FaUser } from "react-icons/fa";
import { BiMessageRoundedDots, BiCopy } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
import { getUserData, getAdminData } from '../../services/userService';
import { initiateChat, getGreenoBotResponse } from '../../services/chatService';
import ReactMarkdown from 'react-markdown';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { IChat,IMessage } from '../../types/chat';
import "../../styles/scrollbar.css";
import { ApiResponse } from '../../types/common';
import { IAdmin, IUser } from '../../types/user';

import socket from "../../sockets/chatSocket";

const quickRepliesMap = {
    initial: [
        "How can I recycle?",
        "Schedule pickup",
        "Contact support"
    ],
    wasteTypes: [
        "Plastic",
        "Paper",
        "Glass",
        "Metal",
        "Electronic Waste",
        "Organic Waste",
        "Back to main menu"
    ]
};

interface DecodedToken extends JwtPayload {
    userId: string;
}

// Interface for bot messages (not stored in database)
interface IBotMessage {
    message: string;
    isBot: boolean;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    showQuickReplies?: boolean;
    quickReplies?: keyof typeof quickRepliesMap;
}

// Union type for all message types in the UI
type ChatMessage = IMessage | IBotMessage;

// Type guard to check if a message is a database message
const isDatabaseMessage = (message: ChatMessage): message is IMessage => {
    return '_id' in message && 'chatId' in message;
};

// Type guard to check if a message is a bot message
const isBotMessage = (message: ChatMessage): message is IBotMessage => {
    return 'isBot' in message;
};

interface ChatBotProps {
    isMobileModal?: boolean;
    onCloseMobileModal?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isMobileModal = false, onCloseMobileModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [botMessages, setBotMessages] = useState<IBotMessage[]>([]);
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [chatMode, setChatMode] = useState<'bot' | 'admin'>('bot');
    const [user, setUser] = useState<IUser | null>(null);
    const [adminId, setAdminId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const { isLoggedIn, role, token } = useSelector((state: any) => state.auth);

    // console.log("isLoggedIn:", isLoggedIn);
    // console.log("role:", role);
    // console.log("token:", token);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [botMessages, chatMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMode]);

    useEffect(() => {

        if (isLoggedIn && role === 'user' && token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            console.log("decodedToken:", decodedToken);


            socket.connect();

            socket.emit("user_connected", decodedToken.userId);
        }
        if (chatMode === 'bot') {
            // Only show welcome message if there are no existing bot messages
            if (botMessages.length === 0) {
                const botWelcomeMessage: IBotMessage = {
                    message: "👋 Hello! I'm GreenoBot, your eco-friendly assistant. How can I help you today?",
                    isBot: true,
                    timestamp: new Date(),
                    status: 'read',
                    showQuickReplies: true,
                    quickReplies: 'initial'
                };
                setBotMessages([botWelcomeMessage]);
            }
        } else if (chatMode === 'admin') {
            setIsLoading(true);

            const fetchUserData = async () => {
                const res: ApiResponse<IUser> = await getUserData();
                console.log("user response:", res);
                if (res.success) {
                    setUser(res.data);
                    console.log("user id:", res.data._id);
                    return res.data;
                }
                return null;
            };

            const fetchAdminData = async () => {
                const res: ApiResponse<IAdmin> = await getAdminData();
                console.log("admin response:", res);
                if (res.success) {
                    setAdminId(res.data._id);
                    console.log("admin id:", res.data._id);
                    return res.data._id;
                }
                return null;
            };

            Promise.all([fetchUserData(), fetchAdminData()]).then(async ([userData, adminId]) => {
                console.log("user data:", userData);
                console.log("admin id:", adminId);

                if (!userData?._id || !adminId) {
                    console.log("user or admin id not found");
                    setIsLoading(false);
                    return;
                }

                socket.emit('user_online', userData._id);

                try {
                    // Try to get existing chat or create a new one
                    const chatResponse: ApiResponse<IChat> = await initiateChat({
                        participant1: adminId,
                        participant2: userData._id,
                        participant2Name: userData.name,
                        participant2ProfileUrl: userData.profileUrl,
                        participant1Role: 'admin',
                        participant2Role: 'user'
                    });

                    console.log("chat response:", chatResponse);

                    if (chatResponse.success && chatResponse.data) {
                        setIsLoading(false);
                        const chatId = chatResponse.data._id;
                        console.log("Existing chat found:", chatId);
                        socket.emit("join_room", { chatId, userId: userData._id });
                        socket.emit("get_chat_history", { chatId: chatId });
                        socket.emit("get_admin_online_status");
                    }
                } catch (error) {
                    console.error("Error getting chat:", error);
                    setIsLoading(false);

                    // Show error message
                    const errorMessage: IBotMessage = {
                        message: "There was an error connecting to admin support. Please try again later.",
                        isBot: true,
                        timestamp: new Date(),
                        status: 'read'
                    };
                    setBotMessages([errorMessage]);
                }
            });


        } else {
            socket.emit("leave_room", "admin-room");
            socket.emit("disconnect_admin");
            socket.disconnect();
        }
    }, [chatMode]);

    useEffect(() => {

        socket.on("admin_online_status", (status) => {
            console.log("admin online status:", status);
            setIsAdminOnline(status);
        });

        socket.on('receive_message', (message: IMessage) => {
            console.log("Received message:", message);
            setIsAdminTyping(false);

            // Only process incoming messages when in admin chat mode
            if (chatMode === 'admin') {
                const messageText = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
                const newMessage: IMessage = {
                    _id: message._id,
                    chatId: message.chatId,
                    message: messageText,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    timestamp: new Date(message.timestamp)
                };

                setChatMessages(prev => [...prev, newMessage]);
            }
        });

        socket.on('admin_typing', () => {
            console.log("Admin is typing...:");
            setIsAdminTyping(true);
        });

        socket.on('admin_stop_typing', () => {
            console.log("Admin stopped typing...");
            setIsAdminTyping(false);
        });

        // Listen for chat history
        socket.on('chat_history', (data: { messages: IMessage[] }) => {
            console.log("Received chat history:", data);
            setIsLoading(false);

            if (chatMode === 'admin') {
                if (data && data.messages && data.messages.length > 0) {
                    // Format the messages with proper timestamps and ensure message is a string
                    const formattedMessages: IMessage[] = data.messages.map((msg: IMessage) => ({
                        _id: msg._id,
                        chatId: msg.chatId,
                        message: typeof msg.message === 'string' ? msg.message : JSON.stringify(msg.message),
                        timestamp: new Date(msg.timestamp),
                        senderId: msg.senderId,
                        receiverId: msg.receiverId,
                        isRead: msg.isRead,
                    }));

                    setChatMessages(formattedMessages);
                } else {
                    // If no messages, add a welcome message
                    const welcomeMessage: IBotMessage = {
                        message: "Welcome to Admin Support. How can we assist you today?",
                        isBot: true,
                        timestamp: new Date(),
                        status: 'read'
                    };
                    setBotMessages([welcomeMessage]);
                }
            }
        });

        // Clean up socket listeners on unmount
        return () => {
            socket.off('receive_message');
            socket.off('chat_history');
            socket.off('admin_online_status');
            if (socket.connected && chatMode !== 'admin') {
                socket.disconnect();
            }
            socket.off('admin_typing');
            socket.off('admin_stop_typing');
        };
    }, [user, adminId, chatMode]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowNotification(false);
    };


    const getBotResponse = (userMessage: string): { text?: string; quickReplies?: keyof typeof quickRepliesMap } => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('contact support')) {
            // Switch to admin mode
            setChatMode('admin');
            socket.emit('join_room', 'admin-room');
            return {
                text: "Connecting you to admin support...",
                quickReplies: 'initial'
            };
        } else if (lowerMessage.includes('schedule pickup')) {
            // Close chat and redirect to pickup page
            setIsOpen(false);
            navigate("/pickup");
            return {
                text: "Redirecting to pickup scheduling...",
                quickReplies: 'initial'
            };
        } else if (lowerMessage.includes('how can i recycle')) {
            return {
                text: "What type of waste would you like to recycle?",
                quickReplies: 'wasteTypes'
            };
        } else if (lowerMessage.includes('back to main') || lowerMessage.includes('main menu')) {
            return {
                text: "How can I help you today?",
                quickReplies: 'initial'
            };
        } else if (['plastic', 'paper', 'glass', 'metal', 'electronic waste', 'organic waste'].some(type => lowerMessage.includes(type))) {
            const question = `How can I recycle ${userMessage}?`;
            fetchGreenoBotResponse(question);

            return {};
        } else {
            fetchGreenoBotResponse(userMessage);
            return {};
        }
    };

    const handleSubmit = async (e: React.FormEvent | string) => {
        if (typeof e !== 'string') {
            e.preventDefault();
        }
        const messageText = typeof e === 'string' ? e : message;
        if (!messageText.trim()) return;

        if (messageText.toLowerCase() === 'chat with admin') {
            setChatMode('admin');
            return;
        }

        if (chatMode === 'admin') {
            setMessage('');

            // Send message to admin via socket
            socket.emit('send_message', {
                message: messageText,
                senderId: user?._id,
                receiverId: adminId,
                timestamp: new Date()
            });
        } else {
            // Add user message first
            const userMessage: IBotMessage = {
                message: messageText,
                isBot: false,
                timestamp: new Date(),
                status: 'sent'
            };
            setBotMessages(prev => [...prev, userMessage]);
            setMessage('');

            // Check if the message is from quick replies
            // const isQuickReply = Object.values(quickRepliesMap).flat().includes(messageText);

            // if (isQuickReply) {
            //     simulateTyping();
            // }

            // Get bot response
            const response = getBotResponse(messageText);

            // Only add bot message if there's a text response
            if (response.text && response.quickReplies) {
                const botReplyMessage: IBotMessage = {
                    message: response.text || '',
                    isBot: true,
                    timestamp: new Date(),
                    status: 'read',
                    showQuickReplies: true,
                    quickReplies: response.quickReplies
                };
                setBotMessages(prev => [...prev, botReplyMessage]);
            }
        }
    };

    const fetchGreenoBotResponse = async (prompt: string) => {
        try {
            setIsTyping(true);

            const res: ApiResponse<string> = await getGreenoBotResponse(prompt);
            console.log("GreenoBotResponse:", res);

            const botMessage: IBotMessage = {
                message: res.data,
                isBot: true,
                timestamp: new Date(),
                status: 'read',
                showQuickReplies: true,
                quickReplies: 'initial'
            };

            setBotMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching GreenoBot response:", error);
        } finally {
            setIsTyping(false);
        }
    }

    const copyToClipboard = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const allMessages = chatMode === 'admin' ? chatMessages : botMessages;

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        if (chatMode === 'admin' && user?._id) {
            // Clear any existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            console.log("chatId in handleMessageChange:", chatMessages[0]?.chatId);

            // Emit typing event
            socket.emit('typing', {
                userId: user?._id,
                chatId: chatMessages[0]?.chatId
            });

            // Set timeout to emit stop typing after 1 second of no typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stop_typing', {
                    userId: user._id,
                    chatId: chatMessages[0]?.chatId
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

    // Add click outside handler for emoji picker
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

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    // Only show floating chat on desktop/tablet
    const isMobile = window.innerWidth < 768;
    // Hide floating chat on mobile
    if (!isMobileModal && isMobile) {
        return null;
    }

    return (
        <div
            className={
                isMobileModal
                    ? "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40"
                    : "fixed bottom-8 right-8 z-50"
            }
        >
            {/* Chat Button (desktop/tablet only) */}
            {!isMobileModal && (
                <button
                    onClick={toggleChat}
                    className={`${isOpen ? 'scale-0' : 'scale-100'} group transition-all duration-300 bg-gradient-to-r from-green-900 to-green-800 text-white p-4 sm:p-5 rounded-full shadow-lg hover:shadow-2xl relative hidden md:block`}
                >
                    <BiMessageRoundedDots className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                    {showNotification && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-bounce">
                            1
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {(isOpen || isMobileModal) && (
                <div
                    className={
                        isMobileModal
                            ? `w-full h-[100dvh] max-h-none bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp`
                            : `transition-all duration-300 origin-bottom-right absolute bottom-0 right-0 w-[calc(100vw-32px)] sm:w-[500px] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden`
                    }
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-900 to-green-800 flex flex-col">
                        {/* Chat Mode Selector */}
                        <div className="flex border-b border-green-700">
                            <button
                                onClick={() => setChatMode('bot')}
                                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${chatMode === 'bot'
                                    ? 'bg-white/10 text-white border-b-2 border-white'
                                    : 'text-green-100 hover:bg-white/5'
                                    }`}
                            >
                                GreenoBot
                            </button>
                            <button
                                onClick={() => {
                                    setChatMode('admin');
                                    setChatMessages([]);
                                }}
                                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${chatMode === 'admin'
                                    ? 'bg-white/10 text-white border-b-2 border-white'
                                    : 'text-green-100 hover:bg-white/5'
                                    }`}
                            >
                                Customer Support
                            </button>
                        </div>
                        {/* Chat Info */}
                        <div className="p-3 sm:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative">
                                    <div className="bg-white p-1.5 sm:p-2 rounded-full shadow-md">
                                        {chatMode === 'bot' ? (
                                            <FaRobot className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                                        ) : (
                                            <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                                        )}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 
                                            ${chatMode === 'admin'
                                                ? isAdminOnline ? 'bg-green-400' : 'bg-red-400'
                                                : 'bg-green-400'
                                            } 
                                            border-2 border-white rounded-full`}
                                    ></span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm sm:text-base">
                                        {chatMode === 'bot' ? 'GreenoBot' : 'Assistant'}
                                    </h3>
                                    <p className="text-green-100 text-xs sm:text-sm">
                                        {isTyping ? 'Typing...' :
                                            isAdminTyping ? 'typing...' :
                                                chatMode === 'admin' ? isAdminOnline ? 'Online' : 'Offline' : 'Online'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={isMobileModal ? onCloseMobileModal : toggleChat}
                                className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors relative group"
                            >
                                <IoIosArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
                                {/* Tooltip */}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Minimize chat
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 custom-scrollbar">
                        {allMessages.map((msg, index) => (
                            <div key={index}>
                                <div
                                    className={`flex ${(isBotMessage(msg) && msg.isBot) ||
                                        (isDatabaseMessage(msg) && msg.senderId !== user?._id)
                                        ? 'justify-start'
                                        : 'justify-end'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${(isBotMessage(msg) && msg.isBot) ||
                                            (isDatabaseMessage(msg) && msg.senderId !== user?._id)
                                            ? 'bg-white text-gray-800 shadow-md border'
                                            : 'bg-green-900 text-white'
                                            } relative group`}
                                    >
                                        <div className="flex flex-col">
                                            <div className="text-xs sm:text-sm font-medium mr-5">
                                                {isDatabaseMessage(msg) ? msg.message : (typeof msg.message === 'string' ?
                                                    <ReactMarkdown>{msg.message}</ReactMarkdown> :
                                                    JSON.stringify(msg.message))}
                                            </div>
                                            {(isBotMessage(msg) && msg.isBot) && (
                                                <button
                                                    onClick={() => copyToClipboard(msg.message, msg.timestamp.toString())}
                                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="Copy message"
                                                >
                                                    <BiCopy className="w-4 h-4 text-gray-500" />
                                                    {copiedMessageId === msg.timestamp.toString() && (
                                                        <span className="absolute -top-6 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                            Copied!
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 mt-1">
                                            <p className="text-[10px] sm:text-xs opacity-70">
                                                {msg.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {chatMode === 'bot' && isBotMessage(msg) && msg.isBot && msg.showQuickReplies && (
                                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                                        {quickRepliesMap[msg.quickReplies as keyof typeof quickRepliesMap || 'initial'].map((reply, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSubmit(reply)}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-950 border rounded-full text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-md">
                                    <div className="flex gap-1.5 sm:gap-2">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAdminTyping && chatMode === 'admin' && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-md">
                                    <div className="flex gap-1.5 sm:gap-2">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                        {isLoading && (
                            <div className="flex justify-center items-center">
                                <div className="loader"></div>
                                <span className="ml-2 text-gray-700">Connecting to admin support...</span>
                            </div>
                        )}
                    </div>
                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t">
                        <div className="flex gap-2 items-center relative">
                            <div ref={emojiPickerRef}>
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-[#0E2A39] hover:bg-green-100 rounded-full transition-colors relative group"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <BsEmojiSmile className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        Emoji
                                    </span>
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-12 left-0 z-50">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            width={300}
                                            height={400}
                                        />
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Type your message..."
                                className="flex-1 border rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-sm focus:outline-none focus:border-green-900 bg-gray-50"
                            />
                            {message.trim() && (
                                <button
                                    type="submit"
                                    className="bg-green-900 text-white p-2 sm:p-3 rounded-full hover:bg-green-800 transition-colors relative group"
                                >
                                    <BsSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        Send message
                                    </span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot; 