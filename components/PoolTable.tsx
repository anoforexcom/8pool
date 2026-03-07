
import React, { useRef, useEffect, useState } from 'react';
import { PoolGameState, PoolBall } from '../types';
import { TABLE_WIDTH, TABLE_HEIGHT, POCKETS, BALL_RADIUS } from '../services/poolPhysics';

interface PoolTableProps {
    state: PoolGameState;
    onStrike: (power: number, angle: number) => void;
    onAim: (angle: number) => void;
}

const PoolTable: React.FC<PoolTableProps> = ({ state, onStrike, onAim }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [currentMouse, setCurrentMouse] = useState<{ x: number, y: number } | null>(null);

    const draw = (ctx: CanvasRenderingContext2D) => {
        // Clear
        ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

        // Draw Cloth
        ctx.fillStyle = '#0a5c2e';
        ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

        // Draw Cushions
        ctx.strokeStyle = '#064221';
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

        // Draw Pockets
        ctx.fillStyle = '#111';
        POCKETS.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, BALL_RADIUS * 1.8, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Balls
        const allBalls = [state.cueBall, ...state.balls];
        allBalls.forEach(ball => {
            if (ball.isPotted) return;

            // Shadow
            ctx.beginPath();
            ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fill();

            // Ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();

            // Highlight
            ctx.beginPath();
            ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fill();

            if (ball.type !== 'cue') {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 8px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ball.number.toString(), ball.x, ball.y);
            }
        });

        // Draw Cue/Aiming line
        if (state.gameState === 'aiming' && state.cueBall && currentMouse) {
            const dx = currentMouse.x - state.cueBall.x;
            const dy = currentMouse.y - state.cueBall.y;
            const angle = Math.atan2(dy, dx);

            // Aiming line
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(state.cueBall.x, state.cueBall.y);
            ctx.lineTo(state.cueBall.x - Math.cos(angle) * 200, state.cueBall.y - Math.sin(angle) * 200);
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.stroke();
            ctx.setLineDash([]);

            // Cue stick
            if (isDragging && dragStart) {
                const dragDist = Math.min(Math.sqrt(Math.pow(currentMouse.x - dragStart.x, 2) + Math.pow(currentMouse.y - dragStart.y, 2)), 100);
                const cueX = state.cueBall.x + Math.cos(angle) * (BALL_RADIUS + 10 + dragDist);
                const cueY = state.cueBall.y + Math.sin(angle) * (BALL_RADIUS + 10 + dragDist);

                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.moveTo(cueX, cueY);
                ctx.lineTo(cueX + Math.cos(angle) * 250, cueY + Math.sin(angle) * 250);
                ctx.strokeStyle = '#d4a373';
                ctx.stroke();

                // Power Bar
                const powerPercent = dragDist / 100;
                ctx.fillStyle = '#111';
                ctx.fillRect(10, TABLE_HEIGHT - 30, 200, 20);
                ctx.fillStyle = `rgb(${255 * powerPercent}, ${255 * (1 - powerPercent)}, 0)`;
                ctx.fillRect(10, TABLE_HEIGHT - 30, 200 * powerPercent, 20);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const render = () => {
            draw(ctx);
            animationId = window.requestAnimationFrame(render);
        };
        render();

        return () => window.cancelAnimationFrame(animationId);
    }, [state, currentMouse, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (state.gameState !== 'aiming') return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentMouse({ x, y });

        if (!isDragging && state.cueBall) {
            const dx = x - state.cueBall.x;
            const dy = y - state.cueBall.y;
            onAim(Math.atan2(dy, dx));
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging || !dragStart || !currentMouse || !state.cueBall) return;

        const dragDist = Math.min(Math.sqrt(Math.pow(currentMouse.x - dragStart.x, 2) + Math.pow(currentMouse.y - dragStart.y, 2)), 100);
        const dx = currentMouse.x - state.cueBall.x;
        const dy = currentMouse.y - state.cueBall.y;
        const angle = Math.atan2(dy, dx);

        if (dragDist > 5) {
            onStrike(dragDist / 5, angle);
        }

        setIsDragging(false);
        setDragStart(null);
    };

    return (
        <div className="relative inline-block bg-slate-800 p-4 rounded-xl shadow-2xl border-4 border-slate-700">
            <canvas
                ref={canvasRef}
                width={TABLE_WIDTH}
                height={TABLE_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}
                className="rounded bg-[#0a5c2e] cursor-crosshair"
            />

            {state.gameState === 'moving' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                    <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-slate-900 animate-pulse">
                        BALLS IN MOTION...
                    </div>
                </div>
            )}

            {state.gameState === 'opponent_thinking' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-full font-black shadow-xl animate-bounce">
                        OPPONENT IS THINKING...
                    </div>
                </div>
            )}

            {/* Info Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                <div className={`p-2 rounded-lg backdrop-blur-md border ${state.currentTurn === 'player' ? 'bg-indigo-600/80 border-white text-white shadow-lg' : 'bg-black/40 border-white/20 text-white/60'}`}>
                    <div className="text-[10px] font-black uppercase tracking-widest">Player</div>
                    <div className="text-sm font-bold">{state.playerType ? state.playerType.toUpperCase() : 'OPEN TABLE'}</div>
                </div>

                <div className={`p-2 rounded-lg backdrop-blur-md border ${state.currentTurn === 'opponent' ? 'bg-rose-600/80 border-white text-white shadow-lg' : 'bg-black/40 border-white/20 text-white/60'}`}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-right">{state.opponentName}</div>
                    <div className="text-sm font-bold text-right">{state.opponentType ? state.opponentType.toUpperCase() : 'OPEN TABLE'}</div>
                </div>
            </div>
        </div>
    );
};

export default PoolTable;
