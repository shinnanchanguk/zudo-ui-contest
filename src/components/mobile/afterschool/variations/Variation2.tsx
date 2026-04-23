import { GraduationCap, ArrowRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation2({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5
                 shadow-lg shadow-blue-200/50 active:scale-[0.98] transition-all
                 relative overflow-hidden group"
        >
            {/* Decorative Circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

            <div className="relative flex items-center justify-between">
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                            NEW
                        </span>
                        <span className="text-indigo-100 text-xs font-medium">마감 {endDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                        방과후 {phaseText} 수강신청
                    </h3>
                </div>
                <div className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </button>
    )
}
