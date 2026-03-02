import type { ExtractedAddress } from "../types/user"


export function extractAddressComponents(
    place: google.maps.places.PlaceResult
  ): ExtractedAddress {
    const components = place.address_components ?? []
  
    const get = (type: string, short = false) =>
      components.find(c => c.types.includes(type))?.[
        short ? 'short_name' : 'long_name'
      ]
  
    const streetNumber = get('street_number')
    const route = get('route')
  
    return {
        address: {
            street: [streetNumber, route].filter(Boolean).join(' '),
            city: get('locality'),
            state: get('administrative_area_level_1', true),
            zip: get('postal_code'),
            country: get('country'),
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
        }
    }
  }