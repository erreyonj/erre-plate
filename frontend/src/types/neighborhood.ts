export interface Neighborhood {
    id: number,
    name: string,
    zip_code: number,
    city: string,
    state: string
}

export interface NeighborhoodsResponse {
    data: Neighborhood[]
}