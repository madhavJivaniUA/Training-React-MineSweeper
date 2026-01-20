import { cn } from '../utils'
import type { Cell } from '../types'
import {FlagIcon, BombIcon} from "lucide-react"

export const Box = ({ row, col, onLeftClick, onRightClick, cell, isHighlighted }:
    { row: number, col: number, cell: Cell, onLeftClick: (e: React.MouseEvent) => void, onRightClick: (e: React.MouseEvent) => void, isHighlighted?: boolean }) => {

    // Color mapping for numbers (traditional Minesweeper colors)
    const getNumberColor = (value: number): string => {
        const colors: Record<number, string> = {
            1: 'text-blue-600',
            2: 'text-green-600',
            3: 'text-red-600',
            4: 'text-blue-900',
            5: 'text-red-900',
            6: 'text-cyan-600',
            7: 'text-black',
            8: 'text-gray-600'
        }
        return colors[value] || 'text-gray-700'
    }

    const isRevealed = cell.state === 'revealed'
    const isFlagged = cell.state === 'flagged'
    const isHidden = cell.state === 'hidden'
    const isMine = cell.value === null

    return (
        <button
            data-row={row}
            data-col={col}
            onClick={onLeftClick}
            onContextMenu={onRightClick}
            className={cn(
                'size-10 flex justify-center items-center font-bold text-sm transition-all',
                'border border-neutral-400 rounded-sm overflow-hidden select-none shrink-0',
                // Hidden state - raised 3D effect
                isHidden && 'bg-neutral-200 hover:bg-neutral-300 rounded-sm',
                // Revealed state - flat/sunken
                isRevealed && 'bg-neutral-100 border-neutral-300 rounded-sm shadow-inner',
                // Flagged state - highlighted
                isFlagged && 'bg-amber-400 border border-amber-700',
                // Cursor
                !isRevealed && 'cursor-pointer',
                isMine && isRevealed && 'bg-red-400 border-2 border-red-700',
                isHighlighted && 'border-fuchsia-500 border-2'
            )}
        >
            {isRevealed && (
                cell.value === null ? (
                    <span className="text-xl"><BombIcon className="size-4 fill-black" /></span>
                ) : cell.value === 0 ? (
                    <span className="text-neutral-400"></span>
                ) : (
                            <span className={cn('font-bold text-base flex justify-center items-center', getNumberColor(cell.value))}>
                        {cell.value}
                    </span>
                )
            )}
            {isFlagged && <span className="text-xl"><FlagIcon className="size-4 fill-red-600" /></span>}
        </button>
    )
}