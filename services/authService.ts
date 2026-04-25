import instance from "@/lib/axios/axios"
import { ForgotPasswordRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, User, VerifyOtpRequest } from "@/types/auth"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { toast } from "sonner"


export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const res = await instance.post<User>("/auth/signup", userData)
    console.log(res)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const login = async (credentials: {
  email?: string
  phone?: string
  password: string
}): Promise<LoginResponse> => {
  try {
    console.log('Sending login request:', credentials)

    const cleanCredentials = credentials.email
      ? {
          email: credentials.email,
          password: credentials.password
        }
      : {
          phone: credentials.phone,
          password: credentials.password
        }

    const res = await instance.post('/auth/signin', cleanCredentials)

    if (res.data?.token && res.data?.user) {
      const user = {
        id: res.data.user.id,
        role: res.data.user.role,
        email: res.data.user.email,
        phone: res.data.user.phone,
        status: res.data.user.status || res.data.status
      }

      return {
        token: res.data.token,
        user
      }
    }

    throw new Error('Invalid credentials')
  } catch (error) {
    console.log('LOGIN ERROR RESPONSE:', error)
    toast.error(
        'Login failed. Please check your credentials and try again.'
    )
    

      throw error
  }
}
export const verifyOtp = async (data: VerifyOtpRequest) => {
  try {
    const res = await instance.post("/auth/verify-otp", data)
    // console.log("OTP Response:", res.data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const resendOtp = async (identifier: string, purpose: string) => {
  try {
    const res = await instance.post("/auth/resend-otp", { identifier, purpose })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  try {
    console.log("Forgot Password Request:", data)
    const res = await instance.post("/auth/forgot-password", data)
    // console.log("Forgot Password Response:", res.data) 
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  try {
    console.log("Reset Password Request:", data)
    const res = await instance.post("/auth/reset-password", data)
    // console.log("Reset Password Response:", res.data) 
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const googleSignin = async () => {
  try {
    // Open Google login popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();
    console.log("🔐 Firebase Token:", idToken);

    //  Send token in body ONLY (backend expects this)
    const res = await instance.post("/auth/google-signin", { idToken });

    // Store token locally for future requests if needed
    localStorage.setItem("token", idToken);

    return res.data;
  } catch (error) {
    console.error("Google Signin Error:", error);
    throw error;
  }
};
export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await instance.get("/user")

    console.log("FULL RESPONSE:", res)
  console.log("DATA ONLY:", res.data)

    return res.data
  } catch (error) {
    console.error("Get users error:", error)
    return []
  }
}
export const deleteUser = async (id: string) => {
  try {
    const res = await instance.delete(`/user/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const getUserById = async (id: string) => {
  try {
    const res = await instance.get(`/user/${id}`)
    // console.log(res.data)
    return res.data
    
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const registerFarmer = async (userData: RegisterRequest): Promise<User> => {
  try {
    const res = await instance.post<User>("/auth/create-farmer", userData)
    console.log(res)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const getMyFarmer= async (): Promise<User[]> => {
  try {
    const res = await instance.get("/user/My-Farmers")
    console.log(res.data)
    return res.data
    
  } catch (error) {
    console.error("Get users error:", error)
    return []
  }
}
export const getAgents = async (): Promise<User[]> => {
  try {
    const users = await getUsers()
    console.log(users)
    return users.filter((user) => user.role === "AGENT")
  } catch (error) {
    console.error("Get agents error:", error)
    return []
  }
}
export const getAgentFarmers = async (
  agentId: number | string
): Promise<User[]> => {
  try {
    const res = await instance.get(`/user/Agent-Farmers/${agentId}`)
    console.log("Agent Farmers:", res.data)

    return res.data
  } catch (error) {
    console.error("Get agent farmers error:", error)
    return []
  }
}
