import { Share } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation29({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#F0F4FF] rounded-xl p-4
                 border-2 border-dashed border-indigo-300
                 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Share className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-indigo-800 font-bold">
                    {phaseText} 수강신청 공유하기
                </span>
            </div>
        </button>
    )
}
