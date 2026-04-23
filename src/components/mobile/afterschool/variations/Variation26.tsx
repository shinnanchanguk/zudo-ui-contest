interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation26({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-pink-100 rounded-[2rem] px-6 py-4
                 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
            <div className="flex items-center justify-between">
                <span className="text-pink-600 font-black text-lg">
                    ☁️ 방과후 {phaseText}
                </span>
                <span className="bg-pink-500 text-white rounded-full px-4 py-1.5 text-sm font-bold">
                    신청하기
                </span>
            </div>
        </button>
    )
}
