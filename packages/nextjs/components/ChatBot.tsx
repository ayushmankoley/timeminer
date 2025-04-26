import React, { useState, useEffect } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { sendMessage } from '~~/services/chatService';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: `Welcome to TimeMiner! 🎮

• I'm Chrono, your dedicated game assistant and blockchain expert! ⚡️

• Here's what I can help you with:
  - Game mechanics and strategies 🎯
  - Blockchain mining concepts ⛏️
  - TimeMiner features and updates 🚀
  - Tips and tricks for success 💡

• Feel free to ask me anything about the game or blockchain mining!

⚡️ Ready to mine some knowledge? Let's get started!`
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key not found');
      }

      const response = await sendMessage(input, apiKey);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-focus transition-colors"
        >
          <IoChatbubbleEllipsesOutline className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-base-100 rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/img/bot.png"
                  alt="Chrono Avatar"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold">Chrono - TimeMiner Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      src="/img/bot.png"
                      alt="Chrono Avatar"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-base-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/img/bot.png"
                    alt="Chrono Avatar"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <div className="bg-base-200 p-3 rounded-lg">
                  Chrono is thinking... ⏳
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Chrono anything..."
                className="input input-bordered flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}; 
