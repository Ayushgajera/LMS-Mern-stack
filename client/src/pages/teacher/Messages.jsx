import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiStar, FiPaperclip, FiSend,
  FiMoreVertical, FiTrash2, FiArchive 
} from 'react-icons/fi';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages] = useState([
    {
      id: 1,
      user: {
        name: 'Alice Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson'
      },
      preview: 'Question about React course module 3',
      time: '10:30 AM',
      unread: true
    },
    {
      id: 2,
      user: {
        name: 'Bob Smith',
        avatar: 'https://ui-avatars.com/api/?name=Bob+Smith'
      },
      preview: 'Thanks for the feedback on my assignment',
      time: '09:45 AM',
      unread: false
    }
  ]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar - Updated for mobile */}
      <div className={`
        w-full lg:w-80 xl:w-96 
        border-r bg-white
        ${selectedChat ? 'hidden lg:block' : 'block'}
      `}>
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {messages.map((message) => (
            <MessagePreview 
              key={message.id}
              message={message}
              isSelected={selectedChat === message.id}
              onClick={() => setSelectedChat(message.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat Area - Updated for mobile */}
      <div className={`
        flex-1 
        ${selectedChat ? 'block' : 'hidden lg:flex'}
        bg-gray-50
      `}>
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="lg:hidden">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-4 text-blue-600 hover:text-blue-800"
              >
                ← Back to messages
              </button>
            </div>
            <ChatHeader chat={messages.find(m => m.id === selectedChat)} />
            <ChatMessages />
            <ChatInput />
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MessagePreview = ({ message, isSelected, onClick }) => (
  <motion.div
    whileHover={{ backgroundColor: '#F3F4F6' }}
    onClick={onClick}
    className={`
      p-4 cursor-pointer
      ${isSelected ? 'bg-blue-50' : ''}
      hover:bg-gray-50
    `}
  >
    <div className="flex items-center gap-3">
      <img 
        src={message.user.avatar} 
        alt="" 
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{message.user.name}</p>
          <p className="text-xs text-gray-500 flex-shrink-0">{message.time}</p>
        </div>
        <p className="text-sm text-gray-500 truncate">{message.preview}</p>
      </div>
      {message.unread && (
        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
      )}
    </div>
  </motion.div>
);

const ChatHeader = ({ chat }) => {
  if (!chat) return null;
  
  return (
    <div className="bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center min-w-0">
        <img 
          src={chat.user.avatar} 
          alt="" 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
        />
        <div className="ml-3 flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{chat.user.name}</h3>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-3">
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <FiArchive className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <FiMoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

const ChatMessages = () => {
  const [chatMessages] = useState([
    {
      id: 1,
      sender: 'student',
      text: 'Hi, I have a question about the React course module 3.',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'instructor',
      text: 'Sure, I\'d be happy to help! What specific part are you having trouble with?',
      time: '10:32 AM'
    },
    // Add more messages as needed
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {chatMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`
            max-w-[85%] sm:max-w-[70%] 
            rounded-lg px-3 sm:px-4 py-2 
            ${msg.sender === 'instructor' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-900'
            }
          `}>
            <p className="text-sm break-words">{msg.text}</p>
            <p className={`text-xs mt-1 ${
              msg.sender === 'instructor' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {msg.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add logic to send message
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
        >
          <FiPaperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 sm:px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};

export default Messages;