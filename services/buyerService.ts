import instance from "@/axios"

export interface BuyerMetrics {
  totalOrders: number
  activeNegotiations: number
  savedFarms: number
  walletBalance: string
}

export interface NegotiationItem {
  id: string
  product: string
  farmer: string
  image: string
  quantity: string
  currentPrice?: string
  originalPrice?: string
  myOffer?: string
  status: string
  statusColor: string
  actions: string[]
}

export interface RecentActivity {
  id: string
  type: 'order' | 'negotiation' | 'review'
  title: string
  description: string
  time: string
}

export interface FavoriteFarmer {
  id: string
  name: string
  location: string
  rating: number
  productsCount: number
  imageUrl?: string
}

// Get buyer dashboard metrics
export const getBuyerMetrics = async (): Promise<BuyerMetrics> => {
  try {
    const res = await instance.get("/buyer/metrics")
    return res.data
  } catch (error) {
    console.error("Get buyer metrics error:", error)
    // Return mock data as fallback
    return {
      totalOrders: 12,
      activeNegotiations: 5,
      savedFarms: 8,
      walletBalance: '45,200'
    }
  }
}

// Get active negotiations
export const getActiveNegotiations = async (): Promise<NegotiationItem[]> => {
  try {
    const res = await instance.get("/buyer/negotiations")
    return res.data
  } catch (error) {
    console.error("Get negotiations error:", error)
    // Return mock data as fallback
    return [
      {
        id: '1',
        product: 'Premium Teff (High Grade)',
        farmer: 'Abebe Kebede',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=2070',
        quantity: '200 kg',
        currentPrice: '165 ETB/kg',
        originalPrice: '180 ETB/kg',
        status: 'Counter Offer Received',
        statusColor: 'bg-amber-100 text-amber-700',
        actions: ['Review Offer', 'Message']
      },
      {
        id: '2',
        product: 'Organic Avocados',
        farmer: "Sara's Organic Farm",
        image: 'https://images.unsplash.com/photo-1519448896000-844d18fa0fd4?auto=format&fit=crop&q=80&w=2074&ixlib=rb-4.0.3',
        quantity: '500 kg',
        myOffer: '85 ETB/kg',
        status: 'Awaiting Farmer Response',
        statusColor: 'bg-blue-100 text-blue-700',
        actions: ['Withdraw Offer']
      }
    ]
  }
}

// Get recent activities
export const getBuyerActivities = async (): Promise<RecentActivity[]> => {
  try {
    const res = await instance.get("/buyer/activities")
    return res.data
  } catch (error) {
    console.error("Get buyer activities error:", error)
    // Return mock data as fallback
    return [
      {
        id: '1',
        type: 'order',
        title: 'Order #4592 Shipped',
        description: 'Your order of 100kg Red Onions from Gojjam Co-op has been dispatched.',
        time: '2h ago'
      },
      {
        id: '2',
        type: 'negotiation',
        title: 'New Message from Farmer Abebe',
        description: '"I can offer 165 ETB for bulk if you can pick it up..."',
        time: '5h ago'
      },
      {
        id: '3',
        type: 'order',
        title: 'Payment Successful',
        description: 'Payment of ETB 12,500 released to Alemitu Coffee for Order #4580.',
        time: 'Yesterday'
      }
    ]
  }
}

// Get favorite farmers
export const getFavoriteFarmers = async (): Promise<FavoriteFarmer[]> => {
  try {
    const res = await instance.get("/buyer/favorites")
    return res.data
  } catch (error) {
    console.error("Get favorite farmers error:", error)
    // Return mock data as fallback
    return [
      {
        id: '1',
        name: 'Abebe Kebede',
        location: 'Oromia, Ada\'a',
        rating: 4.8,
        productsCount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2070'
      },
      {
        id: '2',
        name: 'Fatuma Hassan',
        location: 'Somali, Jijiga',
        rating: 4.6,
        productsCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=2070'
      }
    ]
  }
}