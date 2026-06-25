import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import styles from './JobResult.module.css'
import { ImportReport } from '@/types/tracker'

type Props = {
    report: ImportReport
    onReset: () => void
}

export const JobResult = ({ report, onReset }: Props) => {
    const isSuccess = report.status === 'OK'
    const errors = report.validationReport?.errorReports ?? []

    const teiStats =
        report.bundleReport?.typeReportMap?.TRACKED_ENTITY?.stats
    const enrollmentStats =
        report.bundleReport?.typeReportMap?.ENROLLMENT?.stats
    const eventStats = report.bundleReport?.typeReportMap?.EVENT?.stats

    return (
        <div className={styles.container}>
            <NoticeBox
                title={
                    isSuccess
                        ? i18n.t('Data generated successfully')
                        : i18n.t('Import failed')
                }
                error={!isSuccess}
                valid={isSuccess}
            >
                <div className={styles.stats}>
                    {teiStats && (
                        <span>
                            {i18n.t('TEIs: {{n}} created', {
                                n: teiStats.created,
                            })}
                        </span>
                    )}
                    {enrollmentStats && (
                        <span>
                            {i18n.t('Enrollments: {{n}} created', {
                                n: enrollmentStats.created,
                            })}
                        </span>
                    )}
                    {eventStats && (
                        <span>
                            {i18n.t('Events: {{n}} created', {
                                n: eventStats.created,
                            })}
                        </span>
                    )}
                    {report.stats?.ignored > 0 && (
                        <span className={styles.ignored}>
                            {i18n.t('{{n}} objects ignored', {
                                n: report.stats.ignored,
                            })}
                        </span>
                    )}
                </div>
            </NoticeBox>

            {errors.length > 0 && (
                <div className={styles.errors}>
                    <p className={styles.errorsTitle}>
                        {i18n.t('Validation errors ({{n}})', {
                            n: errors.length,
                        })}
                    </p>
                    <ul className={styles.errorList}>
                        {errors.slice(0, 20).map((err, i) => (
                            <li key={i} className={styles.errorItem}>
                                <span className={styles.errorCode}>
                                    {err.errorCode}
                                </span>
                                <span className={styles.errorTrackerType}>
                                    {err.trackerType}
                                </span>
                                <span>{err.message}</span>
                            </li>
                        ))}
                        {errors.length > 20 && (
                            <li className={styles.moreErrors}>
                                {i18n.t('... and {{n}} more errors', {
                                    n: errors.length - 20,
                                })}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <Button onClick={onReset}>{i18n.t('Generate more data')}</Button>
        </div>
    )
}
