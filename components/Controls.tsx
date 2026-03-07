
import React from 'react';
import { Eraser, Undo2, PencilLine, Sparkles, RotateCcw, Pause } from 'lucide-react';

interface ControlsProps {
  onStrike: () => void;
  onAction: (action: string) => void;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStrike, onAction, canUndo }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-around items-center">
        <button onClick={() => onAction('reset')} className="flex flex-col items-center gap-1 hover:text-indigo-600">
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><RotateCcw size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">RESET RACK</span>
        </button>

        <button onClick={() => onAction('reveal')} className="flex flex-col items-center gap-1 hover:text-emerald-500">
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><Sparkles size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">HINT (-10)</span>
        </button>

        <button onClick={() => onAction('pause')} className="flex flex-col items-center gap-1 hover:text-amber-500">
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><Pause size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">PAUSE</span>
        </button>
      </div>

      <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 py-4 rounded-2xl border border-dashed border-slate-200">
        DRAG CUE BACK TO AIM & STRIKE
      </div>
    </div>
  );
};

export default Controls;
