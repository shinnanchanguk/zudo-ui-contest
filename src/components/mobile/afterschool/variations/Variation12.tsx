interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation12({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gray-50 rounded-lg p-4 text-center
                 active:bg-gray-100 transition-colors border border-dashed border-gray-300"
        >
            <span className="text-gray-900 font-bold block">
                💡 방과후 {phaseText} 수강신청
            </span>
            <span className="text-gray-500 text-xs mt-1 block">
                마감일: {endDate}
            </span>
        </button>
    )
}
