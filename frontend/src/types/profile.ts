import type { User } from './user';

export interface UpdateProfilePayload {
    first_name: string;
    last_name: string;
    phone?: string | null;
    dietary_preferences?: string | null;
    allergies?: string | null;
    photo_url?: string | null;
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
    cuisine_type: string | null
    experience_years: number | null
    pricing_notes: string | null
  
    created_at: string
    updated_at: string
  
    // Optional relation if backend returns it
    user?: User
  }
  
  /**
   * Payload for updating a chef profile.
   * We allow partial updates (PATCH semantics).
   */
  export type UpdateChefProfilePayload = Partial<
    Pick<
      ChefProfile,
      | 'bio'
      | 'cuisine_type'
      | 'experience_years'
      | 'pricing_notes'
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