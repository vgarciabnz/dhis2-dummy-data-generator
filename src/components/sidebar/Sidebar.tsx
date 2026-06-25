import i18n from '@dhis2/d2-i18n'
import { IconChevronLeft24 } from '@dhis2/ui'
import cx from 'classnames'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'
import {
    Sidenav,
    SidenavFooter,
    SidenavItems,
    SidenavLink,
    SidenavParent,
} from './sidenav'

type LinkItem = { to: string; label: string }

const SidebarNavLink = ({ to, label, end }: LinkItem & { end?: boolean }) => (
    <SidenavLink to={to} label={label} end={end} LinkComponent={NavLink} />
)

export const SidebarParent = ({
    label,
    links,
    initiallyOpen = true,
}: {
    label: string
    links: LinkItem[]
    initiallyOpen?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen)

    if (links.length === 1) {
        return <SidebarNavLink to={links[0].to} label={links[0].label} end />
    }

    return (
        <SidenavParent
            label={label}
            open={isOpen}
            onClick={() => setIsOpen(!isOpen)}
        >
            {links.map(({ to, label }) => (
                <SidebarNavLink key={to} to={to} label={label} end />
            ))}
        </SidenavParent>
    )
}

export const Sidebar = ({
    className,
    hideSidebar,
}: {
    className?: string
    hideSidebar?: boolean
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const isCollapsed = collapsed || hideSidebar

    return (
        <aside
            className={cx(styles.asideWrapper, className, {
                [styles.collapsed]: isCollapsed,
            })}
        >
            <Sidenav>
                <SidenavItems>
                    <SidebarNavLink
                        to="/tracker"
                        label={i18n.t('Tracker data')}
                        end
                    />
                    <SidenavLink
                        to="/event"
                        label={i18n.t('Event data')}
                        disabled
                    />
                    <SidenavLink
                        to="/aggregate"
                        label={i18n.t('Aggregate data')}
                        disabled
                    />
                </SidenavItems>
            </Sidenav>
            <button
                className={styles.collapseButton}
                type="button"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div
                    className={cx(styles.iconWrapper, {
                        [styles.collapsed]: isCollapsed,
                    })}
                >
                    <IconChevronLeft24 />
                </div>
            </button>
        </aside>
    )
}
