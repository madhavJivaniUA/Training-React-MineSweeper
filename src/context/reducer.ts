// context/reducer.ts
import type { GameState, GameStatus, GameHistoryEntry } from '../types'
import { generateGameBoard } from '../utils'

export type GameAction =
    | { type: 'INIT_GAME'; payload: { rows: number; cols: number; mineCount: number } }
    | { type: 'REVEAL_CELL'; payload: { row: number; col: number } }
    | { type: 'TOGGLE_FLAG'; payload: { row: number; col: number } }
    | { type: 'RESET_GAME' }
    | { type: 'REVEAL_GAME' }

// Helper function to create history entries
const createHistoryEntry = (
    actionType: 'REVEAL' | 'FLAG' | 'UNFLAG',
    row: number,
    col: number,
    state: Omit<GameState, 'gameHistory' | 'gameInfo'>
): GameHistoryEntry => ({
    action: {
        type: actionType,
        row,
        col
    },
    snapshot: {
        board: state.board.map(r => r.map(c => ({ ...c }))), // Deep copy
        status: state.status,
        flagsRemaining: state.flagsRemaining,
        revealedCount: state.revealedCount
    }
})

// Helper to limit history size
const addToHistory = (
    history: GameHistoryEntry[],
    newEntry: GameHistoryEntry,
    maxSize: number = 100
): GameHistoryEntry[] => {
    const newHistory = [...history, newEntry]
    return newHistory.length > maxSize
        ? newHistory.slice(-maxSize)
        : newHistory
}

export const gameReducer = (state: GameState | null, action: GameAction): GameState | null => {
    switch (action.type) {
        case 'INIT_GAME': {
            const { rows, cols, mineCount } = action.payload
            const gameBoard = generateGameBoard(rows, cols, mineCount)
            console.log(gameBoard.map(r => r.map(c => c.value)))
            return {
                gameInfo: {
                    dimn: { rows, cols },
                    mineCount
                },
                board: gameBoard,
                status: 'playing',
                flagsRemaining: mineCount,
                revealedCount: 0,
                gameHistory: [{
                    action: { type: 'INIT_GAME', row: -1, col: -1 },
                    snapshot: {
                        board: gameBoard.map(r => r.map(c => ({ ...c }))),
                        status: 'playing' as GameStatus,
                        flagsRemaining: mineCount,
                        revealedCount: 0
                    }
                }]
            }
        }

        case 'REVEAL_CELL': {
            if (!state || state.status !== 'playing') return state

            const { row, col } = action.payload
            const cell = state.board[row][col]

            // Can't reveal flagged or already revealed cells
            if (cell.state !== 'hidden') return state

            const newBoard = state.board.map(r => r.map(c => ({ ...c })))
            let revealedCount = state.revealedCount

            // Reveal the cell - Flood Fill
            const revealCell = (r: number, c: number) => {
                if (
                    r < 0 || r >= state.gameInfo.dimn.rows ||
                    c < 0 || c >= state.gameInfo.dimn.cols ||
                    newBoard[r][c].state !== 'hidden'
                ) {
                    return
                }

                newBoard[r][c].state = 'revealed'
                revealedCount++

                // If it's a 0, flood fill (reveal adjacent cells)
                if (newBoard[r][c].value === 0) {
                    const directions = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1]
                    ]
                    for (const [dr, dc] of directions) {
                        revealCell(r + dr, c + dc)
                    }
                }
            }
            revealCell(row, col)

            // Check if clicked on mine
            if (cell.value === null) {
                const newState = {
                    board: newBoard,
                    status: 'lost' as const,
                    flagsRemaining: state.flagsRemaining,
                    revealedCount
                }

                return {
                    ...state,
                    ...newState,
                    gameHistory: addToHistory(
                        state.gameHistory,
                        createHistoryEntry('REVEAL', row, col, newState)
                    )
                }
            }

            // Check win condition
            const totalCells = state.gameInfo.dimn.rows * state.gameInfo.dimn.cols
            const isWon = revealedCount === totalCells - state.gameInfo.mineCount

            const newState = {
                board: newBoard,
                status: (isWon ? 'won' : 'playing') as GameStatus,
                flagsRemaining: state.flagsRemaining,
                revealedCount
            }

            return {
                ...state,
                ...newState,
                gameHistory: addToHistory(
                    state.gameHistory,
                    createHistoryEntry('REVEAL', row, col, newState)
                )
            }
        }

        case 'TOGGLE_FLAG': {
            if (!state || state.status !== 'playing') return state

            const { row, col } = action.payload
            const cell = state.board[row][col]

            // Can't flag revealed cells
            if (cell.state === 'revealed') return state

            const newBoard = state.board.map(r => r.map(c => ({ ...c })))
            const newCell = newBoard[row][col]

            if (newCell.state === 'hidden') {
                // Place flag
                if (state.flagsRemaining > 0) {
                    newCell.state = 'flagged'
                    const newState = {
                        board: newBoard,
                        status: state.status,
                        flagsRemaining: state.flagsRemaining - 1,
                        revealedCount: state.revealedCount
                    }

                    return {
                        ...state,
                        ...newState,
                        gameHistory: addToHistory(
                            state.gameHistory,
                            createHistoryEntry('FLAG', row, col, newState)
                        )
                    }
                }
            } else if (newCell.state === 'flagged') {
                // Remove flag
                newCell.state = 'hidden'
                const newState = {
                    board: newBoard,
                    status: state.status,
                    flagsRemaining: state.flagsRemaining + 1,
                    revealedCount: state.revealedCount
                }

                return {
                    ...state,
                    ...newState,
                    gameHistory: addToHistory(
                        state.gameHistory,
                        createHistoryEntry('UNFLAG', row, col, newState)
                    )
                }
            }

            return state
        }

        case 'RESET_GAME': {
            return null
        }

        case 'REVEAL_GAME': {
            if (!state || state.status !== 'lost') return state

            const newBoard = state.board.map(r => r.map(c => ({ ...c })))
            for (const row of newBoard) {
                for (const cell of row) {
                    cell.state = 'revealed'
                }
            }

            // Note: We don't add this to history since it's not a player action
            return {
                ...state,
                board: newBoard
            }
        }

        default:
            return state
    }
}