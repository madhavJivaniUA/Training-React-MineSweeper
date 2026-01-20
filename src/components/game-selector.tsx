import type { IGame } from "../types"
import { GAME_1, GAME_2, GAME_3 } from "../constants"
import { GameButton } from "./game-button"

interface GameSelectorProps {
    onSelectGame: (game: IGame) => void
}

export const GameSelector = ({ onSelectGame }: GameSelectorProps) => {
    const games = [GAME_1, GAME_2, GAME_3]

    return (
        <div className="w-full max-w-2xl p-4 bg-white border border-neutral-300 rounded-lg shadow-sm">
            <div className="w-full text-center text-xl font-semibold text-neutral-800 mb-4">
                Choose Your Game
            </div>

            <div className="grid grid-cols-3 gap-4">
                {games.map((game, idx) => (
                    <GameButton
                        key={idx}
                        game={game}
                        onClick={() => onSelectGame(game)}
                    />
                ))}
            </div>
        </div>
    )
}