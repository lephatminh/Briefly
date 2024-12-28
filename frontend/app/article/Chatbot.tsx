import React, { useState } from 'react';
import MessageBubble from '@/components/message/MessageBubble';
import { IoSend } from "react-icons/io5";

const BotService = {
  sendMessage: async (message: string, articleId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DEPLOY}/article/ask/?q=${encodeURIComponent(message)}&id=${encodeURIComponent(articleId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot response');
      }

      const data = await response.json();
      return data.response; // Assuming the backend returns a `reply` field
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Sorry, something went wrong. Please try again later.';
    }
  },
};


const Chatbot = ({ articleId, className }: {articleId: string, className?: string}) => {
  const [messages, setMessages] = useState<{ content: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: { content: string; sender: 'user' } = { content: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setLoading(true);

      const botResponse = await BotService.sendMessage(input, articleId);
      const botMessage: { content: string; sender: 'bot' } = { content: botResponse, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setLoading(false);
    }
  };

  return (
    <div className={`prose lg:prose-xl dark:prose-invert w-full overflow-auto flex flex-col rounded-md p-3 ${className}`}>
      <div className="chat-window flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} content={msg.content} sender={msg.sender} />
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="p-2 rounded-lg bg-gray-300 text-black max-w-xs break-words">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`flex ${messages.length > 0 && 'mt-16'}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border rounded-xl shadow-md"
          placeholder='Ask AI Anything about the subject.'
        />
        <button onClick={handleSendMessage} className="ml-2 p-2 dark:text-white rounded-md dark:hover:text-gray-300 text-gray-900 hover:text-gray-400">
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;