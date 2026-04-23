import { ChevronRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation20({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-indigo-600 rounded-lg px-4 py-2 flex items-center justify-between shadow-md"
        >
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-medium text-sm">
                    방과후 {phaseText} 신청중
                </span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/80" />
        </button>
    )
}
