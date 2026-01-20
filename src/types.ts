export type GameBoardEntity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null
export type CellState = 'hidden' | 'revealed' | 'flagged'

export interface Cell {
    value: GameBoardEntity  // 0-8 or null (mine)
    state: CellState        // hidden/revealed/flagged
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface IGame {
    dimn: {
        rows: number,
        cols: number
    },
    mineCount: number
}
export type GameHistoryEntry = {
    action: {
        type: 'REVEAL' | 'FLAG' | 'UNFLAG' | 'INIT_GAME'
        row: number
        col: number
    }
    snapshot: {
        board: Cell[][]
        status: GameStatus
        flagsRemaining: number
        revealedCount: number
    }
}

export interface GameState {
    gameInfo: IGame
    board: Cell[][]
    status: GameStatus
    flagsRemaining: number
    revealedCount: number
    gameHistory: GameHistoryEntry[]
}