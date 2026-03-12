import { useQuery } from '@tanstack/react-query';
import { fetchNeighborhoods } from '../services/queries/neighborhoddQueries';
import { queryKeys } from '../services/queryKeys';

export function useNeighborhoodsQuery(){
    return useQuery({
        queryKey: queryKeys.neighborhoods.list(),
        queryFn: fetchNeighborhoods,
        staleTime: 1000 * 60 * 60 * 24,
    })
}
