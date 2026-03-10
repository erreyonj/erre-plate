import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  cancelOrder,
  fetchChefOrders,
  updateChefOrderStatus,
} from '../services/queries/orderQueries'
import { queryKeys } from '../services/queryKeys'
import type { CreateOrderPayload, OrderStatus } from '../types/order'

// ---------------------------------------------------------------
// Customer hooks
// ---------------------------------------------------------------

export function useOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: fetchOrders,
  })
}

export function useOrderQuery(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(String(id)),
    queryFn: () => fetchOrder(id as number | string),
    enabled: !!id,
  })
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() })
    },
  })
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      cancelOrder(id, reason),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(String(id)),
      })
    },
  })
}

// ---------------------------------------------------------------
// Chef hooks
// ---------------------------------------------------------------

const CHEF_ORDERS_KEY = ['chef-orders'] as const

export function useChefOrdersQuery() {
  return useQuery({
    queryKey: CHEF_ORDERS_KEY,
    queryFn: fetchChefOrders,
  })
}

export function useChefUpdateOrderStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      note,
    }: {
      orderId: number | string
      status: OrderStatus
      note?: string
    }) => updateChefOrderStatus({ orderId, status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_ORDERS_KEY })
    },
  })
}
