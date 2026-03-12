import { api } from '../api'
import type { NeighborhoodsResponse } from '../../types/neighborhood'

export const fetchNeighborhoods = async (): Promise<NeighborhoodsResponse> => {
    const res = await api.get('/neighborhoods')
    return res.data
}
