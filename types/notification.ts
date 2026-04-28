export interface NotificationPayload {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string

  senderId?: string
  receiverId?: string
  orderId?: string
  productId?: string
}