
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Send, MessageCircle, Search } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatGroupProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  userName: string;
}

const USER_COLORS = [
  { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  { text: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' },
  { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
];

const ChatGroup: React.FC<ChatGroupProps> = ({ messages, onSendMessage, onClose, userName }) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !searchQuery) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, searchQuery]);

  const getUserStyles = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % USER_COLORS.length;
    return USER_COLORS[index];
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter(msg =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-96 sm:h-[550px] bg-white sm:rounded-[2.5rem] shadow-2xl z-[60] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 bg-indigo-600 text-white flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest">Global Chat</h3>
            <p className="text-[10px] font-bold text-indigo-100 opacity-80 uppercase tracking-tighter">Community Group</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-50 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-[10px] uppercase tracking-wider"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-4">
            <Search size={48} className="opacity-10" />
            <p className="text-xs font-black uppercase tracking-widest">
              {searchQuery ? 'No matching messages' : 'No messages yet'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const styles = msg.isMe ? null : getUserStyles(msg.sender);
            return (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className={`text-[9px] font-black uppercase tracking-tight ${msg.isMe ? 'text-indigo-600' : styles?.text}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[8px] text-slate-300 font-bold">
                    {msg.timestamp && !isNaN(msg.timestamp)
                      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'}
                  </span>
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all duration-200 ${msg.isMe
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
                  : `${styles?.bg} ${styles?.text} ${styles?.border} border rounded-tl-none`
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2 bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatGroup;
