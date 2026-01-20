import type { IGame } from "../types"

interface GameButtonProps {
    game: IGame
    onClick: (game: IGame) => void
}

export const GameButton = ({ game, onClick }: GameButtonProps) => {
    return (
        <button
            onClick={() => onClick(game)}
            className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 px-3 py-4 flex flex-col justify-center text-center rounded-md transition-colors cursor-pointer">
            <span className="font-medium mb-1">
                {game.dimn.rows} X {game.dimn.cols}
            </span>
            <span className="text-sm text-neutral-600">
                {game.mineCount} mines
            </span>
        </button>
    )
}