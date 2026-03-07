
import React from 'react';
import { Eraser, Undo2, PencilLine, Sparkles, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onNumberClick: (num: number) => void;
  onAction: (action: string) => void;
  notesMode: boolean;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onNumberClick, onAction, notesMode, canUndo }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-around items-center">
        <button onClick={() => onAction('undo')} disabled={!canUndo} className={`flex flex-col items-center gap-1 ${canUndo ? 'opacity-100' : 'opacity-30'}`}>
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><Undo2 size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest">UNDO</span>
        </button>

        <button onClick={() => onAction('erase')} className="flex flex-col items-center gap-1 hover:text-rose-500">
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><Eraser size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest">ERASE</span>
        </button>

        <button onClick={() => onAction('notes')} className={`flex flex-col items-center gap-1 ${notesMode ? 'text-indigo-600' : 'text-slate-500'}`}>
          <div className={`p-3 rounded-full border shadow-sm ${notesMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200'}`}>
            <PencilLine size={24} />
          </div>
          <span className="text-[8px] font-black tracking-widest uppercase">{notesMode ? 'NOTES: ON' : 'NOTES: OFF'}</span>
        </button>

        <button onClick={() => onAction('reveal')} className="flex flex-col items-center gap-1 hover:text-emerald-500">
          <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm"><Sparkles size={24} /></div>
          <span className="text-[8px] font-black text-slate-500 tracking-widest">HINT</span>
        </button>
      </div>

      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="aspect-square flex items-center justify-center bg-white border border-slate-200 rounded-lg text-2xl font-black text-slate-800 hover:bg-indigo-50 active:scale-95 transition-all shadow-sm"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
