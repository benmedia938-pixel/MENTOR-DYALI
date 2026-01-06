import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToMentor, analyzeFile } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Fin wselti? 3tini l\'mouchkil li 7abssek daba.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass last 10 messages for context
      const history = messages.slice(-10).map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToMentor(userMsg.text, history);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error. Check connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsg: Message = { role: 'user', text: `Uploaded file: ${file.name}` };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const analysis = await analyzeFile(file);
      setMessages(prev => [...prev, { role: 'model', text: analysis }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Failed to analyze file." }]);
    } finally {
      setIsLoading(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                msg.role === 'user' 
                  ? 'bg-slate-700 text-white rounded-br-none' 
                  : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && <span className="block text-xs text-gold-500 font-bold mb-1 uppercase tracking-wider">Stoic Mentor</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none flex space-x-2">
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center bg-slate-800 rounded-full border border-slate-700 focus-within:border-gold-500/50 transition-colors">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-gold-400 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
                accept=".pdf,image/*,.txt"
            />
            
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Strategy..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none px-2 py-3"
            />
            
            <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 mr-2 bg-gold-500 rounded-full text-slate-900 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;