import { UserOrgUnit } from '@/types/tracker'
import { useApiDataQuery } from '@/utils/useApiDataQuery'

type MeResponse = {
    organisationUnits: UserOrgUnit[]
}

export const useUserOrgUnits = () => {
    const { data, isLoading, error } = useApiDataQuery<MeResponse>({
        queryKey: ['me-org-units'],
        query: {
            resource: 'me',
            params: { fields: 'organisationUnits[id,path]' },
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    return {
        orgUnits: data?.organisationUnits ?? [],
        isLoading,
        error,
    }
}
