export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  chefs: {
    all: ['chefs'] as const,
    list: () => [...queryKeys.chefs.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.chefs.all, 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: () => [...queryKeys.customers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: () => [...queryKeys.orders.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: () => [...queryKeys.reviews.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.reviews.all, 'detail', id] as const,
  },
} as const;
