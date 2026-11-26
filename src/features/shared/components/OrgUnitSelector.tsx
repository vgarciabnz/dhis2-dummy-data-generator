import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox, OrganisationUnitTree } from '@dhis2/ui'
import { useUserOrgUnits } from '../hooks/useUserOrgUnits'
import styles from './OrgUnitSelector.module.css'

type Props = {
    selectedPath: string | null
    onSelect: (id: string, path: string) => void
}

export const OrgUnitSelector = ({ selectedPath, onSelect }: Props) => {
    const { orgUnits, isLoading, error } = useUserOrgUnits()

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <CircularLoader small />
            </div>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Error loading organisation units')}>
                {i18n.t('Could not load organisation units.')}
            </NoticeBox>
        )
    }

    const roots = orgUnits.map((ou) => ou.path)
    const selected = selectedPath ? [selectedPath] : []

    return (
        <div className={styles.tree}>
            <OrganisationUnitTree
                roots={roots}
                selected={selected}
                singleSelection
                onChange={({
                    id,
                    path,
                }: {
                    id: string
                    path: string
                }) => onSelect(id, path)}
            />
        </div>
    )
}
