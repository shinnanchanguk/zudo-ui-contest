import { BookOpen, ArrowUpRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation4({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-bl from-teal-400 to-emerald-500 rounded-3xl px-6 py-5
                 shadow-lg shadow-teal-100/50 active:scale-[0.98] transition-all
                 flex flex-col items-start gap-3 group"
        >
            <div className="w-full flex justify-between items-start">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-white text-xs font-semibold">{endDate} 마감</span>
                </div>
            </div>

            <div className="w-full flex justify-between items-end">
                <div className="text-left">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        방과후 {phaseText} 신청
                    </h3>
                    <p className="text-white/80 text-sm mt-1">지금 바로 신청하기</p>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-emerald-500 group-hover:border-white transition-all text-white">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
        </button>
    )
}
