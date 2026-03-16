import { Profile } from "./profile";

export interface User {
  id: string;
  role: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: Date;
  profile?: Profile
  
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





