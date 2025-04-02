import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsSend } from "react-icons/bs";
import { FaRobot, FaUser } from "react-icons/fa";
import { BiMessageRoundedDots } from "react-icons/bi";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
import io from 'socket.io-client';
// import { useAuth } from '../../context/AuthContext';
import { getUserData, getAdminData, initiateChat } from '../../services/userService';


const socket = io("http://localhost:3007", {
    transports: ["websocket", "polling"],
    withCredentials: true,
    query: {
        role: 'user'
    }
});

// Interface for database messages
interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    timestamp: Date;
    senderId: string;
    receiverId: string;
    isRead?: boolean;
}

// Define quickRepliesMap type before using it in IBotMessage
const quickRepliesMap = {
    initial: [
        "How can I recycle?",
        "Schedule a pickup",
        "Pricing plans",
        "Contact support",
        "Chat with Admin"
    ],
    recycling: [
        "Types of recyclables",
        "Recycling process",
        "Collection schedule",
        "Back to main menu"
    ],
    pickup: [
        "Schedule now",
        "View available slots",
        "Cancel pickup",
        "Back to main menu"
    ],
    pricing: [
        "View all plans",
        "Compare plans",
        "Special offers",
        "Back to main menu"
    ]
};

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

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatMode, setChatMode] = useState<'bot' | 'admin'>('bot');
    const [userId, setUserId] = useState<string>('');
    const [adminId, setAdminId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [adminStatus, setAdminStatus] = useState<'online' | 'offline'>('offline');

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (chatMode === 'bot') {
            // Initialize with bot welcome message
            const botWelcomeMessage: IBotMessage = {
                message: "👋 Hello! I'm GreenoBot, your eco-friendly assistant. How can I help you today?",
                isBot: true,
                timestamp: new Date(),
                status: 'read',
                showQuickReplies: true,
                quickReplies: 'initial'
            };
            setMessages([botWelcomeMessage]);


        } else if (chatMode === 'admin') {
            socket.connect();

            setIsLoading(true);

            const fetchUserData = async () => {
                const response = await getUserData();
                console.log("user response:", response);
                if (response.success) {
                    setUserId(response.data.id);
                    console.log("user id:", response.data.id);
                    return response.data.id;
                }
                return null;
            };

            const fetchAdminData = async () => {
                const response = await getAdminData();
                console.log("admin response:", response);
                if (response.success) {
                    setAdminId(response.data._id);
                    console.log("admin id:", response.data._id);
                    return response.data._id;
                }
                return null;
            };

            Promise.all([fetchUserData(), fetchAdminData()]).then(async ([userId, adminId]) => {
                if (!userId || !adminId) {
                    setIsLoading(false);
                    return;
                }
                try {
                    // Try to get existing chat or create a new one
                    const chatResponse = await initiateChat({
                        participant1: userId,
                        participant2: adminId,
                        participant1Role: 'user',
                        participant2Role: 'admin'
                    });
                    console.log("chat response:", chatResponse);


                    if (chatResponse.success && chatResponse.data) {
                        setIsLoading(false);
                        // Existing chat found
                        const chatId = chatResponse.data._id;
                        console.log("Existing chat found:", chatId);
                        socket.emit("join-room", { chatId, userId });
                        socket.emit("get-chat-history", { chatId: chatId });
                    } else {
                        // No existing chat, show welcome message
                        // setIsLoading(false);
                        // const welcomeMessage: IBotMessage = {
                        //     message: "Welcome to Admin Support. How can we assist you today?",
                        //     isBot: true,
                        //     timestamp: new Date(),
                        //     status: 'read'
                        // };
                        // setMessages([welcomeMessage]);
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
                    setMessages([errorMessage]);
                }
            });

            // Listen for admin status changes
            socket.on("admin-status-changed", (status: 'online' | 'offline') => {
                console.log(`Admin is ${status}`);
                setAdminStatus(status);
            });

        } else {
            socket.emit("leave-room", "admin-room");
            socket.emit("disconnect-admin");
            socket.disconnect();

            // Reset to bot messages when switching back to bot mode
            const botWelcomeMessage: IBotMessage = {
                message: "👋 Hello! I'm GreenoBot, your eco-friendly assistant. How can I help you today?",
                isBot: true,
                timestamp: new Date(),
                status: 'read',
                showQuickReplies: true,
                quickReplies: 'initial'
            };
            setMessages([botWelcomeMessage]);
        }
    }, [chatMode]);

    useEffect(() => {
        // socket.on("admin-status-changed", ( status ) => {
        //     console.log(`admin is ${status}`);
        //     // Update admin status if the status update is for the admin
        //     // if (userId === adminId) {
        //     //     setAdminStatus(status);
        //     // }
        // });

        // Listen for incoming messages
        socket.on('receive-message', (message: IMessage) => {
            console.log("Received message:", message);

            // Only process incoming messages when in admin chat mode
            if (chatMode === 'admin') {
                const newMessage: IMessage = {
                    _id: message._id,
                    chatId: message.chatId,
                    message: message.message,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    timestamp: new Date(message.timestamp)
                };

                setMessages(prev => [...prev, newMessage]);
            }
        });

        // Listen for chat history
        socket.on('chat-history', (data: { messages: IMessage[] }) => {
            console.log("Received chat history:", data);
            setIsLoading(false);

            if (chatMode === 'admin') {
                if (data && data.messages && data.messages.length > 0) {
                    // Format the messages with proper timestamps
                    const formattedMessages: IMessage[] = data.messages.map((msg: IMessage) => ({
                        _id: msg._id,
                        chatId: msg.chatId,
                        message: msg.message,
                        timestamp: new Date(msg.timestamp),
                        senderId: msg.senderId,
                        receiverId: msg.receiverId,
                        isRead: msg.isRead,
                    }));

                    setMessages(formattedMessages);
                } else {
                    // If no messages, add a welcome message
                    const welcomeMessage: IBotMessage = {
                        message: "Welcome to Admin Support. How can we assist you today?",
                        isBot: true,
                        timestamp: new Date(),
                        status: 'read'
                    };
                    setMessages([welcomeMessage]);
                }
            }
        });

        // Clean up socket listeners on unmount
        return () => {
            socket.off('receive-message');
            socket.off('chat-history');
            socket.off('user-status-updated');
            socket.off('admin-status-changed');
            if (socket.connected && chatMode !== 'admin') {
                socket.disconnect();
            }
        };
    }, [userId, adminId, chatMode]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowNotification(false);
    };

    const simulateTyping = () => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    };

    const getBotResponse = (userMessage: string): { text: string; quickReplies: keyof typeof quickRepliesMap } => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('chat with admin')) {
            // Switch to admin mode
            setChatMode('admin');
            socket.emit('join-room', 'admin-room');
            return {
                text: "Connecting you to admin support...",
                quickReplies: 'initial'
            };
        } else if (lowerMessage.includes('recycle')) {
            return {
                text: "I'd be happy to help you with recycling! What would you like to know about our recycling services? 🌱",
                quickReplies: 'recycling'
            };
        } else if (lowerMessage.includes('pickup') || lowerMessage.includes('schedule')) {
            return {
                text: "Great! I can help you schedule a pickup. When would you like us to collect your recyclables? 📅",
                quickReplies: 'pickup'
            };
        } else if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('plan')) {
            return {
                text: "We offer several pricing plans to fit your needs. Would you like to see our options? 💰",
                quickReplies: 'pricing'
            };
        } else if (lowerMessage.includes('back to main') || lowerMessage.includes('main menu')) {
            return {
                text: "Back to the main menu. How else can I assist you today?",
                quickReplies: 'initial'
            };
        } else {
            return {
                text: "I'm here to help with recycling, scheduling pickups, and pricing information. What would you like to know about?",
                quickReplies: 'initial'
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent | string) => {
        if (typeof e !== 'string') {
            e.preventDefault();
        }
        const messageText = typeof e === 'string' ? e : message;
        if (!messageText.trim()) return;

        if (messageText.toLowerCase() === 'chat with admin') {
            // Switch to admin mode
            setChatMode('admin');
            return;
        }

        if (chatMode === 'admin') {

            setMessage('');

            // Send message to admin via socket
            // This will create a new chat if one doesn't exist
            socket.emit('send-message', {
                message: messageText,
                participant1: userId,
                participant2: adminId,
                participant1Role: 'user',
                participant2Role: 'admin',
                timestamp: new Date()
            });
        } else {
            // Add user message for bot chat
            const userBotMessage: IBotMessage = {
                message: messageText,
                isBot: false,
                timestamp: new Date(),
                status: 'sending'
            };

            setMessages(prev => [...prev, userBotMessage]);
            setMessage('');

            // Update status to sent
            setTimeout(() => {
                setMessages(prev =>
                    prev.map(msg => {
                        if (isBotMessage(msg) && !msg.isBot && msg.status === 'sending') {
                            return { ...msg, status: 'sent' };
                        }
                        return msg;
                    })
                );
            }, 500);

            // Handle bot chat
            simulateTyping();
            const response = getBotResponse(messageText);

            setTimeout(() => {
                const botMessage: IBotMessage = {
                    message: response.text,
                    isBot: true,
                    timestamp: new Date(),
                    status: 'read',
                    showQuickReplies: true,
                    quickReplies: response.quickReplies
                };
                setMessages(prev => [...prev, botMessage]);
            }, 2500);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-40">
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className={`${isOpen ? 'scale-0' : 'scale-100'
                    } group transition-all duration-300 bg-gradient-to-r from-green-900 to-green-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-2xl relative`}
            >
                <BiMessageRoundedDots className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                {showNotification && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-bounce">
                        1
                    </span>
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    } transition-all duration-300 origin-bottom-right absolute bottom-0 right-0 
                w-[calc(100vw-32px)] sm:w-[500px] h-[600px] 
                max-h-[calc(100vh-100px)]
                bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
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
                            onClick={() => setChatMode('admin')}
                            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${chatMode === 'admin'
                                ? 'bg-white/10 text-white border-b-2 border-white'
                                : 'text-green-100 hover:bg-white/5'
                                }`}
                        >
                            Admin Chat
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
                                        ? adminStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                                        : 'bg-green-400'
                                    } 
                                    border-2 border-white rounded-full`}>
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm sm:text-base">
                                    {chatMode === 'bot' ? 'GreenoBot' : 'Admin Support'}
                                </h3>
                                <p className="text-green-100 text-xs sm:text-sm">
                                    {isTyping ? 'Typing...' : 
                                     chatMode === 'admin' ? adminStatus : 'Online'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors relative group"
                        >
                            <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                Close chat
                            </span>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div
                                className={`flex ${(isBotMessage(msg) && msg.isBot) ||
                                    (isDatabaseMessage(msg) && msg.senderId !== userId)
                                    ? 'justify-start'
                                    : 'justify-end'
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${(isBotMessage(msg) && msg.isBot) ||
                                        (isDatabaseMessage(msg) && msg.senderId !== userId)
                                        ? 'bg-white text-gray-800 shadow-md'
                                        : 'bg-green-900 text-white'
                                        } relative group`}
                                >
                                    <p className="text-xs sm:text-sm">
                                        {isDatabaseMessage(msg) ? msg.message : msg.message}
                                    </p>
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
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-900 rounded-full text-xs sm:text-sm hover:bg-green-200 transition-colors"
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
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm focus:outline-none focus:border-green-900 bg-gray-50"
                        />
                        <button
                            type="submit"
                            className="bg-green-900 text-white p-2 sm:p-3 rounded-full hover:bg-green-800 transition-colors"
                        >
                            <BsSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatBot; 