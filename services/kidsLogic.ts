import { KidsColor, KidsGridSize, KidsState } from '../types';

// Color sets for different grid sizes
const COLORS_4x4: KidsColor[] = ['red', 'blue', 'yellow', 'green'];
const COLORS_6x6: KidsColor[] = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];

// Generate a solved 4x4 Sudoku grid
function generateSolved4x4(): KidsColor[][] {
    // Pre-defined valid 4x4 solutions (rotated for variety)
    const templates: KidsColor[][][] = [
        [
            ['red', 'blue', 'yellow', 'green'],
            ['yellow', 'green', 'red', 'blue'],
            ['blue', 'red', 'green', 'yellow'],
            ['green', 'yellow', 'blue', 'red']
        ],
        [
            ['blue', 'green', 'red', 'yellow'],
            ['red', 'yellow', 'blue', 'green'],
            ['green', 'blue', 'yellow', 'red'],
            ['yellow', 'red', 'green', 'blue']
        ],
        [
            ['green', 'yellow', 'blue', 'red'],
            ['blue', 'red', 'green', 'yellow'],
            ['yellow', 'green', 'red', 'blue'],
            ['red', 'blue', 'yellow', 'green']
        ]
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// Generate a solved 6x6 Sudoku grid
function generateSolved6x6(): KidsColor[][] {
    const templates: KidsColor[][][] = [
        [
            ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
            ['yellow', 'green', 'purple', 'orange', 'red', 'blue'],
            ['purple', 'orange', 'red', 'blue', 'yellow', 'green'],
            ['blue', 'red', 'green', 'yellow', 'orange', 'purple'],
            ['green', 'yellow', 'orange', 'purple', 'blue', 'red'],
            ['orange', 'purple', 'blue', 'red', 'green', 'yellow']
        ],
        [
            ['blue', 'green', 'red', 'yellow', 'orange', 'purple'],
            ['red', 'yellow', 'orange', 'purple', 'blue', 'green'],
            ['orange', 'purple', 'blue', 'green', 'red', 'yellow'],
            ['green', 'blue', 'yellow', 'red', 'purple', 'orange'],
            ['yellow', 'red', 'purple', 'orange', 'green', 'blue'],
            ['purple', 'orange', 'green', 'blue', 'yellow', 'red']
        ]
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// Remove cells to create puzzle (easier for kids)
function createPuzzle(solution: KidsColor[][], difficulty: 'easy' | 'medium'): (KidsColor | null)[][] {
    const size = solution.length;
    const puzzle = solution.map(row => [...row]);

    // Number of cells to remove
    const cellsToRemove = size === 4
        ? (difficulty === 'easy' ? 6 : 8)  // 4x4: remove 6-8 cells
        : (difficulty === 'easy' ? 12 : 16); // 6x6: remove 12-16 cells

    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if (puzzle[row][col] !== null) {
            puzzle[row][col] = null;
            removed++;
        }
    }

    return puzzle;
}

// Validate a move
export function isValidKidsMove(
    board: (KidsColor | null)[][],
    row: number,
    col: number,
    color: KidsColor
): boolean {
    const size = board.length;

    // Check row
    for (let c = 0; c < size; c++) {
        if (c !== col && board[row][c] === color) return false;
    }

    // Check column
    for (let r = 0; r < size; r++) {
        if (r !== row && board[r][col] === color) return false;
    }

    // Check box
    const boxSize = size === 4 ? 2 : (size === 6 ? 2 : 3);
    const boxRows = size === 6 ? 3 : 2;
    const boxCols = size === 6 ? 2 : 2;

    const boxRow = Math.floor(row / boxRows);
    const boxCol = Math.floor(col / boxCols);

    for (let r = boxRow * boxRows; r < (boxRow + 1) * boxRows; r++) {
        for (let c = boxCol * boxCols; c < (boxCol + 1) * boxCols; c++) {
            if (r !== row && c !== col && board[r][c] === color) return false;
        }
    }

    return true;
}

// Check if puzzle is complete
export function isKidsPuzzleComplete(board: (KidsColor | null)[][], solution: KidsColor[][]): boolean {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === null || board[r][c] !== solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}

// Generate a new kids puzzle
export function generateKidsPuzzle(gridSize: KidsGridSize, level: number): KidsState {
    const difficulty = level <= 5 ? 'easy' : 'medium';

    const solution = gridSize === '4x4' ? generateSolved4x4() : generateSolved6x6();
    const puzzle = createPuzzle(solution, difficulty);

    return {
        board: puzzle,
        initialBoard: puzzle.map(row => [...row]),
        solution,
        selectedCell: null,
        isComplete: false,
        gridSize,
        level
    };
}

// Get available colors for grid size
export function getColorsForGrid(gridSize: KidsGridSize): KidsColor[] {
    return gridSize === '4x4' ? COLORS_4x4 : COLORS_6x6;
}

// Get color hex value
export function getColorHex(color: KidsColor): string {
    const colorMap: Record<KidsColor, string> = {
        red: '#FF6B6B',
        blue: '#4ECDC4',
        yellow: '#FFE66D',
        green: '#95E1D3',
        purple: '#C7CEEA',
        orange: '#FFA07A'
    };
    return colorMap[color];
}

// Get color emoji
export function getColorEmoji(color: KidsColor): string {
    const emojiMap: Record<KidsColor, string> = {
        red: '🔴',
        blue: '🔵',
        yellow: '🟡',
        green: '🟢',
        purple: '🟣',
        orange: '🟠'
    };
    return emojiMap[color];
}
