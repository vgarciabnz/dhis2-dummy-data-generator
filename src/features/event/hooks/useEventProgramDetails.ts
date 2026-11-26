import { EventProgramDetails } from '@/types/tracker'
import { useApiDataQuery } from '@/utils/useApiDataQuery'

export const useEventProgramDetails = (programId: string | null) => {
    const { data, isLoading, error } = useApiDataQuery<EventProgramDetails>({
        queryKey: ['event-program-details', programId],
        query: {
            resource: `programs/${programId}`,
            params: {
                fields: [
                    'id',
                    'displayName',
                    'categoryCombo[id,isDefault,categoryOptionCombos[id,displayName]]',
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
