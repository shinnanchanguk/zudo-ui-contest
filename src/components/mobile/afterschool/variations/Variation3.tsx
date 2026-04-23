import { GraduationCap, Sparkles } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation3({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 rounded-2xl p-[2px]
                 shadow-lg shadow-pink-200/50 active:scale-[0.98] transition-all"
        >
            <div className="bg-white/10 backdrop-blur-sm rounded-[14px] px-5 py-4 flex items-center h-full w-full">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform rotate-3 shadow-md">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                </div>

                <div className="flex-1 ml-4 text-left">
                    <p className="text-xs text-white/90 font-medium mb-0.5">서두르세요!</p>
                    <p className="text-lg font-bold text-white leading-tight">
                        {phaseText} 수강신청
                    </p>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-white/80">마감까지</span>
                    <span className="text-sm font-bold text-white">{endDate}</span>
                </div>
            </div>
        </button>
    )
}
