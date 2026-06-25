import i18n from '@dhis2/d2-i18n'
import {
    NoticeBox,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useTrackerPrograms } from '../hooks/useTrackerPrograms'

type Props = {
    value: string
    onChange: (programId: string) => void
}

export const ProgramSelector = ({ value, onChange }: Props) => {
    const { programs, isLoading, error } = useTrackerPrograms()

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Error loading programs')}>
                {i18n.t('Could not load programs. Check your connection.')}
            </NoticeBox>
        )
    }

    return (
        <SingleSelectField
            label={i18n.t('Program')}
            selected={value}
            onChange={({ selected }: { selected: string }) =>
                onChange(selected)
            }
            loading={isLoading}
            placeholder={i18n.t('Select a tracker program')}
            filterable
        >
            {programs.map((p) => (
                <SingleSelectOption
                    key={p.id}
                    value={p.id}
                    label={p.displayName}
                />
            ))}
        </SingleSelectField>
    )
}
