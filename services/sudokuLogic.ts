
/**
 * Simple seeded random number generator to ensure 
 * Level 1 always generates the same puzzle for everyone.
 */
class SeededRandom {
  seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

export const generatePuzzle = (level: number, clues: number) => {
  const rng = new SeededRandom(level * 12345);
  const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Basic backtracking generator
  solveSudoku(board);
  const solution = board.map(row => [...row]);
  
  const puzzle = board.map(row => [...row]);
  let removed = 0;
  const targetToRemove = 81 - clues;
  
  while (removed < targetToRemove) {
    const r = Math.floor(rng.next() * 9);
    const c = Math.floor(rng.next() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }

  return {
    initial: puzzle.map(row => row.map(val => val === 0 ? null : val)),
    solution
  };
};

export const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

export const checkIsValidMove = (board: (number | null)[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) return false;
  }
  // Check col
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) return false;
  }
  // Check 3x3
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if ((i + startRow !== row || j + startCol !== col) && board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};
