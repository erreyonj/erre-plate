export type UserRole = 'customer' | 'chef' | 'admin' | null;

export interface User {
  id: number | string;
  first_name: string;
  last_name: string;
  name?: string; // Laravel accessor, may be present
  email: string;
  dietary_preferences?: string | null;
  allergies?: string | null;
  role: UserRole;
  phone?: string | null;
  neighborhood_id?: number | null;
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    lat?: number
    lng?: number
  }
  credit_balance?: number;
  photo_url?: string | null;
}

export type ChefCard = {
  id: string
  name: string
  rating: number
  reviews: number
  priceFrom: number
  availabilityLabel: string
  availabilityTone: 'success' | 'warning'
  liked?: boolean
}

export type ExtractedAddress = {
  address: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    lat?: number
    lng?: number
  }
}