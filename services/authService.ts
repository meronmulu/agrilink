import instance from "@/axios"
import { RegisterRequest, VerifyOtpRequest } from "@/types/auth"
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



export const login = async (credentials: { email: string; password: string }) => {
  try {
    const res = await instance.post("/users/login", credentials);

    if (res.data?.token) {
      // decode token to extract role
      const decoded = JSON.parse(
        atob(res.data.token.split('.')[1])
      );

      const user = {
        id: decoded.userId,
        role: decoded.role,
      };

      return {
        token: res.data.token,
        user,
      };
    }

    return null;
  } catch (error) {
    console.log("Login error:", error);
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
