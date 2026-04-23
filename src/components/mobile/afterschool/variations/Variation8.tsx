import { Zap } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation8({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-black rounded-xl p-0.5 group active:scale-[0.98] transition-all"
        >
            <div className="rounded-[10px] bg-gray-900 p-4 relative overflow-hidden">
                {/* Neon Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-transparent to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'inset(0 0 0 0 round 10px)', padding: '2px' }} />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                            <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-cyan-400 font-mono text-xs mb-0.5">DEADLINE: {endDate}</p>
                            <h3 className="text-white font-bold text-base tracking-wide uppercase">
                                방과후 {phaseText} 신청
                            </h3>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-pink-600 rounded-md text-white text-xs font-bold">
                        GO
                    </div>
                </div>
            </div>
        </button>
    )
}
