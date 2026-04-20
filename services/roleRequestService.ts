import instance from "@/lib/axios/axios"

export const createRoleRequest = async (data: FormData) => {
  try {
    const res = await instance.post("/role-request", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
   console.log(res.data)
    return res.data
  } catch (error) {
    console.log("Role request error:", error)
    throw error
  }
}

export const getRoleRequests = async () => {
  try {
    const res = await instance.get("/role-request")
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log("Error fetching role requests:", error)
    throw error
  }
}

export const approveRoleRequest = async (id: string, approve: boolean) => {
  try {
    const res = await instance.patch(`/role-request/${id}`, {
      approve
    })

    return res.data
  } catch (error) {
    console.log("Role request update error:", error)
    throw error
  }
}