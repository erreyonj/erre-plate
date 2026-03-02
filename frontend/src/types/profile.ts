import type { User } from './user';

export interface UpdateProfilePayload {
    first_name: string;
    last_name: string;
    phone?: string | null;
    dietary_preferences?: string | null;
    allergies?: string | null;
    // photo_url?: string | null;
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
  
  export interface UpdateProfileResponse {
    user: User;
  }

  /**
 * Full ChefProfile model
 * Mirrors backend ChefProfile resource.
 */
  export interface ChefProfile {
    id: number
    user_id: number
  
    bio: string | null
    slug?: string | null,
    tagline?: string | null,
    specialties: string[] | null
    credit_balance: string // decimal comes back as string
  
    hourly_rate: string // decimal comes back as string
    max_orders_per_cycle: number
  
    delivery_day: string
    cutoff_day: string
    cutoff_time: string
  
    is_paused: boolean
    status: 'pending' | 'approved' | 'suspended'
  
    rating_average: string
    rating_count: number
  
    created_at: string
    updated_at: string
  }

  // Should  we add PublicChefProfile here?
  
  /**
   * Payload for updating a chef profile.
   * We allow partial updates (PATCH semantics).
   */
  export type UpdateChefProfilePayload = Partial<
    Pick<
    ChefProfile,
    | 'bio'
    | 'slug'
    | 'tagline'
    | 'specialties'
    | 'hourly_rate'
    | 'max_orders_per_cycle'
    | 'delivery_day'
    | 'cutoff_day'
    | 'cutoff_time'
    | 'is_paused'
    >
  >
  
  /**
   * Standard response wrapper if backend returns:
   * {
   *   chefProfile: { ... }
   * }
   */
  export interface UpdateChefProfileResponse {
    chefProfile: ChefProfile
  }

  export type ProfileFormValues = {
    first_name: string
    last_name: string
    phone?: string | null
    dietary_preferences?: string | null
    allergies?: string | null
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    lat?: number
    lng?: number
  }