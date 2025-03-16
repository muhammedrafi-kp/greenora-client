import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'admin',
      text: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate admin response after a short delay
    setTimeout(() => {
      const adminResponse = {
        id: messages.length + 2,
        sender: 'admin',
        text: 'Thanks for your message. Our team will review your request and get back to you shortly.',
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages(prevMessages => [...prevMessages, adminResponse]);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
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
