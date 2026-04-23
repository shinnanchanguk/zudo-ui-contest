import { ArrowRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation14({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4
                 border border-gray-100 flex items-center justify-between"
        >
            <div>
                <h4 className="text-gray-900 font-bold text-sm text-left">
                    [안내] 방과후 {phaseText} 신청
                </h4>
            </div>
            <div className="flex items-center gap-1 text-indigo-600">
                <span className="text-xs font-semibold">신청하기</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </button>
    )
}
