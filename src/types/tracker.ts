export type ValueType =
    | 'TEXT'
    | 'LONG_TEXT'
    | 'NUMBER'
    | 'INTEGER'
    | 'INTEGER_POSITIVE'
    | 'INTEGER_NEGATIVE'
    | 'INTEGER_ZERO_OR_POSITIVE'
    | 'PERCENTAGE'
    | 'UNIT_INTERVAL'
    | 'DATE'
    | 'DATETIME'
    | 'BOOLEAN'
    | 'TRUE_ONLY'
    | 'USERNAME'
    | 'EMAIL'
    | 'PHONE_NUMBER'
    | 'URL'
    | 'ORGANISATION_UNIT'
    | 'COORDINATE'
    | 'FILE_RESOURCE'
    | 'IMAGE'

export type OptionSet = {
    id: string
    options: { id: string; code: string }[]
}

export type TrackedEntityAttribute = {
    id: string
    displayName: string
    valueType: ValueType
    unique: boolean
    generated: boolean
    optionSet?: OptionSet
}

export type ProgramTrackedEntityAttribute = {
    trackedEntityAttribute: TrackedEntityAttribute
}

export type DataElement = {
    id: string
    displayName: string
    valueType: ValueType
    optionSet?: OptionSet
}

export type ProgramStageDataElement = {
    dataElement: DataElement
}

export type ProgramStage = {
    id: string
    displayName: string
    repeatable: boolean
    programStageDataElements: ProgramStageDataElement[]
}

export type Program = {
    id: string
    displayName: string
}

export type ProgramDetails = {
    id: string
    displayName: string
    trackedEntityType: { id: string }
    programTrackedEntityAttributes: ProgramTrackedEntityAttribute[]
    programStages: ProgramStage[]
}

export type CategoryCombo = {
    id: string
    isDefault: boolean
    categoryOptionCombos: { id: string; displayName: string }[]
}

/** Event program (WITHOUT_REGISTRATION): exactly one program stage. */
export type EventProgramDetails = {
    id: string
    displayName: string
    categoryCombo: CategoryCombo
    programStages: ProgramStage[]
}

export type UserOrgUnit = {
    id: string
    path: string
}

export type JobNotification = {
    uid: string
    level: 'ERROR' | 'WARNING' | 'INFO'
    category: string
    message: string
    time: string
    completed: boolean
}

export type ErrorReport = {
    message: string
    errorCode: string
    trackerType: 'TRACKED_ENTITY' | 'ENROLLMENT' | 'EVENT' | 'RELATIONSHIP'
    uid: string
}

export type TypeStats = {
    created: number
    updated: number
    deleted: number
    ignored: number
}

export type ImportReport = {
    status: 'OK' | 'WARNING' | 'ERROR'
    stats: TypeStats
    validationReport: {
        errorReports: ErrorReport[]
        warningReports: ErrorReport[]
    }
    bundleReport: {
        typeReportMap: {
            TRACKED_ENTITY?: { stats: TypeStats }
            ENROLLMENT?: { stats: TypeStats }
            EVENT?: { stats: TypeStats }
        }
    }
}
