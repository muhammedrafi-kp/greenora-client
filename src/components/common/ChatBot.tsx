import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsSend } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import { BiMessageRoundedDots } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Message {
    text: string;
    isBot: boolean;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    showQuickReplies?: boolean;
    quickReplies?: 'initial' | 'recycling' | 'pickup' | 'pricing';
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "👋 Hello! I'm GreenoBot, your eco-friendly assistant. How can I help you today?",
            isBot: true,
            timestamp: new Date(),
            status: 'read',
            showQuickReplies: true
        }
    ]);

    const quickRepliesMap = {
        initial: [
            "How can I recycle?",
            "Schedule a pickup",
            "Pricing plans",
            "Contact support"
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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
        
        if (lowerMessage.includes('recycle')) {
            return {
                text: "I'd be happy to help you with recycling! What would you like to know about our recycling services? 🌱",
                quickReplies: 'recycling'
            };
        } else if (lowerMessage.includes('pickup') || lowerMessage.includes('schedule')) {
            return {
                text: "Let's help you schedule a pickup! What would you like to do? 📅",
                quickReplies: 'pickup'
            };
        } else if (lowerMessage.includes('price') || lowerMessage.includes('plan')) {
            return {
                text: "I can help you find the perfect plan for your needs! What information would you like? 💰",
                quickReplies: 'pricing'
            };
        } else if (lowerMessage.includes('back to main')) {
            return {
                text: "Here's what I can help you with! Please select an option below. 🌟",
                quickReplies: 'initial'
            };
        }

        return {
            text: "I understand you're interested in this. How can I assist you further? 🌱",
            quickReplies: 'initial'
        };
    };

    const handleSubmit = (e: React.FormEvent | string) => {
        if (typeof e !== 'string') {
            e.preventDefault();
        }
        const messageText = typeof e === 'string' ? e : message;
        if (!messageText.trim()) return;

        // Add user message
        const userMessage: Message = {
            text: messageText,
            isBot: false,
            timestamp: new Date(),
            status: 'sending'
        };
        
        setMessages(prev => [...prev, userMessage]);
        setMessage('');

        // Update status to sent
        setTimeout(() => {
            setMessages(prev => 
                prev.map((msg, idx) => 
                    idx === prev.length - 1 ? { ...msg, status: 'sent' } : msg
                )
            );
        }, 500);

        // Simulate bot typing
        simulateTyping();

        // Get bot response
        const response = getBotResponse(messageText);

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                text: response.text,
                isBot: true,
                timestamp: new Date(),
                status: 'read',
                showQuickReplies: true
            };
            setMessages(prev => [...prev, botMessage]);
        }, 2500);
    };

    return (
        <div className="fixed bottom-4 right-4 z-40">
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className={`${
                    isOpen ? 'scale-0' : 'scale-100'
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
                className={`${
                    isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                } transition-all duration-300 origin-bottom-right absolute bottom-0 right-0 
                w-[calc(100vw-32px)] sm:w-[400px] h-[600px] 
                max-h-[calc(100vh-100px)]
                bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-900 to-green-800 p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                            <div className="bg-white p-1.5 sm:p-2 rounded-full shadow-md">
                                <FaRobot className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-sm sm:text-base">GreenoBot</h3>
                            <p className="text-green-100 text-xs sm:text-sm">
                                {isTyping ? 'Typing...' : 'Online'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleChat}
                        className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors"
                    >
                        <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                                        msg.isBot
                                            ? 'bg-white text-gray-800 shadow-md'
                                            : 'bg-green-900 text-white'
                                    } relative group`}
                                >
                                    <p className="text-xs sm:text-sm">{msg.text}</p>
                                    <div className="flex items-center justify-end gap-1.5 sm:gap-2 mt-1">
                                        <p className="text-[10px] sm:text-xs opacity-70">
                                            {msg.timestamp.toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                        {!msg.isBot && (
                                            <span className="text-[10px] sm:text-xs">
                                                {msg.status === 'sending' && (
                                                    <AiOutlineLoading3Quarters className="animate-spin" />
                                                )}
                                                {msg.status === 'sent' && '✓'}
                                                {msg.status === 'delivered' && '✓✓'}
                                                {msg.status === 'read' && (
                                                    <span className="text-blue-400">✓✓</span>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {msg.isBot && msg.showQuickReplies && (
                                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                                    {quickRepliesMap[msg.quickReplies || 'initial'].map((reply, idx) => (
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