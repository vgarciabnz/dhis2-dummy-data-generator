import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, InputField, NoticeBox } from '@dhis2/ui'
import { useState } from 'react'
import styles from './TrackerPage.module.css'
import { JobResult } from '@/features/tracker/components/JobResult'
import { OrgUnitSelector } from '@/features/tracker/components/OrgUnitSelector'
import { ProgramSelector } from '@/features/tracker/components/ProgramSelector'
import { StageEventInputs } from '@/features/tracker/components/StageEventInputs'
import { useProgramDetails } from '@/features/tracker/hooks/useProgramDetails'
import { useTrackerImport } from '@/features/tracker/hooks/useTrackerImport'

export const TrackerPage = () => {
    const [programId, setProgramId] = useState('')
    const [orgUnit, setOrgUnit] = useState<{
        id: string
        path: string
    } | null>(null)
    const [teiCount, setTeiCount] = useState(10)
    const [stageEventCounts, setStageEventCounts] = useState<
        Record<string, number>
    >({})

    const { program, isLoading: loadingProgram, error: programError } =
        useProgramDetails(programId || null)

    const { state, submit, reset } = useTrackerImport()

    const isSubmitting =
        state.phase === 'building' ||
        state.phase === 'submitting' ||
        state.phase === 'polling'

    const handleProgramChange = (id: string) => {
        setProgramId(id)
        setStageEventCounts({})
    }

    const handleStageCountChange = (stageId: string, count: number) => {
        setStageEventCounts((prev) => ({ ...prev, [stageId]: count }))
    }

    const handleSubmit = () => {
        if (!program || !orgUnit) {return}
        submit(program, {
            programId: program.id,
            orgUnitId: orgUnit.id,
            teiCount,
            stageEventCounts,
        })
    }

    const handleReset = () => {
        reset()
    }

    if (state.phase === 'done') {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>
                    {i18n.t('Generate Tracker Data')}
                </h1>
                <JobResult report={state.report} onReset={handleReset} />
            </div>
        )
    }

    const statusMessage = {
        building: i18n.t('Building payload…'),
        submitting: i18n.t('Submitting to DHIS2…'),
        polling: i18n.t('Import job running…'),
    }[state.phase as 'building' | 'submitting' | 'polling']

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{i18n.t('Generate Tracker Data')}</h1>

            {state.phase === 'error' && (
                <NoticeBox error title={i18n.t('Import failed')}>
                    {state.message}
                </NoticeBox>
            )}

            <div className={styles.form}>
                <section className={styles.section}>
                    <ProgramSelector
                        value={programId}
                        onChange={handleProgramChange}
                    />
                </section>

                {programId && (
                    <>
                        {loadingProgram && (
                            <div className={styles.loader}>
                                <CircularLoader small />
                            </div>
                        )}

                        {programError && (
                            <NoticeBox
                                error
                                title={i18n.t('Error loading program details')}
                            >
                                {i18n.t('Could not load program details.')}
                            </NoticeBox>
                        )}

                        {program && (
                            <>
                                <section className={styles.section}>
                                    <p className={styles.fieldLabel}>
                                        {i18n.t('Organisation unit')}
                                    </p>
                                    <OrgUnitSelector
                                        selectedPath={orgUnit?.path ?? null}
                                        onSelect={(id, path) =>
                                            setOrgUnit({ id, path })
                                        }
                                    />
                                </section>

                                <section className={styles.section}>
                                    <InputField
                                        label={i18n.t(
                                            'Number of tracked entity instances'
                                        )}
                                        type="number"
                                        min="1"
                                        value={String(teiCount)}
                                        onChange={({
                                            value,
                                        }: {
                                            value: string
                                        }) =>
                                            setTeiCount(
                                                Math.max(
                                                    1,
                                                    parseInt(value, 10) || 1
                                                )
                                            )
                                        }
                                        inputWidth="180px"
                                    />
                                </section>

                                {program.programStages.length > 0 && (
                                    <section className={styles.section}>
                                        <StageEventInputs
                                            stages={program.programStages}
                                            stageEventCounts={stageEventCounts}
                                            onChange={handleStageCountChange}
                                        />
                                    </section>
                                )}

                                <section className={styles.actions}>
                                    {isSubmitting ? (
                                        <div className={styles.submitting}>
                                            <CircularLoader small />
                                            <span>{statusMessage}</span>
                                        </div>
                                    ) : (
                                        <Button
                                            primary
                                            onClick={handleSubmit}
                                            disabled={!orgUnit}
                                        >
                                            {i18n.t('Generate data')}
                                        </Button>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
