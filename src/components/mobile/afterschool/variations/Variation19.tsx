interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation19({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full relative bg-amber-400 rounded-lg p-4
                 shadow-md active:scale-[0.98] transition-all"
        >
            {/* Cutout circles for ticket effect */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />

            <div className="border-2 border-amber-500 border-dashed rounded-md p-3 flex flex-col items-center justify-center">
                <h3 className="text-amber-950 font-black text-xl tracking-tighter uppercase">
                    ADMISSION TICKET
                </h3>
                <p className="text-amber-900 font-bold mt-1">
                    방과후 {phaseText} 수강신청
                </p>
                <p className="text-amber-800 text-xs mt-2 font-mono">
                    VALID UNTIL {endDate}
                </p>
            </div>
        </button>
    )
}
