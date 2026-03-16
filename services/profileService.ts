import instance from "@/axios"
import { Kebele, Region, Woreda, Zone } from "@/types/profile"


export const addRegion = async (data: Region) => {
  try {
    console.log("Sending region:", data)

    const res = await instance.post("/regions", data)

    console.log("Response:", res.data)
    return res.data

  } catch (error) {
    console.log(error)
  }
}

export const addZone = async (data: { name: string; regionId: string }) => {
  try {
    console.log("Sending zone:", data)

    const res = await instance.post("/zones", data)

    console.log("Response:", res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getRegions = async (): Promise<Region[]> => {
  try {
    const res = await instance.get("/regions")
    console.log("Regions API response:", res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching regions:", error)
    return []
  }
}

export const deleteRegion = async (id: string) => {
  try {
    const res = await instance.delete(`/regions/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error  
  }
}


export const getZones = async (regionId: string): Promise<Zone[]> => {
  try {
    const res = await instance.get(`/zones/by-region/${regionId}`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}


export const getWoredas = async (zoneId: string): Promise<Woreda[]> => {
  try {
    const res = await instance.get(`/woredas/by-zone/${zoneId}`)
    return res.data
  } catch (error) {
     console.log(error)
    return []
  }
}


export const getKebeles = async (woredaId: string): Promise<Kebele[]> => {
  try {
    const res = await instance.get(`/kebeles/by-woreda/${woredaId}`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}



export const createProfile = async (data: {
  fullName: string
  kebeleId: string
  image?: File
}) => {
  try {
    const token = localStorage.getItem("token") // get the token stored after OTP verification
    if (!token) throw new Error("User is not authenticated")

    const formData = new FormData()
    formData.append("fullName", data.fullName)
    formData.append("kebeleId", data.kebeleId)

    if (data.image) {
      formData.append("image", data.image)
    }

    const res = await instance.post("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // <-- add token here
      },
    })

    return res.data
   } catch (error) {
    console.log("Create profile error:", error)
    throw error
  }
}

export const updateProfile = async (data: FormData) => {
  try {

    for (const pair of data.entries()) {
      console.log(pair[0], pair[1])
    }

    const res = await instance.patch("/profile", data)

    return res.data

  } catch (error) {
    console.log(error)
    throw error
  }
}
  


