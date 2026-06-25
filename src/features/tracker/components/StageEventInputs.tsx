import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import styles from './StageEventInputs.module.css'
import { ProgramStage } from '@/types/tracker'

type Props = {
    stages: ProgramStage[]
    stageEventCounts: Record<string, number>
    onChange: (stageId: string, count: number) => void
}

export const StageEventInputs = ({
    stages,
    stageEventCounts,
    onChange,
}: Props) => {
    if (stages.length === 0) {return null}

    return (
        <div className={styles.container}>
            <p className={styles.label}>{i18n.t('Events per program stage')}</p>
            {stages.map((stage) =>
                stage.repeatable ? (
                    <div key={stage.id} className={styles.row}>
                        <InputField
                            label={stage.displayName}
                            type="number"
                            min="1"
                            value={String(stageEventCounts[stage.id] ?? 1)}
                            onChange={({ value }: { value: string }) =>
                                onChange(stage.id, Math.max(1, parseInt(value, 10) || 1))
                            }
                            inputWidth="120px"
                        />
                    </div>
                ) : (
                    <div key={stage.id} className={styles.row}>
                        <span className={styles.stageName}>
                            {stage.displayName}
                        </span>
                        <span className={styles.fixedCount}>
                            {i18n.t('1 event')}
                        </span>
                    </div>
                )
            )}
        </div>
    )
}
