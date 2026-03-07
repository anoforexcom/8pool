
import React from 'react';
import { SudokuState } from '../types';

interface SudokuGridProps {
  state: SudokuState;
  onCellClick: (row: number, col: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ state, onCellClick }) => {
  const { board, initialBoard, selectedCell, solution } = state;

  const getCellStyle = (r: number, c: number) => {
    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
    const isInitial = initialBoard[r][c] !== null;
    const isSameValue = selectedCell && board[r][c] !== null && board[r][c] === board[selectedCell[0]][selectedCell[1]];
    const isSameArea = selectedCell && (selectedCell[0] === r || selectedCell[1] === c || (Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) && Math.floor(selectedCell[1] / 3) === Math.floor(c / 3)));
    const isError = board[r][c] !== null && board[r][c] !== solution[r][c];

    let base = "relative flex items-center justify-center text-xl sm:text-2xl font-medium cursor-pointer transition-all duration-150 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 ";

    if (isSelected) base += "bg-indigo-600 text-white z-10 scale-105 shadow-lg ";
    else if (isError) base += "bg-red-100 text-red-600 ";
    else if (isSameValue) base += "bg-indigo-200 text-indigo-900 ";
    else if (isSameArea) base += "bg-indigo-50 text-indigo-800 ";
    else base += "bg-white text-slate-700 hover:bg-slate-50 ";

    if (isInitial && !isSelected) base += "font-bold text-slate-900 ";

    return base;
  };

  const getBorderClasses = (r: number, c: number) => {
    let classes = "border-slate-200 ";
    if (c === 2 || c === 5) classes += "border-r-2 border-r-slate-400 ";
    else if (c !== 8) classes += "border-r ";

    if (r === 2 || r === 5) classes += "border-b-2 border-b-slate-400 ";
    else if (r !== 8) classes += "border-b ";

    return classes;
  };

  return (
    <div className="inline-block p-1 bg-slate-400 rounded-lg shadow-2xl">
      <div className="grid grid-cols-9 bg-white overflow-hidden rounded-md border-2 border-slate-400">
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`${getCellStyle(r, c)} ${getBorderClasses(r, c)}`}
              onClick={() => onCellClick(r, c)}
            >
              {val !== null ? (
                val
              ) : (
                <div className="grid grid-cols-3 w-full h-full p-0.5 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <div key={n} className="text-[8px] sm:text-[10px] flex items-center justify-center text-slate-400 leading-none">
                      {state.notes[r][c].has(n) ? n : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;
