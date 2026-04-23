import { GraduationCap } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation10({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white border-l-4 border-indigo-600 rounded-r-lg shadow-md p-4
                 active:scale-[0.98] transition-all flex items-center justify-between"
        >
            <div className="text-left">
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
                    Enrichment Program
                </span>
                <h3 className="text-gray-900 font-bold text-lg mt-0.5">
                    {phaseText} 수강신청
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                    {endDate}까지 신청 가능합니다.
                </p>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-full">
                <GraduationCap className="w-6 h-6 text-gray-400" />
            </div>
        </button>
    )
}
