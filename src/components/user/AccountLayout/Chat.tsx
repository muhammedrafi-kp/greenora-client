import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSpinner, FaComments } from 'react-icons/fa';

interface Message {
    _id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

interface ChatRoom {
    _id: string;
    collectionId: string;
    lastMessage: string;
    unreadCount: number;
    updatedAt: string;
}

const Chat: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch chat rooms
    useEffect(() => {
        const fetchChatRooms = async () => {
            setLoading(true);
            try {
                // Add API call to fetch chat rooms
                // const response = await getChatRooms();
                // setChatRooms(response.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatRooms();
    }, []);

    // Fetch messages for selected room
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedRoom) return;
            
            setLoading(true);
            try {
                // Add API call to fetch messages
                // const response = await getMessages(selectedRoom);
                // setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedRoom]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedRoom) return;

        try {
            // Add API call to send message
            // await sendMessage(selectedRoom, newMessage);
            
            // Optimistically add message to UI
            const tempMessage: Message = {
                _id: Date.now().toString(),
                senderId: 'currentUserId', // Replace with actual user ID
                content: newMessage,
                timestamp: new Date().toISOString(),
                isRead: false
            };
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderEmptyState = () => (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaComments className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Chats Available</h3>
            <p className="text-sm text-gray-500 max-w-sm">
                Your chat conversations related to waste collections will appear here.
                Start a collection request to begin chatting.
            </p>
        </div>
    );

    return (
        <div className="h-[calc(100vh-200px)] flex">
            {/* Chat Rooms List */}
            <div className="w-1/3 border-r overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Chats</h2>
                    {loading ? (
                        <div className="flex justify-center">
                            <FaSpinner className="animate-spin text-green-800" />
                        </div>
                    ) : chatRooms.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No chat rooms available
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {chatRooms.map(room => (
                                <div
                                    key={room._id}
                                    onClick={() => setSelectedRoom(room._id)}
                                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                                        selectedRoom === room._id ? 'bg-green-50' : ''
                                    }`}
                                >
                                    <div className="font-medium">Collection #{room.collectionId}</div>
                                    <div className="text-sm text-gray-500 truncate">{room.lastMessage}</div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(room.updatedAt).toLocaleDateString()}
                                    </div>
                                    {room.unreadCount > 0 && (
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            {room.unreadCount}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="w-2/3 flex flex-col">
                {selectedRoom ? (
                    <>
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {messages.map(message => (
                                <div
                                    key={message._id}
                                    className={`mb-4 flex ${
                                        message.senderId === 'currentUserId' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                            message.senderId === 'currentUserId'
                                                ? 'bg-green-100 text-green-900'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                    </>
                ) : chatRooms.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat; 