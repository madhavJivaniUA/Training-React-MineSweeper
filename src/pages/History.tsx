import { Fragment, useEffect, useState } from 'react'
import { useGameContext } from '../context/game-context'
import { useNavigate } from 'react-router-dom'
import type { GameHistoryEntry } from '../types'
import { Box } from '../components/game-box'
import { Flag, ChevronLeft, Eye, PlayCircle, Gamepad2, Skull, Trophy, FlagOff, ChevronRight } from 'lucide-react'

export const History = () => {
    const navigate = useNavigate()
    const { state } = useGameContext()
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!state) {
            navigate("/")
        }
    }, [])

    // Early return if state is null
    if (state === null) {
        return null
    }

    const gameHistory: GameHistoryEntry[] = state.gameHistory ?? []

    const currentSnapshot = gameHistory[currentIndex]
    const { cols } = state.gameInfo.dimn

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    }

    const handleNext = () => {
        if (currentIndex < gameHistory.length - 1) setCurrentIndex(currentIndex + 1)
    }

    const emptyClickHandler = () => { }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4 overflow-auto relative isolate">
            {/* Header */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 px-4 py-2 cursor-pointer bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition-colors shadow-sm flex flex-row gap-2 items-center">
                <ChevronLeft size={20} />
                <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-neutral-800 w-full text-center">Game History</h1>

            {/* Move Info Card */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center gap-4">
                    {/* Move Counter */}
                    <div className="text-center w-28">
                        <div className="text-xs text-neutral-500 mb-1">Move</div>
                        <div className="text-2xl font-bold text-neutral-800">
                            {currentIndex} <span className="text-neutral-400">/</span> {gameHistory.length - 1}
                        </div>
                    </div>

                    <div className="h-14 w-px bg-neutral-200"></div>

                    {/* Action Type */}
                    <div className="text-center w-32">
                        <div className="text-xs text-neutral-500 mb-1">Action</div>
                        <div className="flex items-center gap-2 justify-center text-base font-semibold">
                            {currentSnapshot.action.type === 'INIT_GAME' && (
                                <>
                                    <PlayCircle size={18} className="fill-neutral-500" />
                                    <span>Start</span>
                                </>
                            )}
                            {currentSnapshot.action.type === 'REVEAL' && (
                                <>
                                    <Eye size={18} className="fill-sky-500 stroke-3 stroke-neutral-950" />
                                    <span>Reveal</span>
                                </>
                            )}
                            {currentSnapshot.action.type === 'FLAG' && (
                                <>
                                    <Flag size={18} className="fill-red-600" />
                                    <span className="text-amber-600">Flag</span>
                                </>
                            )}
                            {currentSnapshot.action.type === 'UNFLAG' && (
                                <>
                                    <FlagOff size={18} className="fill-amber-600" />
                                    <span className="text-red-600">Unflag</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="h-14 w-px bg-neutral-200"></div>

                    {/* Position */}
                    <div className="text-center w-32">
                        <div className="text-xs text-neutral-500 mb-1">Position</div>
                        <div className="text-base font-semibold text-neutral-800 font-mono">
                            {currentSnapshot.action.row === -1 && currentSnapshot.action.col === -1
                                ? <span className="text-neutral-400">N/A</span>
                                : `(${currentSnapshot.action.row + 1}, ${currentSnapshot.action.col + 1})`}
                        </div>
                    </div>

                    <div className="h-14 w-px bg-neutral-200"></div>

                    {/* Game Status */}
                    <div className="text-center w-32">
                        <div className="text-xs text-neutral-500 mb-1">Status</div>
                        <div className="flex items-center gap-1.5 justify-center text-base font-semibold">
                            {currentSnapshot.snapshot.status === 'playing' && (
                                <>
                                    <Gamepad2 size={18} className="text-blue-500 stroke-neutral-900" />
                                    <span className="text-blue-600">Playing</span>
                                </>
                            )}
                            {currentSnapshot.snapshot.status === 'won' && (
                                <>
                                    <Trophy size={18} className="fill-yellow-400" />
                                    <span className="text-green-600">Won</span>
                                </>
                            )}
                            {currentSnapshot.snapshot.status === 'lost' && (
                                <>
                                    <Skull size={18} className="fill-zinc-300" />
                                    <span className="text-red-600">Lost</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="h-14 w-px bg-neutral-200"></div>

                    {/* Flags Remaining */}
                    <div className="text-center w-28">
                        <div className="text-xs text-neutral-500 mb-1">Flags Left</div>
                        <div className="flex items-center gap-1.5 justify-center text-base font-semibold text-neutral-800">
                            <Flag size={18} className="fill-red-500 text-red-600" />
                            <span>{currentSnapshot.snapshot.flagsRemaining}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <div
                className="grid gap-0 border-2 border-neutral-500 shadow-xl rounded-sm overflow-hidden pointer-events-none"
                style={{
                    gridTemplateColumns: `repeat(${cols}, min-content)`
                }}
            >
                {currentSnapshot.snapshot.board.map((row, rowIndex) => (
                    <Fragment key={`row-${rowIndex}`}>
                        {row.map((cell, colIndex) => {
                            // Highlight the cell that was just clicked
                            const isActionCell =
                                rowIndex === currentSnapshot.action.row &&
                                colIndex === currentSnapshot.action.col

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`relative ${isActionCell ? 'ring-4 ring-yellow-400 ring-inset z-10' : ''}`}
                                >
                                    <Box
                                        row={rowIndex}
                                        col={colIndex}
                                        onLeftClick={emptyClickHandler}
                                        onRightClick={emptyClickHandler}
                                        cell={cell}
                                        isHighlighted={currentSnapshot.action.row === rowIndex && currentSnapshot.action.col === colIndex}
                                    />
                                </div>
                            )
                        })}
                    </Fragment>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col gap-4 w-full max-w-2xl justify-center items-center">
                {/* Navigation Buttons */}
                <div className="flex justify-center items-center gap-4 max-w-lg w-full">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer flex flex-row items-center justify-center gap-1 flex-2">
                        <ChevronLeft/> Previous
                    </button>

                    <div className="px-6 py-3 bg-neutral-100 border border-neutral-300 rounded-lg font-mono font-semibold flex-1 flex justify-center items-center">
                        {currentIndex} / {gameHistory.length - 1}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === gameHistory.length - 1}
                        className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer flex flex-row items-center justify-center gap-1 flex-2">
                        Next <ChevronRight/>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300"
                        style={{
                            width: `${((currentIndex) / (gameHistory.length - 1)) * 100}%`
                        }}
                    ></div>
                </div>

                {/* Jump to Move Buttons */}
                <div className="flex items-center gap-2 justify-center flex-wrap">
                    {gameHistory.map((entry, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`size-10 rounded-lg border-2 transition-all font-medium cursor-pointer ${index === currentIndex
                                ? 'bg-blue-500 text-white border-blue-600 scale-110'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                                }`}
                            title={`Move ${index}: ${entry.action.type} at (${entry.action.row}, ${entry.action.col})`}
                        >
                            {index}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}