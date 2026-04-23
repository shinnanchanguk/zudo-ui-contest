import { GraduationCap } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation13({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-indigo-50 rounded-xl px-5 py-3
                 flex items-center gap-4 active:bg-indigo-100 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-indigo-900 font-semibold text-sm">
                    방과후 {phaseText} 신청 바로가기
                </span>
                <span className="text-indigo-600/70 text-xs">
                    {endDate} 마감
                </span>
            </div>
        </button>
    )
}
