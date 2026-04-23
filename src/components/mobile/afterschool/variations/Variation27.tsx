interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation27({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-black rounded-lg p-5 border border-gray-800
                 flex items-center justify-between shadow-2xl shadow-purple-900/20"
        >
            <div className="text-left">
                <h3 className="text-white font-medium text-lg tracking-wide">
                    After School
                </h3>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                    Registration Open
                </p>
            </div>
            <div className="w-1.5 h-10 bg-purple-600 rounded-full" />
        </button>
    )
}
