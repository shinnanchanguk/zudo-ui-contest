import { GraduationCap, ArrowRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation6({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <div className="w-full relative rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <button
                onClick={onClick}
                className="relative w-full h-full px-5 py-4 flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
            >
                <div className="flex-1 text-left">
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                        Season Update
                    </p>
                    <h3 className="text-white text-xl font-bold">
                        방과후 {phaseText} 신청
                    </h3>
                    <p className="text-white/90 text-sm mt-1">
                        마감 기한: {endDate}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </button>
        </div>
    )
}
