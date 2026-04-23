import { GraduationCap, ArrowRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation11({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4
                 active:bg-gray-50 transition-colors flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-900" />
                <span className="text-gray-900 font-medium">
                    방과후 {phaseText} 수강신청
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{endDate}까지</span>
                <ArrowRight className="w-4 h-4 text-gray-300" />
            </div>
        </button>
    )
}
