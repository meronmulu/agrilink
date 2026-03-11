import instance from "@/axios"
import { Kebele, Region, Woreda, Zone } from "@/types/profile"


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