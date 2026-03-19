import type { User } from "./user";
import type { PublicWeeklyMenu, WeeklyMenuSummary } from "./menu";

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  phone?: string | null;
  dietary_preferences?: string | null;
  allergies?: string | null;
  role?: "customer" | "chef" | null;
  // photo_url?: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
}

export interface UpdateProfileResponse {
  user: User;
}

/**
 * Full ChefProfile model
 * Mirrors backend ChefProfile resource.
 */
export interface ChefProfile {
  id: number;
  user_id: number;

  first_name: string
  last_name: string
  bio: string | null;
  slug?: string | null;
  tagline?: string | null;
  specialties: string[] | null;
  credit_balance: string; // decimal comes back as string

  hourly_rate: string; // decimal comes back as string
  max_orders_per_cycle: number;

  delivery_day: string;
  cutoff_day: string;
  cutoff_time: string;
  is_available: boolean
  is_paused: boolean;
  status: "pending" | "approved" | "suspended";

  rating_average: string;
  rating_count: number;

  created_at: string;
  updated_at: string;
  photo_url: string;
}

export interface PublicChefProfile extends Omit<ChefProfile, 
  'user_id' | 
  'credit_balance' | 
  'max_orders_per_cycle' | 
  'is_paused' | 
  'created_at' | 
  'updated_at'
> {}

export interface ChefPublicHeroProps {
  chef: PublicChefProfile;
}

export interface PublicChefPageResponse {
  chef: PublicChefProfile
  featured_menu: PublicWeeklyMenu | null
  weekly_menus: WeeklyMenuSummary[]
}

/**
 * Payload for updating a chef profile.
 * We allow partial updates (PATCH semantics).
 */
export type UpdateChefProfilePayload = Partial<
  Pick<
    ChefProfile,
    | "bio"
    | "slug"
    | "tagline"
    | "specialties"
    | "hourly_rate"
    | "max_orders_per_cycle"
    | "delivery_day"
    | "cutoff_day"
    | "cutoff_time"
    | "is_paused"
  >
>;

/**
 * Standard response wrapper if backend returns:
 * {
 *   chefProfile: { ... }
 * }
 */
export interface UpdateChefProfileResponse {
  chefProfile: ChefProfile;
}

export type ProfileFormValues = {
  first_name: string;
  last_name: string;
  phone?: string | null;
  dietary_preferences?: string | null;
  allergies?: string | null;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

export type PaginatedResponse<T> = {
  data: T
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}