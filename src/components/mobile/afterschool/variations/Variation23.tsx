import { ArrowRight } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation23({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#A3E635] border-2 border-black p-4
                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">NEW</span>
                    <h3 className="font-black text-black text-lg mt-1">
                        방과후 {phaseText}
                    </h3>
                </div>
                <div className="bg-white border-2 border-black rounded-full p-2">
                    <ArrowRight className="w-5 h-5 text-black" />
                </div>
            </div>
        </button>
    )
}
