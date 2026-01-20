import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Cell, CellState, GameBoardEntity } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateGameBoard = (rows: number, cols: number, mineCount: number): Cell[][] => {
    // 1. Initialize empty board with 0
    const gameBoardValues: GameBoardEntity[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => 0)
    );

    addRandomMines(gameBoardValues, rows, cols, mineCount);

    const gameBoard: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
        let row: Cell[] = []
        for (let j = 0; j < cols; j++) {
            row.push({
                value: (gameBoardValues[i][j] as GameBoardEntity),
                state: ('hidden' as CellState)
            })
        }
        gameBoard.push(row)
    }

    return gameBoard
};

const addRandomMines = (board: GameBoardEntity[][], rows: number, cols: number, mineCount: number) => {
    let minesAdded = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    while (minesAdded < mineCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // Only place if not already a mine (null)
        if (board[r][c] !== null) {
            board[r][c] = null;

            // Increment all neighbors
            for (const [dr, dc] of directions) {
                const newR = r + dr;
                const newC = c + dc;

                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                    const neighbor = board[newR][newC];
                    // Only increment if neighbor is not a mine
                    if (neighbor !== null) {
                        board[newR][newC] = (neighbor + 1) as GameBoardEntity; // ✅ Assign back to the board!
                    }
                }
            }
            minesAdded++;
        }
    }
};