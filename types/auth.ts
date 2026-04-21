import { Kebele } from "./profile";

export interface Profile {
  id: string
  userId: string
  fullName: string
  imageUrl?: string | null
  kebeleId?: string | null
  latitude?: number | null
  longitude?: number | null
  telegramChatId?: string | null
  receiveWeatherAlerts?: boolean
}

export interface User {
  id: string
  role: string
  email?: string
  phone?: string
  status?: string
  createdAt?: string   // ✅ IMPORTANT: backend returns string
  profile?: Profile
}

// Data sent to the backend
export interface RegisterRequest {
  email?: string
  phone?: string
  password: string;
  confirmPassword: string;
  role: string;
}

export interface VerifyOtpRequest {
  identifier: string
  code: string
  purpose: "SIGNUP" | "LOGIN" | "RESET"
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    role: string
    email?: string
    phone?: string
    status?: string
  }
}

export type ForgotPasswordRequest = {
  emailOrPhone: string
}

export type ResetPasswordRequest = {
  emailOrPhone: string
  password: string
  confirmPassword: string
}




export type UserRole = 'ADMIN' | 'BUYER' |  'FARMER' | 'AGENT';
export type UserStatus = 'PENDING' | 'ACTIVE' ;

export interface UserWithProfile {
  id: string;
  phone: string | null;
  email: string | null;
  firebaseUid: string | null;
  role: string;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
  profile: {
    fullName: string;
    kebeleId: string;
    kebele?: {
      id: string;
      name: string;
    };
  } | null;
}



