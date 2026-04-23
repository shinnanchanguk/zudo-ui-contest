// @ts-nocheck
'use client'

import { useMemo } from 'react'
import {
    Users,
    MapPin,
    BookOpen,
    Clock,
    Calendar,
    AlertTriangle,
} from 'lucide-react'
import type { AfterschoolClassWithRelations } from '@/hooks/useAfterschoolClasses'

interface SessionDescription {
    session: number
    description: string
}

interface ProgramInfoTabProps {
    program: AfterschoolClassWithRelations
    hasConflict?: boolean
    conflictMessage?: string
}


export function ProgramInfoTab({
    program,
    hasConflict = false,
    conflictMessage,
}: ProgramInfoTabProps) {
    // 차시별 설명
    const sessionDescriptions = useMemo(() => {
        if (!program.session_descriptions) return []
        try {
            const parsed = program.session_descriptions as unknown as SessionDescription[]
            return Array.isArray(parsed) ? parsed.filter(d => d.description.trim()) : []
        } catch {
            return []
        }
    }, [program.session_descriptions])


    // 담당 선생님 이름
    const teacherName = program.teacher?.full_name || program.teacher_name
    const programDescription = program.description?.trim()

    return (
        <div className="space-y-5">
            {/* 시간 충돌 경고 */}
            {hasConflict && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium text-sm">시간 겹침 신청 안내</span>
                    </div>
                    <p className="mt-1 text-sm text-yellow-700">
                        {conflictMessage || '이미 신청한 프로그램과 시간이 겹칩니다. 신청은 가능하지만, 최종 조정에서 우선순위가 낮은 강좌는 취소될 수 있습니다.'}
                    </p>
                </div>
            )}


            {/* 기본 정보 */}
            <div className="space-y-3">
                {teacherName && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                            <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">담당 선생님</p>
                            <p className="font-medium">{teacherName}</p>
                        </div>
                    </div>
                )}

                {program.location?.name && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100">
                            <MapPin className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">장소</p>
                            <p className="font-medium">{program.location.name}</p>
                        </div>
                    </div>
                )}

                {program.textbook_name && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">교재</p>
                            <p className="font-medium">{program.textbook_name}</p>
                        </div>
                    </div>
                )}

                {program.session_count && program.session_count > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                            <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">총 차시</p>
                            <p className="font-medium">{program.session_count}차시</p>
                        </div>
                    </div>
                )}

                {program.start_date && program.end_date && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                            <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">운영 기간</p>
                            <p className="font-medium">{program.start_date} ~ {program.end_date}</p>
                        </div>
                    </div>
                )}

            </div>

            {/* 프로그램 설명 */}
            {programDescription && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">프로그램 설명</h4>
                    <div className="rounded-lg border bg-gray-50 p-4">
                        <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap break-words">
                            {programDescription}
                        </p>
                    </div>
                </div>
            )}

            {/* 차시별 설명 */}
            {sessionDescriptions.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">커리큘럼(총 {program.session_count ?? 0}차시)</h4>
                    <div className="space-y-2">
                        {sessionDescriptions.map(item => (
                            <div
                                key={item.session}
                                className="rounded-lg border bg-gray-50 p-3"
                            >
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 mr-2">
                                    {item.session}
                                </span>
                                <p className="mt-2 text-sm leading-6 text-gray-700 whitespace-pre-wrap break-words">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
