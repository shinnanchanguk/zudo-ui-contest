import { Plus } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation17({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-blue-600 rounded-full py-3 px-6 shadow-xl shadow-blue-300/50 
                 flex items-center justify-center gap-3 active:scale-[0.95] transition-transform"
        >
            <Plus className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-base">
                방과후 {phaseText} 수강신청 시작
            </span>
        </button>
    )
}
