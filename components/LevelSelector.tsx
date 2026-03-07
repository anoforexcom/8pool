
import React from 'react';
import { LEVELS, TOTAL_LEVELS } from '../constants';
import { X, Trophy } from 'lucide-react';

interface LevelSelectorProps {
  onSelect: (level: number) => void;
  onClose: () => void;
  completedLevels: number[];
  currentLevel: number;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect, onClose, completedLevels, currentLevel }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Select Level</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{TOTAL_LEVELS} Challenges from Beginner to Master</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all shadow-sm border border-slate-100">
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-4">
            {LEVELS.map((level) => {
              const isCompleted = completedLevels.includes(level.id);
              const isCurrent = currentLevel === level.id;
              
              const getDifficultyColor = () => {
                switch(level.difficulty) {
                  case 'Easy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
                  case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
                  case 'Hard': return 'bg-orange-50 text-orange-600 border-orange-100';
                  case 'Expert': return 'bg-rose-50 text-rose-600 border-rose-100';
                }
              };

              return (
                <button
                  key={level.id}
                  onClick={() => onSelect(level.id)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                    isCurrent 
                      ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100 shadow-xl' 
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-100 bg-white hover:border-indigo-200'
                  }`}
                >
                  <span className={`text-2xl font-black ${isCurrent ? 'text-indigo-700' : isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>{level.id}</span>
                  <div className={`mt-2 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${getDifficultyColor()}`}>
                    {level.difficulty}
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-4 border-white shadow-lg animate-in zoom-in duration-300">
                      <Trophy size={12} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Master {TOTAL_LEVELS} handcrafted grids to unlock the Final Prize
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
