interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation21({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#E0E0E0] border-4 border-gray-400 p-1 active:border-gray-500 active:bg-gray-300 transition-colors"
            style={{ boxShadow: 'inset -4px -4px 0px 0px #888, inset 4px 4px 0px 0px #FFF' }}
        >
            <div className="bg-blue-700 px-4 py-3 flex items-center justify-between">
                <span className="text-white font-mono font-bold tracking-widest text-sm">
                    &gt; START_REG_{phaseText}
                </span>
                <span className="bg-red-500 text-white text-[10px] px-1 font-mono animate-pulse">
                    PRESS_ENTER
                </span>
            </div>
        </button>
    )
}
