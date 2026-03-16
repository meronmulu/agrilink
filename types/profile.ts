export interface Region {
  id: string
  name: string
}

export interface Zone {
  id: string
  name: string
  region: Region
}

export interface Woreda {
  id: string
  name: string
  zone: Zone
}

export interface Kebele {
  id: string
  name: string
  woreda: Woreda
}
export interface Profile {
  id: string
  fullName: string
  email?: string
  phone?: string
  imageUrl?: string
  kebele?:Kebele
}