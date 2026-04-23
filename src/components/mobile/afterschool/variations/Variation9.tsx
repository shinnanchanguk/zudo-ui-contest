import { Calendar, ChevronRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation9({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#FFF5F5] border border-orange-100 rounded-2xl p-4
                 shadow-sm active:scale-[0.98] transition-all
                 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="text-gray-800 font-bold text-base">
                        방과후 {phaseText} 신청
                    </h3>
                    <p className="text-orange-400 text-xs font-medium">
                        신청 마감일: {endDate}
                    </p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
    )
}
