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
// export interface Profile {
//   id: string
//   fullName: string
//   email?: string
//   phone?: string
//   image?: string
// }