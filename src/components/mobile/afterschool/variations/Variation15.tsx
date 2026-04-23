interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation15({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100
                 flex items-center gap-3 active:scale-[0.99] transition-transform"
        >
            <div className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                D-Day
            </div>
            <div className="text-left overflow-hidden">
                <p className="text-sm text-gray-900 truncate font-medium">
                    방과후 {phaseText} 수강신청이 진행중입니다.
                </p>
            </div>
        </button>
    )
}
