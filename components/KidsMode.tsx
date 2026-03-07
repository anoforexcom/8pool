import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, Sparkles, Heart } from 'lucide-react';
import { KidsState, KidsColor, KidsGridSize } from '../types';
import { generateKidsPuzzle, isValidKidsMove, isKidsPuzzleComplete, getColorsForGrid, getColorHex, getColorEmoji } from '../services/kidsLogic';

interface KidsModeProps {
    onBack: () => void;
}

const KidsMode: React.FC<KidsModeProps> = ({ onBack }) => {
    const [gridSize, setGridSize] = useState<KidsGridSize | null>(null);
    const [state, setState] = useState<KidsState | null>(null);
    const [completedLevels, setCompletedLevels] = useState<number>(0);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('kids-progress');
        if (saved) {
            setCompletedLevels(parseInt(saved));
        }
    }, []);

    const startGame = (size: KidsGridSize) => {
        setGridSize(size);
        const newState = generateKidsPuzzle(size, completedLevels + 1);
        setState(newState);
    };

    const handleCellClick = (row: number, col: number) => {
        if (!state) return;

        // Can't change initial cells
        if (state.initialBoard[row][col] !== null) return;

        setState({ ...state, selectedCell: [row, col] });
    };

    const handleColorClick = (color: KidsColor) => {
        if (!state || !state.selectedCell) return;

        const [row, col] = state.selectedCell;

        // Can't change initial cells
        if (state.initialBoard[row][col] !== null) return;

        // Validate move
        if (!isValidKidsMove(state.board, row, col, color)) {
            // Wrong move - shake animation
            return;
        }

        // Update board
        const newBoard = state.board.map((r, ri) =>
            r.map((c, ci) => (ri === row && ci === col ? color : c))
        );

        const isComplete = isKidsPuzzleComplete(newBoard, state.solution);

        setState({
            ...state,
            board: newBoard,
            isComplete,
            selectedCell: null
        });

        if (isComplete) {
            setShowCelebration(true);
            const newCompleted = completedLevels + 1;
            setCompletedLevels(newCompleted);
            localStorage.setItem('kids-progress', newCompleted.toString());

            setTimeout(() => {
                setShowCelebration(false);
            }, 3000);
        }
    };

    const handleNextLevel = () => {
        if (!gridSize) return;
        const newState = generateKidsPuzzle(gridSize, completedLevels + 1);
        setState(newState);
        setShowCelebration(false);
    };

    const handleBackToMenu = () => {
        setState(null);
        setGridSize(null);
    };

    // Level selection screen
    if (!gridSize || !state) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-lg font-black text-purple-600 hover:text-purple-700 mb-8"
                >
                    <ArrowLeft size={24} /> Back
                </button>

                <div className="max-w-4xl mx-auto text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-6xl mb-4">🐻</div>
                        <h1 className="text-5xl font-black text-purple-600 mb-2 uppercase tracking-tight">
                            Kids Mode
                        </h1>
                        <p className="text-xl text-purple-500 font-bold">
                            Fun Sudoku with Colors! 🎨
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="bg-white rounded-3xl p-6 mb-8 shadow-xl border-4 border-purple-200">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Trophy className="text-yellow-500" size={32} />
                            <span className="text-3xl font-black text-purple-600">
                                {completedLevels} Puzzles Solved!
                            </span>
                        </div>
                        <div className="flex justify-center gap-1 mt-4">
                            {[...Array(Math.min(completedLevels, 10))].map((_, i) => (
                                <Star key={i} size={24} fill="#FFD700" className="text-yellow-500" />
                            ))}
                        </div>
                    </div>

                    {/* Grid Size Selection */}
                    <h2 className="text-2xl font-black text-purple-600 mb-6 uppercase">
                        Choose Your Challenge:
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* 4x4 Grid */}
                        <button
                            onClick={() => startGame('4x4')}
                            className="bg-white rounded-3xl p-8 shadow-xl border-4 border-green-300 hover:border-green-400 hover:scale-105 transition-all active:scale-95"
                        >
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-3xl font-black text-green-600 mb-2">4×4</h3>
                            <div className="flex justify-center gap-1 mb-3">
                                <Star size={20} fill="#FFD700" className="text-yellow-500" />
                                <Star size={20} fill="#FFD700" className="text-yellow-500" />
                            </div>
                            <p className="text-lg font-bold text-green-500">Easy & Fun!</p>
                            <p className="text-sm text-gray-500 mt-2">Ages 4-6</p>
                        </button>

                        {/* 6x6 Grid */}
                        <button
                            onClick={() => startGame('6x6')}
                            className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-300 hover:border-blue-400 hover:scale-105 transition-all active:scale-95"
                        >
                            <div className="text-6xl mb-4">⭐</div>
                            <h3 className="text-3xl font-black text-blue-600 mb-2">6×6</h3>
                            <div className="flex justify-center gap-1 mb-3">
                                <Star size={20} fill="#FFD700" className="text-yellow-500" />
                                <Star size={20} fill="#FFD700" className="text-yellow-500" />
                                <Star size={20} fill="#FFD700" className="text-yellow-500" />
                            </div>
                            <p className="text-lg font-bold text-blue-500">More Challenge!</p>
                            <p className="text-sm text-gray-500 mt-2">Ages 7-10</p>
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="mt-12 bg-white rounded-3xl p-6 shadow-xl border-4 border-pink-200 max-w-2xl mx-auto">
                        <h3 className="text-xl font-black text-pink-600 mb-4 uppercase">How to Play:</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">1️⃣</div>
                                <p className="text-sm font-bold text-gray-700">
                                    Each row needs all different colors
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">2️⃣</div>
                                <p className="text-sm font-bold text-gray-700">
                                    Each column needs all different colors
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">3️⃣</div>
                                <p className="text-sm font-bold text-gray-700">
                                    Each box needs all different colors
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Game screen
    const colors = getColorsForGrid(state.gridSize);
    const gridSizeNum = state.gridSize === '4x4' ? 4 : 6;

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBackToMenu}
                        className="flex items-center gap-2 text-lg font-black text-purple-600 hover:text-purple-700"
                    >
                        <ArrowLeft size={24} /> Menu
                    </button>

                    <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border-4 border-purple-200">
                        <Trophy className="text-yellow-500" size={24} />
                        <span className="text-xl font-black text-purple-600">
                            Level {state.level}
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-2xl mx-auto">
                <div
                    className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border-4 border-purple-300 mb-6"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridSizeNum}, 1fr)`,
                        gap: '4px',
                        aspectRatio: '1/1'
                    }}
                >
                    {state.board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const isInitial = state.initialBoard[rowIndex][colIndex] !== null;
                            const isSelected = state.selectedCell?.[0] === rowIndex && state.selectedCell?.[1] === colIndex;

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    disabled={isInitial}
                                    className={`
                    rounded-2xl border-4 flex items-center justify-center text-4xl md:text-5xl font-black transition-all
                    ${isInitial ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-purple-200 bg-white hover:bg-purple-50 cursor-pointer'}
                    ${isSelected ? 'ring-4 ring-purple-400 scale-95' : ''}
                    ${cell ? 'shadow-lg' : ''}
                  `}
                                    style={{
                                        backgroundColor: cell ? getColorHex(cell) : undefined,
                                        color: cell ? 'white' : undefined,
                                        textShadow: cell ? '2px 2px 4px rgba(0,0,0,0.3)' : undefined
                                    }}
                                >
                                    {cell && getColorEmoji(cell)}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Color Picker */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200">
                    <h3 className="text-xl font-black text-purple-600 mb-4 text-center uppercase">
                        Pick a Color:
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorClick(color)}
                                className="aspect-square rounded-2xl border-4 border-purple-200 hover:border-purple-400 hover:scale-110 transition-all active:scale-95 flex items-center justify-center text-5xl shadow-lg"
                                style={{ backgroundColor: getColorHex(color) }}
                            >
                                {getColorEmoji(color)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Celebration Modal */}
            {showCelebration && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl border-4 border-yellow-300 animate-in zoom-in duration-500">
                        <div className="text-8xl mb-4 animate-bounce">🎉</div>
                        <h2 className="text-4xl font-black text-purple-600 mb-2 uppercase">
                            You're a Star!
                        </h2>
                        <p className="text-2xl font-bold text-pink-500 mb-6">
                            Amazing job! 🌟
                        </p>
                        <div className="flex justify-center gap-2 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={32} fill="#FFD700" className="text-yellow-500 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                        <button
                            onClick={handleNextLevel}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-xl uppercase hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
                        >
                            Next Level! 🚀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KidsMode;
