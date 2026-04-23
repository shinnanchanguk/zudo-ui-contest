interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation30({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full p-[3px] rounded-2xl bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-gradient-x
                 shadow-lg active:scale-[0.98] transition-transform"
            style={{ backgroundSize: '200% 200%' }}
        >
            <div className="bg-white rounded-[14px] px-5 py-4 w-full h-full flex items-center justify-between">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 text-lg">
                    ZUDO PREMIUM
                </span>
                <span className="text-gray-400 text-xs">
                    방과후 {phaseText}
                </span>
            </div>
        </button>
    )
}
