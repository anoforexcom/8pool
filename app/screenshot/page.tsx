"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { initializeRack } from "../../services/poolPhysics";

// Using dynamic import to avoid SSR issues with Canvas/window
const PoolTable = dynamic(() => import("../../components/PoolTable"), { ssr: false });

export default function Screenshot() {
    const [gameState, setGameState] = useState<any>(null);

    useEffect(() => {
        // Create a cool mid-game state to screenshot
        if (typeof window !== 'undefined') {
            const balls = initializeRack(1);

            // Scatter some balls to look like a mid-game
            balls[0].x = 300; balls[0].y = 150; // Solid yellow
            balls[1].x = 600; balls[1].y = 300; // Stripe yellow
            balls[4].x = 400; balls[4].y = 200; // 8 ball in middle
            balls[5].x = 200; balls[5].y = 350; // Red solid
            balls[10].x = 700; balls[10].y = 100; // Stripe orange

            setGameState({
                balls,
                cueBall: {
                    id: 0,
                    x: 150,
                    y: 200,
                    vx: 0,
                    vy: 0,
                    radius: 12,
                    type: 'cue',
                    number: 0,
                    isPotted: false,
                    color: '#ffffff',
                },
                gameState: 'aiming',
                currentTurn: 'player',
                playerType: 'stripe',
                opponentType: 'solid',
                opponentName: 'Alex "The Hurricane"',
                score: 150,
                shots: 3,
                maxShots: 10,
                pottedBalls: [],
                level: 5,
                timer: 45,
                timeLeft: 255,
                isPaused: false,
            });
        }
    }, []);

    if (!gameState) return <div className="p-10 text-white">Loading render...</div>;

    // Simulate mouse hover to trigger the HTML cue stick for the screenshot
    const mockAim = () => { };
    const mockStrike = () => { };

    // Fake coordinate for Mouse so Cue Stick renders explicitly pointing at 8-ball
    const mockCurrentMouse = { x: 400, y: 200 };

    return (
        <main className="w-screen h-screen flex items-center justify-center bg-slate-900 absolute inset-0 text-white p-20 z-[9999]"
            id="screenshot-target"
            onMouseMove={() => { }}>
            <div className="scale-150 transform origin-center">
                <PoolTable
                    state={gameState}
                    onAim={mockAim}
                    onStrike={mockStrike}
                />
            </div>
        </main>
    );
}
