
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Message } from '../types';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the PlacementOS AI Prototype! I'm your dedicated career strategist. I can help with placement advice, learning paths, and interview prep. How can I assist your career journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(messages, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response || 'I apologize, I encountered a connection error. Please try again.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error in prototype environment. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden relative">
      <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">✨</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Career Strategy AI</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Prototype Assistant</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="text-[10px] text-slate-400 font-medium">Gemini 3 Flash</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors">⚙️</button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#F8FAFC]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[75%] px-6 py-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 rounded-tl-none shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-transparent focus-within:border-blue-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about placement prep, companies, or learning..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm font-medium outline-none text-slate-700"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            Send
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">Hackathon AI Prototype Disclaimer: For evaluation only.</p>
      </div>
    </div>
  );
};

export default Assistant;
