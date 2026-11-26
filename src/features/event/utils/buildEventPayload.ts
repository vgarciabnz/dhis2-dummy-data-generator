import {
    generateValue,
    randomDatetime,
} from '@/features/shared/utils/generateValue'
import { EventProgramDetails } from '@/types/tracker'

export type EventGenerationFormValues = {
    orgUnitId: string
    eventCount: number
}

export type EventPayload = {
    events: unknown[]
}

const pickRandom = <T>(items: T[]): T =>
    items[Math.floor(Math.random() * items.length)]

/**
 * Builds a /api/tracker payload of standalone events for an event program
 * (WITHOUT_REGISTRATION). No tracked entities or enrollments are sent; the
 * server attaches the events to the program's default enrollment.
 */
export const buildEventPayload = (
    program: EventProgramDetails,
    { orgUnitId, eventCount }: EventGenerationFormValues
): EventPayload => {
    // Event programs always have exactly one stage
    const [stage] = program.programStages
    if (!stage) {
        throw new Error('Event program has no program stage')
    }

    // Programs with a non-default category combo reject events without an
    // attribute option combo, so pick one at random per event.
    const attributeOptionCombos = program.categoryCombo?.isDefault
        ? []
        : (program.categoryCombo?.categoryOptionCombos ?? [])

    const now = new Date()
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const events = Array.from({ length: eventCount }, () => {
        const dataValues = stage.programStageDataElements
            .map(({ dataElement: de }) => {
                const value = generateValue(de.valueType, de.optionSet?.options)
                if (value === null) {
                    return null
                }
                return { dataElement: de.id, value }
            })
            .filter(Boolean)

        return {
            program: program.id,
            programStage: stage.id,
            orgUnit: orgUnitId,
            occurredAt: randomDatetime(oneYearAgo, now),
            status: 'COMPLETED',
            ...(attributeOptionCombos.length > 0 && {
                attributeOptionCombo: pickRandom(attributeOptionCombos).id,
            }),
            dataValues,
        }
    })

    return { events }
}
