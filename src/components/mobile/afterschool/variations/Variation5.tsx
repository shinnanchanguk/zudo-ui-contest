import { Moon, Star } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation5({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-slate-900 rounded-xl p-0.5
                 shadow-xl shadow-slate-300/30 active:scale-[0.98] transition-all
                 overflow-hidden group"
        >
            <div className="bg-slate-800 rounded-[10px] w-full h-full p-4 flex items-center relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10" />

                <div className="relative z-10 w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>

                <div className="relative z-10 flex-1 ml-4 text-left">
                    <h3 className="text-white font-bold text-lg">
                        {phaseText} 수강신청
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        진행중 • {endDate}까지
                    </p>
                </div>

                <div className="relative z-10">
                    <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300 transition-colors">이동</span>
                </div>
            </div>
        </button>
    )
}
