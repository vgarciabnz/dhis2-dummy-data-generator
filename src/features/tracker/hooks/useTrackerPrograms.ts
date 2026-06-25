import { Program } from '@/types/tracker'
import { useApiDataQuery } from '@/utils/useApiDataQuery'

type ProgramsResponse = {
    programs: Program[]
}

export const useTrackerPrograms = () => {
    const { data, isLoading, error } = useApiDataQuery<ProgramsResponse>({
        queryKey: ['tracker-programs'],
        query: {
            resource: 'programs',
            params: {
                filter: 'programType:eq:WITH_REGISTRATION',
                fields: 'id,displayName',
                paging: false,
            },
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    return {
        programs: data?.programs ?? [],
        isLoading,
        error,
    }
}
