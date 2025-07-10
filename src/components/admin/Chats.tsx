import React, { useState, useEffect, useRef } from 'react';
import { IoMdSearch } from "react-icons/io";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getChats } from '../../services/chatService';
import { IoPersonCircleOutline } from 'react-icons/io5';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ApiResponse } from '../../types/common';
import { IChat } from '../../types/chat';
import '../../styles/scrollbar.css';

import socket from "../../sockets/chatSocket";

interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    isRead?: boolean;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

// Add this function after the interfaces
const isValidImageUrl = (url: string): boolean => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
};

const AdminChat: React.FC = () => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentChat, setCurrentChat] = useState<IChat | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [userFilter, setUserFilter] = useState<'all' | 'user' | 'collector'>('all');
    const [chats, setChats] = useState<IChat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(false);
    const [filteredChats, setFilteredChats] = useState<IChat[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [imageErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchChats = async () => {
            setIsLoading(true);
            try {
                const res: ApiResponse<IChat[]> = await getChats();
                console.log("chats response:", res);
                if (res.success) {
                    setChats(res.data);
                    setFilteredChats(res.data);
                    // Fetch online users after chats are loaded
                    socket.emit("get_online_users");
                } else {
                    console.error('Error fetching chats:', res.message);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChats();
    }, []);

    // Add effect to filter chats when userFilter changes
    useEffect(() => {
        if (userFilter === 'all') {
            setFilteredChats(chats);
        } else {
            const filtered = chats.filter(chat => chat.participant2Role === userFilter);
            setFilteredChats(filtered);
        }
    }, [userFilter, chats]);

    // Format time for messages and last message
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date for chat list
    const formatChatDate = (date: Date | string) => {
        const dateObj = new Date(date);
        const now = new Date();
        const diff = now.getTime() - dateObj.getTime();

        // Today
        if (diff < 86400000 && now.getDate() === dateObj.getDate()) {
            return formatTime(dateObj);
        }

        // Yesterday
        if (diff < 172800000 && now.getDate() - dateObj.getDate() === 1) {
            return 'Yesterday';
        }

        // Within a week
        if (diff < 604800000) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[dateObj.getDay()];
        }

        // Older
        return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Move socket status listener outside of currentChat effect
    useEffect(() => {
        socket.connect();

        socket.emit("admin_connected");

        socket.on("online_users", (userList) => {
            console.log("online users :", userList);

            setChats(prevChats =>
                prevChats.map(chat => ({
                    ...chat,
                    isOnline: userList.includes(chat.participant2) ? true : false
                }))
            );
        });

        socket.on("user_online", (userId) => {
            console.log("user is online:", userId);
            console.log("currentChat on user online:", currentChat);

            if (currentChat?.participant2 === userId) {
                setCurrentChat(prev => prev ? { ...prev, isOnline: true } : null);
            }

            setChats(prev =>
                prev.map(chat =>
                    chat.participant2 === userId ? { ...chat, isOnline: true } : chat
                )
            );
        });

        socket.on("user_offline", (userId) => {
            console.log("user is offline:", userId);
            console.log("currentChat on user offline:", currentChat);

            if (currentChat?.participant2 === userId) {
                setCurrentChat(prev => prev ? { ...prev, isOnline: false } : null);
            }

            setChats(prev =>
                prev.map(chat =>
                    chat.participant2 === userId ? { ...chat, isOnline: false } : chat
                )
            );
        });

        // Add global typing event listeners
        const handleTyping = ({ chatId }: { chatId: string }) => {
            console.log("user is typing:", chatId);

            // Update current chat if it matches
            if (currentChat && chatId === currentChat._id) {
                setCurrentChat(prev => prev ? { ...prev, isTyping: true } : null);
            }

            // Update chat list
            setChats(prev =>
                prev.map(chat =>
                    chat._id === chatId ? { ...chat, isTyping: true } : chat
                )
            );
        };

        const handleStopTyping = ({ chatId }: { chatId: string }) => {
            console.log("user stopped typing:", chatId);

            // Update current chat if it matches
            if (currentChat && chatId === currentChat._id) {
                setCurrentChat(prev => prev ? { ...prev, isTyping: false } : null);
            }

            // Update chat list
            setChats(prev =>
                prev.map(chat =>
                    chat._id === chatId ? { ...chat, isTyping: false } : chat
                )
            );
        };

        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);

        return () => {
            socket.emit("admin_disconnected");
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.disconnect();
        };
    }, [currentChat]); // Remove currentChat dependency

    // Remove typing handlers from chat history effect since they're now handled globally
    useEffect(() => {
        if (!currentChat) return;

        const handleChatHistory = (data: { messages: IMessage[] }) => {
            console.log("Received chat history:", data);

            if (data && data.messages) {
                const formattedMessages = data.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                    status: 'read'
                }));

                setMessages(formattedMessages);
            } else {
                setMessages([]);
            }

            setIsLoadingChatHistory(false);
        };

        const handleIncomingMessage = (message: IMessage) => {
            console.log("Received message:", message);

            const newMessage: IMessage = {
                _id: message._id,
                chatId: message.chatId,
                message: message.message,
                senderId: message.senderId,
                receiverId: message.receiverId,
                timestamp: new Date(message.timestamp)
            };

            setMessages(prev => [...prev, newMessage]);

            setChats(prev =>
                prev.map(chat =>
                    chat._id === currentChat._id ? { ...chat, lastMessage: newMessage.message } : chat
                )
            );
        };

        // Join room and get chat history
        socket.emit('join_room', { chatId: currentChat._id, userId: currentChat.participant1 });
        setIsLoadingChatHistory(true);
        socket.emit('get_chat_history', { chatId: currentChat._id });

        // Set up event listeners
        socket.on('chat_history', handleChatHistory);
        socket.on('receive_message', handleIncomingMessage);

        // Clear unread count
        setChats(prev =>
            prev.map(chat =>
                chat._id === currentChat._id ? { ...chat, unreadCount: 0 } : chat
            )
        );

        return () => {
            socket.off('chat_history');
            socket.off('receive_message');
            socket.emit('leave_room', { chatId: currentChat._id, userId: currentChat.participant1 });
        };
    }, [currentChat?._id]); // Only depend on chat ID

    // Add typing event handler
    const handleTyping = () => {
        if (!currentChat) return;
        console.log("currentChat:", currentChat);
        // Emit typing event
        socket.emit('admin_typing', {
            chatId: currentChat._id,
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('admin_stop_typing', {
                chatId: currentChat._id,
            });
        }, 2000);
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

    // Add click outside handler for options menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentChat) return;

        setMessage('');

        // Send message to user via socket
        socket.emit('send_message', {
            message: message.trim(),
            senderId: currentChat.participant1, // Admin is sending
            receiverId: currentChat.participant2, // User is receiving
            timestamp: new Date()
        });
    };

    // const handleImageError = (chatId: string) => {
    //     setImageErrors(prev => ({ ...prev, [chatId]: true }));
    // };

    return (
        <div className="flex min-h-screen bg-gray-50 ">
            {/* Chat List - Hidden on mobile when a chat is open */}
            {(!isMobileView || !currentChat) && (
                <div className={`${isMobileView ? 'w-full' : 'w-1/4'} border-r border-gray-200 bg-white flex flex-col h-screen shadow-sm`}>
                    {/* Fixed Header */}
                    <div className="p-4 pb-0 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <h2 className="text-xl font-semibold text-[#0E2A39] mb-4">Messages</h2>

                        {/* Search Bar */}
                        <div className="mt-3 relative">
                            <input
                                type="text"
                                placeholder="Search chats"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0E2A39] focus:border-transparent bg-gray-50 text-sm"
                            />
                            <IoMdSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex mt-4 border-b border-gray-200">
                            <button
                                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${userFilter === 'all'
                                    ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                    : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${userFilter === 'user'
                                    ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                    : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('user')}
                            >
                                Users
                            </button>
                            <button
                                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${userFilter === 'collector'
                                    ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                    : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('collector')}
                            >
                                Collectors
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Chat List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#0E2A39]" />
                            </div>
                        ) : (
                            <div>
                                {filteredChats.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">No conversations found</div>
                                ) : (
                                    <ul>
                                        {filteredChats.map(chat => (
                                            <li
                                                key={chat._id}
                                                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${currentChat?._id === chat._id ? 'bg-gray-50' : ''
                                                    }`}
                                                onClick={() => setCurrentChat(chat)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        {chat.participant2ProfileUrl && isValidImageUrl(chat.participant2ProfileUrl) && !imageErrors[chat._id || ''] ? (
                                                            <img
                                                                src={chat.participant2ProfileUrl}
                                                                alt={chat.participant2Name}
                                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                                                                <IoPersonCircleOutline className="text-gray-400 text-2xl" />
                                                            </div>
                                                        )}
                                                        {chat.isOnline && (
                                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-semibold text-gray-800">{chat.participant2Name}</span>
                                                                <span className={`ml-2 text-xxs font-medium px-2 py-0.5 rounded-full ${chat.participant2Role === 'collector'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                    {chat.participant2Role === 'collector' ? 'Collector' : 'User'}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {formatChatDate(chat.updatedAt || new Date())}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-1">
                                                            {chat.isTyping ? (
                                                                <div className="flex items-center">
                                                                    <span className="text-xs text-gray-500 italic">typing...</span>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 truncate max-w-[180px]">
                                                                    {chat.lastMessage || 'No messages yet'}
                                                                </p>
                                                            )}

                                                            {chat.unreadCount ? (
                                                                <span className="bg-[#0E2A39] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                                                    {chat.unreadCount}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Window */}
            <div className={`${isMobileView && !currentChat ? 'hidden' : 'flex'} flex-col ${isMobileView ? 'w-full' : 'w-3/4'} h-screen bg-gray-50`}>
                {currentChat ? (
                    <>
                        {/* Chat Header - Fixed */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
                            <div className="flex items-center">
                                {isMobileView && (
                                    <button
                                        onClick={() => setCurrentChat(null)}
                                        className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0E2A39]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}
                                <div className="relative">
                                    {currentChat.participant2ProfileUrl && isValidImageUrl(currentChat.participant2ProfileUrl) && !imageErrors[currentChat._id || ''] ? (
                                        <img
                                            src={currentChat.participant2ProfileUrl}
                                            alt={currentChat.participant2Name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                                            <IoPersonCircleOutline className="text-gray-400 text-2xl" />
                                        </div>
                                    )}
                                    {currentChat.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-gray-800">{currentChat.participant2Name}</h3>
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${currentChat.participant2Role === 'collector'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {currentChat.participant2Role === 'collector' ? 'Collector' : 'User'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {currentChat.isOnline ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div ref={optionsRef} className="relative">
                                    <button
                                        className="p-2 text-gray-500 hover:text-[#0E2A39] hover:bg-gray-100 rounded-full transition-colors relative group"
                                        onClick={() => setShowOptions(!showOptions)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                    {showOptions && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    setCurrentChat(null);
                                                    setShowOptions(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Close Chat
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar" style={{ height: 'calc(100vh - 140px)' }}>
                            {isLoadingChatHistory ? (
                                <div className="flex justify-center items-center h-full">
                                    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#0E2A39]" />
                                    <span className="ml-2 text-gray-500">Loading messages...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                                            <p className="text-sm text-gray-500 mt-1">Start the conversation by sending a message</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg._id}
                                                className={`flex ${msg.senderId === currentChat.participant1 ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${msg.senderId === currentChat.participant1
                                                        ? 'bg-[#0E2A39] text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <span className={`text-xs ${msg.senderId === currentChat.participant1 ? 'text-gray-300' : 'text-gray-500'}`}>
                                                            {formatTime(msg.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {currentChat.isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                                <div className="flex gap-1">
                                                    <span key="dot1" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                    <span key="dot2" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span key="dot3" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-10 shadow-sm">
                            <div className="flex items-center relative">
                                <div ref={emojiPickerRef}>
                                    <button
                                        type="button"
                                        className="p-2 text-gray-500 hover:text-[#0E2A39] hover:bg-gray-200 rounded-full transition-colors relative group"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <BsEmojiSmile className="w-5 h-5" />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                            Emoji
                                        </span>
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-12 left-0 z-50">
                                            <EmojiPicker onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        handleTyping();
                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 mx-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E2A39] focus:border-transparent bg-gray-50 text-sm"
                                />
                                {message.trim() && (
                                    <button
                                        type="submit"
                                        className="p-2 bg-[#0E2A39] text-white rounded-full hover:bg-[#173C52] transition-colors relative group"
                                        disabled={!message.trim()}
                                    >
                                        <BsSend className="w-5 h-5" />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                            Send Message
                                        </span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    // Empty state when no chat is selected (desktop view)
                    !isMobileView && (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center p-6">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800">Select a conversation</h3>
                                <p className="text-gray-500 mt-2">Choose a chat from the list to start messaging</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminChat; 