import { ProgramDetails } from '@/types/tracker'
import { useApiDataQuery } from '@/utils/useApiDataQuery'

export const useProgramDetails = (programId: string | null) => {
    const { data, isLoading, error } = useApiDataQuery<ProgramDetails>({
        queryKey: ['program-details', programId],
        query: {
            resource: `programs/${programId}`,
            params: {
                fields: [
                    'id',
                    'displayName',
                    'trackedEntityType[id]',
                    'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,valueType,unique,generated,optionSet[id,options[id,code]]]]',
                    'programStages[id,displayName,repeatable,programStageDataElements[dataElement[id,displayName,valueType,optionSet[id,options[id,code]]]]]',
                ].join(','),
            },
        },
        enabled: !!programId,
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    return {
        program: data ?? null,
        isLoading,
        error,
    }
}
