import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import io from 'socket.io-client';
import { getChats } from '../../services/adminService';

// Initialize socket connection for admin
const socket = io("http://localhost:3007", {
    transports: ["websocket", "polling"],
    withCredentials: true,
});

interface ParticipantDetails {
    _id: string;
    name: string;
    profileUrl: string;
    role?: string;
    isOnline?: boolean;
    lastSeen?: Date;
    unreadCount?: number;
}

interface IChat {
    _id: string;
    participant1: string;
    participant1Role: string;
    participant1Details: ParticipantDetails;
    participant2: string;
    participant2Role: string;
    participant2Details: ParticipantDetails;
    lastMessage: string;
    createdAt: Date;
    updatedAt: Date;
    unreadCount?: number;
}

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

const AdminChat: React.FC = () => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentChat, setCurrentChat] = useState<IChat | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [userFilter, setUserFilter] = useState<'all' | 'user' | 'collector'>('all');
    const [chats, setChats] = useState<IChat[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            setIsLoading(true);
            try {
                const response = await getChats();
                console.log("chats response:", response);
                if (response.success) {
                    // Add unreadCount property to each chat
                    const chatsWithUnreadCount = response.data.map((chat: IChat) => ({
                        ...chat,
                        // unreadCount: 0, // Mock unread count - replace with actual data
                        createdAt: new Date(chat.createdAt),
                        updatedAt: new Date(chat.updatedAt)
                    }));

                    // Sort chats by updatedAt (most recent first)
                    chatsWithUnreadCount.sort((a: IChat, b: IChat) =>
                        b.updatedAt.getTime() - a.updatedAt.getTime()
                    );

                    setChats(chatsWithUnreadCount);
                } else {
                    console.error('Error fetching chats:', response.message);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChats();
    }, []);

    // Filter chats based on search term and role filter
    const filteredChats = chats.filter(chat => {
        const userName = chat.participant1Details.name.toLowerCase();
        const matchesSearch = userName.includes(searchTerm.toLowerCase());
        const matchesFilter = userFilter === 'all' || chat.participant1Role === userFilter;
        return matchesSearch && matchesFilter;
    });

    // Format time for messages and last message
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date for chat list
    const formatChatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Today
        if (diff < 86400000 && now.getDate() === date.getDate()) {
            return formatTime(date);
        }

        // Yesterday
        if (diff < 172800000 && now.getDate() - date.getDate() === 1) {
            return 'Yesterday';
        }

        // Within a week
        if (diff < 604800000) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[date.getDay()];
        }

        // Older
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Get online status text
    const getOnlineStatus = (user: ParticipantDetails) => {
        if (user.isOnline) return 'Online';

        if (!user.lastSeen) return 'Offline';

        const now = new Date();
        const diff = now.getTime() - user.lastSeen.getTime();

        // Less than a minute
        if (diff < 60000) return 'Just now';

        // Less than an hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        }

        // Less than a day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        }

        // More than a day
        return 'Offline';
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

        // Update status handler
        socket.on("status-updated", ({ userId, status }) => {
            console.log(`${userId} is ${status}`);
            // Update the chats list with new status
            setChats(prevChats =>
                prevChats.map(chat => {
                    if (chat.participant1 === userId) {
                        return {
                            ...chat,
                            participant1Details: {
                                ...chat.participant1Details,
                                isOnline: status === 'online',
                                lastSeen: status === 'offline' ? new Date() : chat.participant1Details.lastSeen
                            }
                        };
                    }
                    return chat;
                })
            );
        });

        return () => {
            socket.off('status-updated');
            socket.disconnect();
        };
    }, []); // Empty dependency array since this should only run once

    // Existing currentChat effect
    useEffect(() => {
        if (currentChat) {
            socket.connect();
            socket.emit('join-room', { chatId: currentChat._id, userId: currentChat.participant2 });

            // Set loading state while fetching messages
            setIsLoading(true);

            // Request chat history via socket instead of API call
            socket.emit('get-chat-history', { chatId: currentChat._id });

            // Listen for chat history response
            const handleChatHistory = (data: { messages: IMessage[] }) => {
                console.log("Received chat history:", data);

                if (data && data.messages) {
                    // Format the messages with proper timestamps
                    const formattedMessages = data.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                        status: 'read' // All past messages are considered read
                    }));

                    setMessages(formattedMessages);
                } else {
                    setMessages([]);
                }

                setIsLoading(false);
            };

            // Listen for incoming messages
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

                // Show typing indicator briefly
                // setIsTyping(true);
                // setTimeout(() => setIsTyping(false), 2000);
            };

            socket.on('chat-history', handleChatHistory);
            socket.on('receive-message', handleIncomingMessage);

            // Clear unread count for this chat
            setChats(prev =>
                prev.map(chat =>
                    chat._id === currentChat._id ? { ...chat, unreadCount: 0 } : chat
                )
            );

            return () => {
                // Remove other socket listeners but not status-updated
                socket.off('chat-history');
                socket.off('receive-message');
                socket.emit('leave-room', { chatId: currentChat._id, userId: currentChat.participant2 });
            };
        }
    }, [currentChat]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentChat) return;

        // const adminMessage: IMessage = {
        //     _id: Date.now().toString(),
        //     chatId: currentChat._id,
        //     message: message,
        //     timestamp: new Date(),
        //     senderId: currentChat.participant2, // Admin is participant2
        //     receiverId: currentChat.participant1, // User is participant1
        //     isRead: true,
        //     status: 'sending'
        // };

        // setMessages(prev => [...prev, adminMessage]);
        setMessage('');

        // Send message to user via socket
        socket.emit('send-message', {
            message: message,
            participant1: currentChat.participant2, // Admin is sending
            participant2: currentChat.participant1, // User is receiving
            participant1Role: 'admin',
            participant2Role: 'user',
            timestamp: new Date()
        });
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Chat List - Hidden on mobile when a chat is open */}
            {(!isMobileView || !currentChat) && (
                <div className={`${isMobileView ? 'w-full' : 'w-1/4'} border-r border-gray-200 bg-white`}>
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-[#0E2A39]">Conversations</h2>

                        {/* Search Bar */}
                        <div className="mt-3 relative">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E2A39] focus:border-transparent"
                            />
                            <IoMdSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex mt-4 border-b border-gray-200">
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${userFilter === 'all'
                                        ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                        : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${userFilter === 'user'
                                        ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                        : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('user')}
                            >
                                Users
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${userFilter === 'collector'
                                        ? 'text-[#0E2A39] border-b-2 border-[#0E2A39]'
                                        : 'text-gray-500 hover:text-[#0E2A39]'
                                    }`}
                                onClick={() => setUserFilter('collector')}
                            >
                                Collectors
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-500" />
                        </div>
                    ) : (
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            {filteredChats.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No conversations found</div>
                            ) : (
                                <ul>
                                    {filteredChats.map(chat => (
                                        <li
                                            key={chat._id}
                                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${currentChat?._id === chat._id ? 'bg-gray-100' : ''
                                                }`}
                                            onClick={() => setCurrentChat(chat)}
                                        >
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <img
                                                        src={chat.participant1Details.profileUrl || 'https://via.placeholder.com/150'}
                                                        alt={chat.participant1Details.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {chat.participant1Details.isOnline && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <h3 className="font-medium text-[#0E2A39]">{chat.participant1Details.name}</h3>
                                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${chat.participant1Role === 'collector'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {chat.participant1Role === 'collector' ? 'Collector' : 'User'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {formatChatDate(chat.updatedAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p className="text-sm text-gray-500 truncate max-w-[180px]">
                                                            {chat.lastMessage || 'No messages yet'}
                                                        </p>
                                                        {chat.unreadCount ? (
                                                            <span className="bg-[#0E2A39] text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
            )}

            {/* Chat Window */}
            <div className={`${isMobileView && !currentChat ? 'hidden' : 'flex'} flex-col ${isMobileView ? 'w-full' : 'w-3/4'}`}>
                {currentChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                            <div className="flex items-center">
                                {isMobileView && (
                                    <button
                                        onClick={() => setCurrentChat(null)}
                                        className="mr-2 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0E2A39]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}
                                <div className="relative">
                                    <img
                                        src={currentChat.participant1Details.profileUrl || 'https://via.placeholder.com/150'}
                                        alt={currentChat.participant1Details.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {currentChat.participant1Details.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-[#0E2A39]">{currentChat.participant1Details.name}</h3>
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${currentChat.participant1Role === 'collector'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {currentChat.participant1Role === 'collector' ? 'Collector' : 'User'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {getOnlineStatus(currentChat.participant1Details)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <button className="p-2 text-gray-500 hover:text-[#0E2A39] hover:bg-gray-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-500" />
                                    <span className="ml-2 text-gray-500">Loading messages...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            No messages yet. Start the conversation!
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg._id}
                                                className={`flex ${msg.senderId === currentChat.participant2 ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {msg.senderId === currentChat.participant1 && (
                                                    <img
                                                        src={currentChat.participant1Details.profileUrl || 'https://via.placeholder.com/150'}
                                                        alt={currentChat.participant1Details.name}
                                                        className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                                                    />
                                                )}
                                                <div
                                                    className={`max-w-[75%] p-3 rounded-lg ${msg.senderId === currentChat.participant2
                                                            ? 'bg-[#0E2A39] text-white rounded-br-none'
                                                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <span className="text-xs opacity-70">
                                                            {formatTime(msg.timestamp)}
                                                        </span>
                                                        {/* {msg.senderId === currentChat.participant2 && (
                                                    <span className="text-xs">
                                                        {msg.status === 'sending' && (
                                                            <AiOutlineLoading3Quarters className="animate-spin" />
                                                        )}
                                                        {msg.status === 'sent' && '✓'}
                                                        {msg.status === 'delivered' && '✓✓'}
                                                        {msg.status === 'read' && (
                                                            <span className="text-blue-300">✓✓</span>
                                                        )}
                                                    </span>
                                                )} */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <img
                                                src={currentChat.participant1Details.profileUrl || 'https://via.placeholder.com/150'}
                                                alt={currentChat.participant1Details.name}
                                                className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                                            />
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-[#0E2A39] transition-colors"
                                >
                                    <BsEmojiSmile className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 mx-3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0E2A39] focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-[#0E2A39] text-white rounded-full hover:bg-[#173C52] transition-colors"
                                    disabled={!message.trim()}
                                >
                                    <BsSend className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    // Empty state when no chat is selected (desktop view)
                    !isMobileView && (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-[#0E2A39]">Select a conversation</h3>
                                <p className="text-gray-500 mt-1">Choose a chat from the list to start messaging</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminChat; 