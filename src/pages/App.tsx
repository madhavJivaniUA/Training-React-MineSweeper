import { useState } from "react"
import type { IGame } from "../types"
import { GameSelector } from "../components/game-selector"
import { Game } from "../components/game"

export const App = () => {
    const [game, setGame] = useState<IGame | null>(null)

    if (!game) {
        return <GameSelector onSelectGame={setGame} />
    }

    return <Game game={game} onBack={() => setGame(null)} />
}