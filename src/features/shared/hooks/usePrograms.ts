import { Program } from '@/types/tracker'
import { useApiDataQuery } from '@/utils/useApiDataQuery'

export type ProgramType = 'WITH_REGISTRATION' | 'WITHOUT_REGISTRATION'

type ProgramsResponse = {
    programs: Program[]
}

export const usePrograms = (programType: ProgramType) => {
    const { data, isLoading, error } = useApiDataQuery<ProgramsResponse>({
        queryKey: ['programs', programType],
        query: {
            resource: 'programs',
            params: {
                filter: `programType:eq:${programType}`,
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
