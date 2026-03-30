import instance from "@/axios"

export interface AgentStats {
  totalFarmers: number
  activeFarmers: number
  trainingSessions: number
  certificationsIssued: number
  monthlyGrowth: number
}

export interface Farmer {
  id: string
  fullName: string
  email?: string
  phone?: string
  region: string
  woreda: string
  status: 'active' | 'inactive'
  registeredDate: string
  profile?: {
    imageUrl?: string
  }
}

export interface RecentActivity {
  id: number
  action: string
  details: string
  time: string
}

// Get agent dashboard stats
export const getAgentStats = async (): Promise<AgentStats> => {
  try {
    const res = await instance.get("/agent/stats")
    return res.data
  } catch (error) {
    console.error("Get agent stats error:", error)
    // Return mock data as fallback
    return {
      totalFarmers: 142,
      activeFarmers: 128,
      trainingSessions: 24,
      certificationsIssued: 89,
      monthlyGrowth: 12
    }
  }
}

// Get farmers registered by agent
export const getAgentFarmers = async (): Promise<Farmer[]> => {
  try {
    const res = await instance.get("/agent/farmers")
    return res.data
  } catch (error) {
    console.error("Get agent farmers error:", error)
    // Return mock data as fallback
    return [
      {
        id: '1',
        fullName: 'Abebe Kebede',
        email: 'abebe@example.com',
        phone: '+251911123456',
        region: 'Oromia',
        woreda: 'Ada\'a',
        status: 'active',
        registeredDate: '2024-01-15'
      },
      {
        id: '2',
        fullName: 'Fatuma Hassan',
        email: 'fatuma@example.com',
        phone: '+251922654321',
        region: 'Somali',
        woreda: 'Jijiga',
        status: 'active',
        registeredDate: '2024-02-20'
      },
      {
        id: '3',
        fullName: 'Tsegaye Mekonnen',
        phone: '+251933789012',
        region: 'Amhara',
        woreda: 'Bahir Dar',
        status: 'inactive',
        registeredDate: '2024-01-10'
      }
    ]
  }
}

// Get recent activities for agent
export const getAgentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const res = await instance.get("/agent/activities")
    return res.data
  } catch (error) {
    console.error("Get agent activities error:", error)
    // Return mock data as fallback
    return [
      { id: 1, action: 'Registered new farmer', details: 'Abebe Kebede from Oromia Region', time: '2 hours ago' },
      { id: 2, action: 'Completed Training', details: '"Modern Irrigation Techniques" with 15 farmers', time: 'Yesterday' },
      { id: 3, action: 'Registered new farmer', details: 'Fatuma Hassan from Somali Region', time: 'Yesterday' },
      { id: 4, action: 'Issued Certification', details: 'Basic Agronomy to 10 farmers', time: '3 days ago' },
    ]
  }
}