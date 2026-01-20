import { Link } from "react-router-dom"
import { Fragment, useEffect } from "react"
import type { IGame } from "../types"
import { Box } from "./game-box"
import { useGameContext } from "../context/game-context"
import { FlagIcon, RefreshCcw, Eye, HistoryIcon, ChevronLeft, Skull, Trophy } from "lucide-react"

interface GameProps {
    game: IGame
    onBack: () => void
}

export const Game = ({ game, onBack }: GameProps) => {
    const { state, dispatch } = useGameContext();

    useEffect(() => {
        dispatch({
            type: 'INIT_GAME',
            payload: {
                rows: game.dimn.rows,
                cols: game.dimn.cols,
                mineCount: game.mineCount
            }
        })
    }, [game.dimn.rows, game.dimn.cols, game.mineCount, dispatch])

    if (!state) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-500">Loading...</div>
            </div>
        )
    }

    const handleReset = () => {
        dispatch({
            type: 'INIT_GAME',
            payload: {
                rows: game.dimn.rows,
                cols: game.dimn.cols,
                mineCount: game.mineCount
            }
        })
    }

    const handleReveal = () => {
        dispatch({
            type: 'REVEAL_GAME',
        })
    }

    const handleBoxLeftClick = (row: number, col: number) => {
        dispatch({ type: 'REVEAL_CELL', payload: { row, col } })
    }

    const handleBoxRightClick = (row: number, col: number) => {
        dispatch({ type: 'TOGGLE_FLAG', payload: { row, col } })
    }

    const handleBack = () => {
        dispatch({ type: 'RESET_GAME' })
        onBack()
    }

    return (
        <div className="w-full h-full relative flex flex-col justify-center items-center gap-6 overflow-auto p-4">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-4 left-4 px-4 py-2 cursor-pointer bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors shadow-sm flex flex-row items-center justify-center">
                <ChevronLeft /> Back
            </button>
            {
                (state.status !== 'playing') && (<Link to="/history">
                    <button
                        className="absolute top-4 right-4 px-4 py-2 cursor-pointer bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors shadow-sm flex flex-row gap-2 items-center">
                        <HistoryIcon /> History
                    </button>
                </Link>)
            }

            {/* Header */}
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-neutral-600">
                            {state.gameInfo.dimn.rows} x {state.gameInfo.dimn.cols}
                        </span>
                    </div>

                    <div className="px-4 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm flex items-center gap-2">
                        <span className="text-lg"><FlagIcon className="size-4 fill-red-600" /></span>
                        <span className="text-sm font-semibold text-neutral-700">
                            {state.flagsRemaining}
                        </span>
                    </div>
                </div>

                {/* Status Messages */}
                {state.status === 'won' && (
                    <div className="px-6 py-3 bg-green-50 border-2 border-green-400 rounded-lg">
                        <span className="text-green-700 font-bold text-lg flex justify-center items-center gap-1"><Trophy size={18} className="fill-yellow-400" /> You Won!</span>
                    </div>
                )}
                {state.status === 'lost' && (
                    <div className="px-6 py-3 bg-red-50 border-2 border-red-400 rounded-lg">
                        <span className="text-red-700 font-bold text-lg flex justify-center items-center gap-1"><Skull size={18} className="fill-zinc-300" /> Game Over!</span>
                    </div>
                )}
                {state.status === 'playing' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="size-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-700 font-medium">Playing</span>
                    </div>
                )}
            </div>

            {/* Game Board */}
            <div className="flex flex-col gap-4 overflow-scroll m-4">
                <div
                    className="grid gap-0 bg-neutral-400 shadow-sm rounded-md p-1"
                    style={{
                        gridTemplateColumns: `repeat(${state.gameInfo.dimn.cols}, min-content)`
                    }}
                >
                    {state.board.map((row, rowIndex) => (
                        <Fragment key={`row-${rowIndex}`}>
                            {row.map((cell, colIndex) => (
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    onLeftClick={() => handleBoxLeftClick(rowIndex, colIndex)}
                                    onRightClick={(e: React.MouseEvent) => {
                                        e.preventDefault()
                                        handleBoxRightClick(rowIndex, colIndex)
                                    }}
                                    cell={cell}
                                />
                            ))}
                        </Fragment>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-4">
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-3 rounded-lg hover:bg-neutral-50 text-neutral-700 border border-neutral-300 transition-colors shadow-sm font-medium flex-1 cursor-pointer">
                        <span className="w-full flex items-center justify-center gap-2">
                            <RefreshCcw className="size-4" /> New Game
                        </span>
                    </button>
                    {state.status === 'lost' && <button
                        onClick={handleReveal}
                        className="px-4 py-3 rounded-lg hover:bg-neutral-50 text-neutral-700 border border-neutral-300 transition-colors shadow-sm font-medium cursor-pointer">
                        <span className="w-full flex items-center justify-center gap-2">
                            <Eye className="size-4" /> Reveal
                        </span>
                    </button>}
                </div>

            </div>
        </div>
    )
}