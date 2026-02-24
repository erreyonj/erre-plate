export type UserRole = 'customer' | 'chef' | 'admin';

export interface User {
  id: number | string;
  first_name: string;
  last_name: string;
  name?: string; // Laravel accessor, may be present
  email: string;
  role: UserRole;
  phone?: string | null;
  address?: Record<string, unknown> | null;
  credit_balance?: number;
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