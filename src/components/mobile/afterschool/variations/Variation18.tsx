import { Bell } from 'lucide-react'

interface Props {
    phaseText?: string
    endDate?: string
    onClick?: () => void
}

export function Variation18({ phaseText = '1차', endDate = '12월 31일', onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gray-900 rounded-xl p-4 flex items-start gap-4 shadow-2xl"
        >
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-left">
                <h4 className="text-white font-bold text-sm">알림</h4>
                <p className="text-gray-300 text-sm mt-1">
                    지금 방과후 {phaseText} 수강신청을 할 수 있습니다. (~{endDate})
                </p>
            </div>
        </button>
    )
}
