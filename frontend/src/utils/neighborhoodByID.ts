export const neighborhoodNameByID = (id: number) => {
    
    const neighborhoods = [
        { id: 1, name: 'Downtown', zip_code: '53703' },
        { id: 2, name: 'North Side', zip_code: '53704' },
        { id: 3, name: 'West Side', zip_code: '53705' },
        { id: 4, name: 'UW-Madison Campus', zip_code: '53706' },
        { id: 5, name: 'Near West', zip_code: '53711' },
        { id: 6, name: 'South Madison', zip_code: '53713' },
        { id: 7, name: 'East Madison', zip_code: '53714' },
        { id: 8, name: 'Near West Madison', zip_code: '53715' },
        { id: 9, name: 'Southeast', zip_code: '53716' },
        { id: 10, name: 'Far West', zip_code: '53717' },
        { id: 11, name: 'East Madison', zip_code: '53718' },
        { id: 12, name: 'Southwest Madison', zip_code: '53719' },
        { id: 13, name: 'Shorewood Hills', zip_code: '53726' },
        { id: 14, name: 'UW Hospital', zip_code: '53792' },
    ]
    return neighborhoods.find((neighborhood) => neighborhood.id === id)?.name;
}

export const neighborhoodZipCodeByID = (id: number) => {
    const neighborhoods = [
        { id: 1, name: 'Downtown', zip_code: '53703' },
        { id: 2, name: 'North Side', zip_code: '53704' },
        { id: 3, name: 'West Side', zip_code: '53705' },
        { id: 4, name: 'UW-Madison Campus', zip_code: '53706' },
        { id: 5, name: 'Near West', zip_code: '53711' },
        { id: 6, name: 'South Madison', zip_code: '53713' },
        { id: 7, name: 'East Madison', zip_code: '53714' },
        { id: 8, name: 'Near West Madison', zip_code: '53715' },
        { id: 9, name: 'Southeast', zip_code: '53716' },
        { id: 10, name: 'Far West', zip_code: '53717' },
        { id: 11, name: 'East Madison', zip_code: '53718' },
        { id: 12, name: 'Southwest Madison', zip_code: '53719' },
        { id: 13, name: 'Shorewood Hills', zip_code: '53726' },
        { id: 14, name: 'UW Hospital', zip_code: '53792' },
    ]
    return neighborhoods.find((neighborhood) => neighborhood.id === id)?.zip_code;
}