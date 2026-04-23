interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation22({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#FFF9C4] p-4 shadow-md rotate-1 hover:rotate-0 transition-transform duration-300"
            style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 99% 98%, 0% 100%, 1% 2%)' }}
        >
            <div className="border border-dashed border-gray-400 p-3 h-full">
                <h3 className="font-handwriting text-xl font-bold text-gray-800" style={{ fontFamily: 'comic-sans, cursive' }}>
                    방과후 {phaseText} 신청!
                </h3>
                <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: 'comic-sans, cursive' }}>
                    잊지말고 신청하기 ❤️ ({endDate})
                </p>
            </div>
        </button>
    )
}
