import { GraduationCap } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation25({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-transparent border-2 border-indigo-500 rounded-2xl p-4
                 flex items-center justify-center gap-3 hover:bg-indigo-50 active:scale-[0.98] transition-all"
        >
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span className="text-indigo-600 font-bold">
                {phaseText} 수강신청 바로가기
            </span>
        </button>
    )
}
