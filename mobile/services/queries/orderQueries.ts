import { api } from '../api'
import type {
  Order,
  OrderSummary,
  CreateOrderPayload,
  OrderStatus,
} from '../../types/order'

export const fetchOrders = async (): Promise<OrderSummary[]> => {
  const res = await api.get('/orders')
  return res.data.data ?? res.data
}

export const fetchOrder = async (id: number | string): Promise<Order> => {
  const res = await api.get(`/orders/${id}`)
  return res.data.data ?? res.data
}

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const res = await api.post('/orders', payload)
  return res.data.data ?? res.data
}

export const cancelOrder = async (
  id: number | string,
  reason?: string
): Promise<Order> => {
  const res = await api.post(`/orders/${id}/cancel`, { reason })
  return res.data.data ?? res.data
}

export const fetchChefOrders = async (): Promise<OrderSummary[]> => {
  const res = await api.get('/chef/orders')
  return res.data.data ?? res.data
}

export const updateChefOrderStatus = async ({
  orderId,
  status,
  note,
}: {
  orderId: number | string
  status: OrderStatus
  note?: string
}): Promise<Order> => {
  const res = await api.patch(`/chef/orders/${orderId}/status`, { status, note })
  return res.data.data ?? res.data
}
