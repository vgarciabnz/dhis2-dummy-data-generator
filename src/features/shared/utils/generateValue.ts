import { ValueType } from '@/types/tracker'

const SKIPPED_TYPES = new Set<ValueType>([
    'FILE_RESOURCE',
    'IMAGE',
    'COORDINATE',
    'ORGANISATION_UNIT',
])

const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const randomDate = (start: Date, end: Date): string => {
    const ms =
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return new Date(ms).toISOString().slice(0, 10)
}

export const randomDatetime = (start: Date, end: Date): string => {
    const ms =
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return new Date(ms).toISOString()
}

const randomString = (length: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    return Array.from(
        { length },
        () => chars[randomInt(0, chars.length - 1)]
    ).join('')
}

export const generateValue = (
    valueType: ValueType,
    options?: { code: string }[]
): string | null => {
    if (SKIPPED_TYPES.has(valueType)) {return null}

    if (options && options.length > 0) {
        return options[randomInt(0, options.length - 1)].code
    }

    const now = new Date()
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    switch (valueType) {
        case 'TEXT':
        case 'LONG_TEXT':
            return randomString(randomInt(4, 12))
        case 'NUMBER':
            return String(parseFloat((Math.random() * 1000).toFixed(2)))
        case 'INTEGER':
            return String(randomInt(-1000, 1000))
        case 'INTEGER_POSITIVE':
            return String(randomInt(1, 1000))
        case 'INTEGER_NEGATIVE':
            return String(randomInt(-1000, -1))
        case 'INTEGER_ZERO_OR_POSITIVE':
            return String(randomInt(0, 1000))
        case 'PERCENTAGE':
            return String(randomInt(0, 100))
        case 'UNIT_INTERVAL':
            return String(parseFloat(Math.random().toFixed(4)))
        case 'DATE':
            return randomDate(oneYearAgo, now)
        case 'DATETIME':
            return randomDatetime(oneYearAgo, now)
        case 'BOOLEAN':
            return String(Math.random() > 0.5)
        case 'TRUE_ONLY':
            return Math.random() > 0.5 ? 'true' : null
        case 'USERNAME':
            return `user_${randomString(6)}`
        case 'EMAIL':
            return `${randomString(6)}@example.com`
        case 'PHONE_NUMBER':
            return `+1${randomInt(1000000000, 9999999999)}`
        case 'URL':
            return `https://example.com/${randomString(8)}`
        default:
            return null
    }
}
