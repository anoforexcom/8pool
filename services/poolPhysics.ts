
import { PoolBall, PoolGameState } from '../types';

export const TABLE_WIDTH = 800;
export const TABLE_HEIGHT = 400;
export const BALL_RADIUS = 12;
export const FRICTION = 0.985;
export const WALL_BOUNCE = 0.7;
export const BALL_BOUNCE = 0.9;
export const MIN_VELOCITY = 0.1;

export const POCKETS = [
    { x: 0, y: 0 },
    { x: TABLE_WIDTH / 2, y: 0 },
    { x: TABLE_WIDTH, y: 0 },
    { x: 0, y: TABLE_HEIGHT },
    { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT },
    { x: TABLE_WIDTH, y: TABLE_HEIGHT },
];

export const updatePhysics = (state: PoolGameState): PoolGameState => {
    let { balls, cueBall } = state;
    let allBalls = [cueBall, ...balls];
    let moving = false;

    // Update positions and handle wall collisions
    allBalls.forEach(ball => {
        if (ball.isPotted) return;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Apply friction
        ball.vx *= FRICTION;
        ball.vy *= FRICTION;

        if (Math.abs(ball.vx) < MIN_VELOCITY) ball.vx = 0;
        if (Math.abs(ball.vy) < MIN_VELOCITY) ball.vy = 0;

        if (ball.vx !== 0 || ball.vy !== 0) moving = true;

        // Wall collisions
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= -WALL_BOUNCE;
        } else if (ball.x + ball.radius > TABLE_WIDTH) {
            ball.x = TABLE_WIDTH - ball.radius;
            ball.vx *= -WALL_BOUNCE;
        }

        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= -WALL_BOUNCE;
        } else if (ball.y + ball.radius > TABLE_HEIGHT) {
            ball.y = TABLE_HEIGHT - ball.radius;
            ball.vy *= -WALL_BOUNCE;
        }

        // Pocket detection
        POCKETS.forEach(pocket => {
            const dist = Math.sqrt(Math.pow(ball.x - pocket.x, 2) + Math.pow(ball.y - pocket.y, 2));
            if (dist < ball.radius * 2) {
                ball.isPotted = true;
                ball.vx = 0;
                ball.vy = 0;
            }
        });
    });

    // Ball-to-ball collisions
    for (let i = 0; i < allBalls.length; i++) {
        for (let j = i + 1; j < allBalls.length; j++) {
            const b1 = allBalls[i];
            const b2 = allBalls[j];

            if (b1.isPotted || b2.isPotted) continue;

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < b1.radius + b2.radius) {
                // Resolve overlap
                const overlap = (b1.radius + b2.radius - distance) / 2;
                const nx = dx / distance;
                const ny = dy / distance;

                b1.x -= nx * overlap;
                b1.y -= ny * overlap;
                b2.x += nx * overlap;
                b2.y += ny * overlap;

                // Normal and tangential velocities
                const v1n = b1.vx * nx + b1.vy * ny;
                const v2n = b2.vx * nx + b2.vy * ny;

                // Exchange normal velocities (simplified elastic collision)
                const commonVelocity = (v1n + v2n) / 2;
                const v1nAfter = v2n * BALL_BOUNCE;
                const v2nAfter = v1n * BALL_BOUNCE;

                b1.vx += (v1nAfter - v1n) * nx;
                b1.vy += (v1nAfter - v1n) * ny;
                b2.vx += (v2nAfter - v2n) * nx;
                b2.vy += (v2nAfter - v2n) * ny;

                moving = true;
            }
        }
    }

    const pottedThisFrame = allBalls.filter(b => b.isPotted && !state.pottedBalls.find(pb => pb.id === b.id));

    return {
        ...state,
        balls: allBalls.filter(b => b.type !== 'cue'),
        cueBall: allBalls.find(b => b.type === 'cue')!,
        gameState: moving ? 'moving' : (state.gameState === 'moving' ? 'aiming' : state.gameState),
        pottedBalls: [...state.pottedBalls, ...pottedThisFrame],
        score: state.score + pottedThisFrame.length * 10,
    };
};

export const initializeRack = (level: number): PoolBall[] => {
    const balls: PoolBall[] = [];
    const startX = TABLE_WIDTH * 0.7;
    const startY = TABLE_HEIGHT / 2;
    const r = BALL_RADIUS;

    // Standard 15-ball rack layout
    const ballData = [
        { n: 1, t: 'solid', c: '#ffcc00' }, // Yellow
        { n: 9, t: 'stripe', c: '#ffcc00' },
        { n: 2, t: 'solid', c: '#0033cc' }, // Blue
        { n: 10, t: 'stripe', c: '#0033cc' },
        { n: 8, t: 'black', c: '#000000' }, // 8-Ball
        { n: 3, t: 'solid', c: '#cc0000' }, // Red
        { n: 11, t: 'stripe', c: '#cc0000' },
        { n: 4, t: 'solid', c: '#660099' }, // Purple
        { n: 12, t: 'stripe', c: '#660099' },
        { n: 5, t: 'solid', c: '#ff6600' }, // Orange
        { n: 13, t: 'stripe', c: '#ff6600' },
        { n: 6, t: 'solid', c: '#006600' }, // Green
        { n: 14, t: 'stripe', c: '#006600' },
        { n: 7, t: 'solid', c: '#663300' }, // Maroon
        { n: 15, t: 'stripe', c: '#663300' },
    ];

    let ballIdx = 0;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
            const data = ballData[ballIdx++];
            balls.push({
                id: data.n,
                x: startX + row * r * 1.75,
                y: startY - (row * r) + (col * r * 2.05),
                vx: 0,
                vy: 0,
                radius: r,
                type: data.t as any,
                number: data.n,
                isPotted: false,
                color: data.c,
            });
        }
    }

    return balls;
};
