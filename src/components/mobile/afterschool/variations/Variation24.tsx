interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation24({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl p-4
                 shadow-[0_4px_0_0_#1e3a8a] active:shadow-none active:translate-y-[4px] transition-all
                 border-b border-blue-800"
        >
            <div className="flex items-center justify-center gap-2">
                <span className="text-white font-bold text-lg drop-shadow-md">
                    방과후 {phaseText} 신청하기
                </span>
            </div>
        </button>
    )
}
