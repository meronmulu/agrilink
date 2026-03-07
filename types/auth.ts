export interface User {
  id: string;
  role: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

// Data sent to the backend
export interface RegisterRequest {
  email: string;
  phone: string;
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





export interface Region {
  id: string
  name: string
}

export interface Zone {
  id: string
  name: string
  regionId: string
}

export interface Woreda {
  id: string
  name: string
  zoneId: string
}

export interface Kebele {
  id: string
  name: string
  woredaId: string
}