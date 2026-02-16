
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { ThemeMode } from '../types';
import { THEMES } from '../constants';
import GlassCard from './GlassCard';

interface AIChatAssistantProps {
  theme: ThemeMode;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ theme }) => {
  const activeTheme = THEMES[theme];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am the NeuTraze Assistant. How can I help you achieve a futuristic clean today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => m.text), userMsg].join('\n'),
        config: {
          systemInstruction: 'You are the NeuTraze AI Sales Assistant. We sell high-end "Liquid Glass" cleaning products. Be professional, sleek, and futuristic. If a user wants to buy or order, guide them to the Contact page. Keep responses concise and focused on cleaning technology.',
          maxOutputTokens: 200,
        },
      });

      const aiText = response.text || "I'm sorry, I'm having trouble connecting to the NeuTraze network.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Connectivity error. Please try again or visit our contact page.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px]"
          >
            <GlassCard themeClass={`${activeTheme.glass} shadow-2xl ring-1 ring-white/20`} className="!p-0 h-[500px] flex flex-col">
              {/* Header */}
              <div className={`p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r ${activeTheme.accent} text-white`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-bold">NeuTraze AI</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      m.role === 'user' 
                        ? `bg-gradient-to-br ${activeTheme.accent} text-white` 
                        : `glass ${activeTheme.glass} ${activeTheme.text}`
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`glass ${activeTheme.glass} px-4 py-2 rounded-2xl`}>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about Liquid Glass..."
                  className={`flex-1 bg-black/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 ${activeTheme.text}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className={`p-2 rounded-xl bg-gradient-to-r ${activeTheme.accent} text-white shadow-lg`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 bg-gradient-to-br ${activeTheme.accent}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default AIChatAssistant;
