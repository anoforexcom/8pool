
import React from 'react';
import { X, Trophy, Medal, User, Users, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300">
        <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white relative flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-5">
            <Trophy size={32} className="text-amber-400 drop-shadow-lg" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">Global Ranking</h2>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-2">The Top 100 Masters Worldwide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-white/10 rounded-full transition-all border border-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
              <tr>
                <th className="px-4 sm:px-6 py-4"># Rank</th>
                <th className="px-4 sm:px-6 py-4">Player</th>
                <th className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">Levels</th>
                <th className="px-4 sm:px-6 py-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <Users size={48} className="opacity-20" />
                      <p className="font-black uppercase tracking-[0.2em] text-xs">Waiting for competition data...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <tr 
                      key={index} 
                      className={`${entry.isCurrentUser ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50/50'} transition-all`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm">
                          {rank === 1 ? <Medal className="text-amber-400 drop-shadow-sm" size={24} /> : 
                           rank === 2 ? <Medal className="text-slate-300" size={24} /> : 
                           rank === 3 ? <Medal className="text-amber-700" size={24} /> : 
                           <span className="text-slate-300">#{rank}</span>}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm ${entry.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-400'}`}>
                            {entry.isCurrentUser ? <Star size={16} className="fill-current" /> : <User size={16} />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-black tracking-tight text-xs sm:text-sm ${entry.isCurrentUser ? 'text-indigo-600' : 'text-slate-700'}`}>
                              {entry.name} {entry.isCurrentUser && '(YOU)'}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase sm:hidden">
                              {entry.levels} Levels
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center font-black text-slate-500 text-xs hidden sm:table-cell">
                        {entry.levels}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <span className="font-black text-indigo-600 font-mono text-sm sm:text-lg">
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] flex-shrink-0">
          Rankings updated in real-time based on solving performance
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
