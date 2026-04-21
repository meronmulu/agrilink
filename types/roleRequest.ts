import { User } from "./auth"

export interface RoleRequest {
  id: string
  userId: string
  kebeleId: string
  requestedRole: string
  currentRole: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  digitalSkills: boolean
  educationLevel: string
  experienceInAgriculture: boolean
  governmentAssigned: boolean
  verificationCredentials: string[]
  createdAt: string
  updatedAt: string
  user: User
}