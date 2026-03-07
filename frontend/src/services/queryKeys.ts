export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  chefs: {
    all: ['chefs'] as const,
    list: () => [...queryKeys.chefs.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.chefs.all, 'detail', id] as const,
    browse: (filters: { neighborhood?: string }) =>
      [...queryKeys.chefs.all, 'browse', filters] as const,
  },
  chefProfile: {
    me: () => ['chef-profile', 'me'] as const,
  },
  publicChefProfile: {
    all: ['public-chef-profile'] as const,
    detail: (slug: string | undefined) =>
      [...queryKeys.publicChefProfile.all, slug] as const,
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
  neighborhoods: {
    all: ['neighborhoods'] as const,
    list: () => [...queryKeys.neighborhoods.all, 'list'] as const
  }
} as const;
