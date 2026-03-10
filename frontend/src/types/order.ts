export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderMenuItem {
  id: number;
  dish_id: number | null;
  dish_name: string;
  dish_description: string | null;
  sort_order: number;
}

export interface OrderMenu {
  id: number;
  weekly_menu_id: number | null;
  menu_name: string;
  menu_description: string | null;
  price: string;
  items: OrderMenuItem[];
}

export interface OrderStatusEvent {
  id: number;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface OrderChef {
  id: number;
  slug: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
}

export interface Order {
  id: number;
  status: OrderStatus;
  subtotal: string;
  platform_fee: string;
  tax: string;
  total: string;
  currency: string;
  delivery_date: string | null;
  delivery_address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  notes: string | null;
  placed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  chef: OrderChef | null;
  order_menu: OrderMenu | null;
  status_history: OrderStatusEvent[];
}

export interface OrderSummary {
  id: number;
  status: OrderStatus;
  total: string;
  currency: string;
  placed_at: string | null;
  chef_name: string | null;
  chef_slug: string | null;
  menu_name: string | null;
}

export interface CreateOrderPayload {
  weekly_menu_id: number;
  delivery_date?: string;
  delivery_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  notes?: string;
}
