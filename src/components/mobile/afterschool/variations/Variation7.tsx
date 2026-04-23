import { GraduationCap } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation7({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-[#FAFAFA] rounded-3xl p-5
                 shadow-sm border border-gray-100 active:scale-[0.98] transition-all
                 relative overflow-hidden"
        >
            {/* Mesh Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/50 rounded-full blur-2xl -ml-5 -mb-5" />

            <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-purple-600">
                    <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                    <h4 className="text-gray-900 font-bold text-lg leading-tight">
                        {phaseText} 수강신청 오픈
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-gray-500 text-sm">{endDate}까지 접수</span>
                    </div>
                </div>
            </div>
        </button>
    )
}
