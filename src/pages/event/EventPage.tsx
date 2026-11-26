import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, InputField, NoticeBox } from '@dhis2/ui'
import { useState } from 'react'
import styles from '../GeneratorPage.module.css'
import { useEventProgramDetails } from '@/features/event/hooks/useEventProgramDetails'
import { buildEventPayload } from '@/features/event/utils/buildEventPayload'
import { JobResult } from '@/features/shared/components/JobResult'
import { OrgUnitSelector } from '@/features/shared/components/OrgUnitSelector'
import { ProgramSelector } from '@/features/shared/components/ProgramSelector'
import { useTrackerImport } from '@/features/shared/hooks/useTrackerImport'

export const EventPage = () => {
    const [programId, setProgramId] = useState('')
    const [orgUnit, setOrgUnit] = useState<{
        id: string
        path: string
    } | null>(null)
    const [eventCount, setEventCount] = useState(10)

    const {
        program,
        isLoading: loadingProgram,
        error: programError,
    } = useEventProgramDetails(programId || null)

    const { state, submit, reset } = useTrackerImport()

    const isSubmitting =
        state.phase === 'building' ||
        state.phase === 'submitting' ||
        state.phase === 'polling'

    const handleSubmit = () => {
        if (!program || !orgUnit) {
            return
        }
        const formValues = { orgUnitId: orgUnit.id, eventCount }
        submit(async () => buildEventPayload(program, formValues))
    }

    if (state.phase === 'done') {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>
                    {i18n.t('Generate Event Data')}
                </h1>
                <JobResult
                    report={state.report}
                    onReset={reset}
                    statTypes={['EVENT']}
                />
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
            <h1 className={styles.title}>{i18n.t('Generate Event Data')}</h1>

            {state.phase === 'error' && (
                <NoticeBox error title={i18n.t('Import failed')}>
                    {state.message}
                </NoticeBox>
            )}

            <div className={styles.form}>
                <section className={styles.section}>
                    <ProgramSelector
                        programType="WITHOUT_REGISTRATION"
                        placeholder={i18n.t('Select an event program')}
                        value={programId}
                        onChange={setProgramId}
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
                                        label={i18n.t('Number of events')}
                                        type="number"
                                        min="1"
                                        value={String(eventCount)}
                                        onChange={({
                                            value,
                                        }: {
                                            value: string
                                        }) =>
                                            setEventCount(
                                                Math.max(
                                                    1,
                                                    parseInt(value, 10) || 1
                                                )
                                            )
                                        }
                                        inputWidth="180px"
                                    />
                                </section>

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
