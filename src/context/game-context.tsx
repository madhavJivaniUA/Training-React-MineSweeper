// context/game-context.tsx
import { createContext, useContext, useReducer } from "react"
import type { GameState } from '../types'
import type { GameAction } from "./reducer"
import { gameReducer } from "./reducer"

interface GameContextType {
    state: GameState | null
    dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | null>(null)

export const useGameContext = () => {
    const ctx = useContext(GameContext)
    if (ctx === null) {
        throw new Error("use of game-context outside its provider is not permitted")
    }
    return ctx
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(gameReducer, null as GameState | null)

    return (
        <GameContext.Provider value={{ state, dispatch: dispatch as React.Dispatch<GameAction> }}>
            {children}
        </GameContext.Provider>
    )
}