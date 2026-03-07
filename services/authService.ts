import instance from "@/axios"
import { LoginResponse, RegisterRequest, VerifyOtpRequest } from "@/types/auth"
import { User } from "next-auth"


export const register = async (userData: RegisterRequest): Promise<User | null> => {
  try {
    const res = await instance.post<User>("/auth/signup", userData)
    
    console.log("Full Server Response:", res.data)

   
    if (res.data) {
      return res.data
    }

    return null
  } catch (error) {
    console.log(error)
    return null
  }
}






export const login = async (credentials: { email?: string; phone?: string; password: string }): Promise<LoginResponse | null> => {
  try {
    console.log("Sending login request:", credentials);

    const res = await instance.post("/auth/signin", credentials);
    // console.log("API response:", res.data);

    if (res.data?.token && res.data?.user) {
      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
      console.log("Decoded JWT:", decoded);

      // Use role from API response (safer)
      const user = {
        id: res.data.user.id,
        role: res.data.user.role , 
        email: res.data.user.email,
        phone: res.data.user.phone
      };

      // console.log("User object returned:", user);

      return {
        token: res.data.token,
        user
      };
    }

    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const verifyOtp = async (data: VerifyOtpRequest) => {
  try {
     const res = await instance.post("/auth/verify-otp", data)
     console.log("Otp:", res.data)

  return res.data
  } catch (error) {
    console.log(error)
  }
 
}
