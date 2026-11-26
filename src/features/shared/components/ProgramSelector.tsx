import i18n from '@dhis2/d2-i18n'
import { NoticeBox, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { ProgramType, usePrograms } from '../hooks/usePrograms'

type Props = {
    programType: ProgramType
    placeholder: string
    value: string
    onChange: (programId: string) => void
}

export const ProgramSelector = ({
    programType,
    placeholder,
    value,
    onChange,
}: Props) => {
    const { programs, isLoading, error } = usePrograms(programType)

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
            placeholder={placeholder}
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
