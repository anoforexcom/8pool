
import { PoolGameState, PoolBall } from '../types';
import { TABLE_WIDTH, TABLE_HEIGHT, POCKETS } from './poolPhysics';

export const calculateOpponentShot = (state: PoolGameState): { power: number; angle: number } | null => {
    const { balls, cueBall, opponentType } = state;

    // Decide which balls to target
    let targetBalls = balls.filter(b => !b.isPotted && b.type !== 'cue');

    if (opponentType) {
        // Target only assigned suit
        const myBalls = targetBalls.filter(b => b.type === opponentType);
        if (myBalls.length > 0) {
            targetBalls = myBalls;
        } else {
            // Must hit 8-ball if all suit balls are gone
            const eightBall = balls.find(b => b.type === 'black' && !b.isPotted);
            if (eightBall) targetBalls = [eightBall];
        }
    } else {
        // Open table, exclude 8-ball
        const nonBlack = targetBalls.filter(b => b.type !== 'black');
        if (nonBlack.length > 0) targetBalls = nonBlack;
    }

    if (targetBalls.length === 0) return null;

    // Pick a target ball
    const target = targetBalls[Math.floor(Math.random() * targetBalls.length)];

    // Find nearest pocket to the target ball
    const nearestPocket = POCKETS.reduce((prev, curr) => {
        const dPrev = Math.hypot(target.x - prev.x, target.y - prev.y);
        const dCurr = Math.hypot(target.x - curr.x, target.y - curr.y);
        return dCurr < dPrev ? curr : prev;
    });

    // To hit target towards pocket, we need to hit a point on the opposite side of the target ball from the pocket
    const dirX = target.x - nearestPocket.x;
    const dirY = target.y - nearestPocket.y;
    const dirDist = Math.hypot(dirX, dirY);

    const impactX = target.x + (dirX / dirDist) * (cueBall.radius * 2);
    const impactY = target.y + (dirY / dirDist) * (cueBall.radius * 2);

    const dx = cueBall.x - impactX;
    const dy = cueBall.y - impactY;
    const angleToImpact = Math.atan2(dy, dx);

    // Human-like error simulation based on difficulty labels
    let baseError = 0.08; // Easy
    if (state.difficulty === 'Medium') baseError = 0.05;
    if (state.difficulty === 'Hard') baseError = 0.03;
    if (state.difficulty === 'Expert') baseError = 0.012; // Pro level

    const accuracyNoise = (Math.random() - 0.5) * baseError;
    const powerJitter = 0.85 + (Math.random() * 0.3); // More consistent power

    return {
        power: 14 * powerJitter,
        angle: angleToImpact + accuracyNoise
    };
};
