import { Layers } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation16({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] 
                 border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
            <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">
                    방과후 신청
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {phaseText} 기간 • {endDate}까지
                </p>
                <div className="mt-3 inline-flex px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-semibold">
                    신청하러 가기
                </div>
            </div>
            <div className="relative w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl" />
                <Layers className="w-10 h-10 text-blue-600 relative z-10" />
            </div>
        </button>
    )
}
