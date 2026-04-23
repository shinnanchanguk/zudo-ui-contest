interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation28({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#FFFF00] border-4 border-black p-4
                 flex flex-col items-center justify-center gap-1 active:bg-[#F0F000]"
        >
            <h3 className="text-black font-black text-xl uppercase">
                ! NOTICE !
            </h3>
            <p className="text-black font-bold text-lg border-b-2 border-black">
                방과후 {phaseText} 신청
            </p>
        </button>
    )
}
