
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

    // Coordinate Mapping: Maps screen event coordinates to internal 800x400 table coordinates
    const getTableCoords = (clientX: number, clientY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };

        // Scale factor between internal 800x400 and actual displayed size
        const scaleX = TABLE_WIDTH / rect.width;
        const scaleY = TABLE_HEIGHT / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

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

            // For striped balls (9-15), draw a thick central stripe
            if (ball.type === 'stripe') {
                ctx.beginPath();
                // Draw a clip region for the full ball
                ctx.save();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.clip();

                // Base colors: White background with a colored stripe
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);

                // Colored Stripe
                ctx.fillStyle = ball.color;
                // Rotating the stripe based on x/y coordinates to give a subtle 3D roll effect
                const angle = (ball.x + ball.y) * 0.05;
                ctx.translate(ball.x, ball.y);
                ctx.rotate(angle);
                ctx.fillRect(-ball.radius, -ball.radius * 0.5, ball.radius * 2, ball.radius);
                ctx.restore();
            } else {
                // Solid balls
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();
            }

            // White Circle (Number plate)
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius * 0.55, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Highlight (Glossy effect)
            ctx.beginPath();
            ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();

            if (ball.type !== 'cue') {
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Adjust for rotation if striped? No, keep number upright for readability
                ctx.fillText(ball.number.toString(), ball.x, ball.y + 0.5);
            }
        });

        // Draw Cue/Aiming line
        if (state.gameState === 'aiming' && state.cueBall && currentMouse) {
            const dx = currentMouse.x - state.cueBall.x;
            const dy = currentMouse.y - state.cueBall.y;
            const angle = Math.atan2(dy, dx);

            // Thin Aiming line
            ctx.beginPath();
            ctx.setLineDash([3, 4]); // Much finer dashes
            ctx.lineWidth = 1; // Thinner
            ctx.moveTo(state.cueBall.x, state.cueBall.y);
            ctx.lineTo(state.cueBall.x - Math.cos(angle) * 800, state.cueBall.y - Math.sin(angle) * 800); // Longer trajectory
            ctx.strokeStyle = state.useSuperAim ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255,255,255,0.3)';
            ctx.lineWidth = state.useSuperAim ? 1.5 : 1;
            ctx.stroke();

            if (state.useSuperAim) {
                // Draw a circle at the far end to show "Ghost Ball" contact if we want, 
                // but let's just make the line very solid for now
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.arc(state.cueBall.x - Math.cos(angle) * 150, state.cueBall.y - Math.sin(angle) * 150, BALL_RADIUS, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
                ctx.stroke();
            }

            ctx.setLineDash([]);
            ctx.lineWidth = 1; // Reset

            // Note: Cue stick is now rendered via HTML outside the canvas
            if (isDragging && dragStart) {
                const dragDist = Math.min(Math.sqrt(Math.pow(currentMouse.x - dragStart.x, 2) + Math.pow(currentMouse.y - dragStart.y, 2)), 100);
                // Draw a minimal power indicator ring around the cue ball on canvas
                ctx.beginPath();
                ctx.arc(state.cueBall.x, state.cueBall.y, BALL_RADIUS + dragDist * 0.2 + 5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, ${255 - (dragDist * 2)}, 0, 0.5)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    };

    useEffect(() => {
        const handleWindowGlobalMove = (e: PointerEvent) => {
            const coords = getTableCoords(e.clientX, e.clientY);

            // Update current mouse for drawing
            setCurrentMouse(coords);

            // If not dragging, update aiming angle
            if (!isDragging && state.gameState === 'aiming' && state.cueBall) {
                const dx = coords.x - state.cueBall.x;
                const dy = coords.y - state.cueBall.y;
                onAim(Math.atan2(dy, dx));
            }
        };

        window.addEventListener('pointermove', handleWindowGlobalMove);
        return () => {
            window.removeEventListener('pointermove', handleWindowGlobalMove);
        };
    }, [isDragging, state.gameState, state.cueBall]);

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

    useEffect(() => {
        if (isDragging) {
            const handleWindowPointerMove = (e: PointerEvent) => {
                const coords = getTableCoords(e.clientX, e.clientY);
                setCurrentMouse(coords);
            };

            const handleWindowPointerUp = (e: PointerEvent) => {
                if (!dragStart || !currentMouse || !state.cueBall) {
                    setIsDragging(false);
                    setDragStart(null);
                    return;
                }

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

            window.addEventListener('pointermove', handleWindowPointerMove);
            window.addEventListener('pointerup', handleWindowPointerUp);
            return () => {
                window.removeEventListener('pointermove', handleWindowPointerMove);
                window.removeEventListener('pointerup', handleWindowPointerUp);
            };
        }
    }, [isDragging, dragStart, currentMouse, state.cueBall]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (state.gameState !== 'aiming') return;
        const coords = getTableCoords(e.clientX, e.clientY);
        setDragStart(coords);
        setCurrentMouse(coords);
        setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        // Handled by global window listener
    };

    // Calculate HTML Cue Stick Position and Angle
    let htmlCueAngle = 0;
    let htmlCueX = 0;
    let htmlCueY = 0;
    let showHtmlCue = false;

    if (state.gameState === 'aiming' && state.cueBall && currentMouse) {
        showHtmlCue = true;
        const dx = currentMouse.x - state.cueBall.x;
        const dy = currentMouse.y - state.cueBall.y;
        htmlCueAngle = Math.atan2(dy, dx); // Angle in radians

        // Base distance from cue ball
        let distance = BALL_RADIUS + 5;

        if (isDragging && dragStart) {
            const dragDist = Math.min(Math.sqrt(Math.pow(currentMouse.x - dragStart.x, 2) + Math.pow(currentMouse.y - dragStart.y, 2)), 100);
            distance += dragDist;
        }

        htmlCueX = state.cueBall.x + Math.cos(htmlCueAngle) * distance;
        htmlCueY = state.cueBall.y + Math.sin(htmlCueAngle) * distance;
    }

    return (
        <div className="relative w-full max-w-[800px] aspect-[2/1] bg-slate-800 p-2 md:p-4 rounded-xl shadow-2xl border-2 md:border-4 border-slate-700 select-none touch-none mx-auto overflow-hidden">
            <canvas
                ref={canvasRef}
                width={TABLE_WIDTH}
                height={TABLE_HEIGHT}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                className="w-full h-full rounded bg-[#0a5c2e] cursor-crosshair touch-none"
            />

            {/* HTML Overlay Cue Stick */}
            {showHtmlCue && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        // Responsive positioning for the indicator
                        left: `calc((${htmlCueX} / ${TABLE_WIDTH}) * 100%)`,
                        top: `calc((${htmlCueY} / ${TABLE_HEIGHT}) * 100%)`,
                        transform: `rotate(${htmlCueAngle}rad)`,
                        transformOrigin: 'left center',
                        width: '50%', // Responsive length
                        height: '4px',
                        zIndex: 50,
                    }}
                >
                    {/* The stick itself */}
                    <div className="w-full h-full rounded-full overflow-hidden flex shadow-2xl">
                        {/* Tip */}
                        <div className="w-2 h-full bg-cyan-500"></div>
                        {/* Ferrule */}
                        <div className="w-4 h-full bg-slate-100"></div>
                        {/* Shaft */}
                        <div className="w-1/2 h-full bg-[#e8c396] shrink-0 border-y border-black/10"></div>
                        {/* Butt / Handle */}
                        <div className="flex-1 h-full bg-slate-900 border-y border-black/20 flex items-center justify-between px-2">
                            <div className="w-12 border-t border-white/20"></div>
                            <div className="w-12 border-t border-white/20"></div>
                        </div>
                    </div>
                </div>
            )}

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
