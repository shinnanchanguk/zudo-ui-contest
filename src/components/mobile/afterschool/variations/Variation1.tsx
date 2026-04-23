import { GraduationCap, ChevronRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation1({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl px-5 py-4
                 shadow-lg shadow-indigo-200/50 active:scale-[0.98] transition-all
                 flex items-center group"
        >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 ml-4 text-left">
                <p className="text-base font-bold text-white mb-0.5">
                    방과후 {phaseText} 수강신청
                </p>
                <p className="text-sm text-white/90 font-medium">
                    마감: {endDate}까지
                </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
            </div>
        </button>
    )
}
