import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { ImportReport, JobNotification } from '@/types/tracker'

export type FetchUids = (count: number) => Promise<string[]>

/** Builds a /api/tracker import payload. Receives a helper to reserve UIDs. */
export type PayloadBuilder = (fetchUids: FetchUids) => Promise<unknown>

export type ImportPhase =
    | { phase: 'idle' }
    | { phase: 'building' }
    | { phase: 'submitting' }
    | { phase: 'polling'; jobId: string }
    | { phase: 'done'; report: ImportReport }
    | { phase: 'error'; message: string }

export const useTrackerImport = () => {
    const dataEngine = useDataEngine()
    const [state, setState] = useState<ImportPhase>({ phase: 'idle' })
    const reportFetchedRef = useRef(false)

    const jobId = state.phase === 'polling' ? state.jobId : undefined

    const fetchUids: FetchUids = async (count) => {
        const res = await dataEngine.query({
            ids: { resource: 'system/id', params: { limit: count } },
        })
        return (res.ids as { codes: string[] }).codes
    }

    // Poll job notifications until completed
    const { data: notifications } = useQuery({
        queryKey: ['tracker-job-notifications', jobId],
        queryFn: async () => {
            const res = await dataEngine.query({
                notifications: { resource: `tracker/jobs/${jobId}` },
            })
            return res.notifications as JobNotification[]
        },
        enabled: state.phase === 'polling',
        refetchInterval: (data) => {
            if (!data || !Array.isArray(data)) {return 2000}
            return (data as JobNotification[]).some((n) => n.completed)
                ? false
                : 2000
        },
    })

    // When notifications show completion, fetch the import report
    useEffect(() => {
        if (state.phase !== 'polling' || !notifications) {return}
        if (reportFetchedRef.current) {return}
        if (!notifications.some((n) => n.completed)) {return}

        reportFetchedRef.current = true

        dataEngine
            .query({
                report: {
                    resource: `tracker/jobs/${jobId}/report`,
                    params: { reportMode: 'ERRORS' },
                },
            })
            .then((res) =>
                setState({ phase: 'done', report: res.report as ImportReport })
            )
            .catch((err: unknown) =>
                setState({
                    phase: 'error',
                    message:
                        err instanceof Error ? err.message : 'Unknown error',
                })
            )
    }, [notifications, state.phase, jobId, dataEngine])

    const submit = async (buildPayload: PayloadBuilder) => {
        reportFetchedRef.current = false

        try {
            setState({ phase: 'building' })
            const payload = await buildPayload(fetchUids)

            setState({ phase: 'submitting' })
            const res = await dataEngine.mutate({
                resource: 'tracker',
                type: 'create',
                data: payload,
                params: { async: true, atomicMode: 'ALL' },
            })

            const newJobId = (res as { response?: { id?: string } })?.response
                ?.id
            if (!newJobId) {throw new Error('No job ID returned from server')}
            setState({ phase: 'polling', jobId: newJobId })
        } catch (err: unknown) {
            setState({
                phase: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
            })
        }
    }

    const reset = () => {
        reportFetchedRef.current = false
        setState({ phase: 'idle' })
    }

    return { state, submit, reset }
}
