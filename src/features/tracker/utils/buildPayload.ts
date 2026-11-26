import { generateValue } from '@/features/shared/utils/generateValue'
import { ProgramDetails } from '@/types/tracker'

export type GenerationFormValues = {
    programId: string
    orgUnitId: string
    teiCount: number
    stageEventCounts: Record<string, number>
}

export type TrackerPayload = {
    trackedEntities: unknown[]
}

const randomBetween = (start: Date, end: Date): string => {
    const ms =
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return new Date(ms).toISOString()
}

export const buildTrackerPayload = async (
    program: ProgramDetails,
    formValues: GenerationFormValues,
    fetchUids: (count: number) => Promise<string[]>
): Promise<TrackerPayload> => {
    const { orgUnitId, teiCount, stageEventCounts } = formValues
    const now = new Date()
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    // Collect unique TEXT attributes that need pre-generated UIDs
    const uniqueTextAttrs = program.programTrackedEntityAttributes
        .map((p) => p.trackedEntityAttribute)
        .filter(
            (attr) =>
                attr.unique && !attr.generated && attr.valueType === 'TEXT'
        )

    const totalUniqueIds = uniqueTextAttrs.length * teiCount
    const uids =
        totalUniqueIds > 0 ? await fetchUids(totalUniqueIds) : []

    // Map: attrId → array of UIDs (one per TEI)
    const attrUidMap: Record<string, string[]> = {}
    uniqueTextAttrs.forEach((attr, i) => {
        attrUidMap[attr.id] = uids.slice(i * teiCount, (i + 1) * teiCount)
    })

    const trackedEntities = Array.from({ length: teiCount }, (_, teiIndex) => {
        const enrollmentDate = randomBetween(oneYearAgo, now)
        const enrollmentDateObj = new Date(enrollmentDate)

        const attributes = program.programTrackedEntityAttributes
            .map(({ trackedEntityAttribute: attr }) => {
                if (attr.generated) {return null}

                let value: string | null
                if (attr.unique && attr.valueType === 'TEXT') {
                    value = attrUidMap[attr.id]?.[teiIndex] ?? null
                } else {
                    value = generateValue(
                        attr.valueType,
                        attr.optionSet?.options
                    )
                }

                if (value === null) {return null}
                return { attribute: attr.id, value }
            })
            .filter(Boolean)

        const events = program.programStages.flatMap((stage) => {
            const eventCount = stage.repeatable
                ? (stageEventCounts[stage.id] ?? 1)
                : 1

            return Array.from({ length: eventCount }, () => {
                const eventDate = randomBetween(enrollmentDateObj, now)

                const dataValues = stage.programStageDataElements
                    .map(({ dataElement: de }) => {
                        const value = generateValue(
                            de.valueType,
                            de.optionSet?.options
                        )
                        if (value === null) {return null}
                        return { dataElement: de.id, value }
                    })
                    .filter(Boolean)

                return {
                    programStage: stage.id,
                    orgUnit: orgUnitId,
                    occurredAt: eventDate,
                    status: 'COMPLETED',
                    dataValues,
                }
            })
        })

        return {
            trackedEntityType: program.trackedEntityType.id,
            orgUnit: orgUnitId,
            attributes,
            enrollments: [
                {
                    program: program.id,
                    orgUnit: orgUnitId,
                    enrolledAt: enrollmentDate,
                    occurredAt: enrollmentDate,
                    status: 'COMPLETED',
                    events,
                },
            ],
        }
    })

    return { trackedEntities }
}
