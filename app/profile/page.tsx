'use client'

import { useEffect, useState } from "react"
import { Region, Zone, Woreda, Kebele } from "@/types/profile"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    fullName: string
    email?: string
    phone?: string
    role: string
    region?: Region
    zone?: Zone
    woreda?: Woreda
    kebele?: Kebele
    image?: string
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile() // call your API to get the current user's profile
        setProfile(res)
      } catch (error) {
        console.log("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading profile...</p>

  if (!profile) return <p className="text-center mt-10">No profile found.</p>

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="p-6 shadow-lg rounded-2xl space-y-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{profile.fullName}</CardTitle>
          <CardDescription>
            Role: <span className="font-medium">{profile.role}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {profile.image && (
            <div className="flex justify-center">
                <img src={profile.image} alt="Profile Image" />
            </div>
          )}

          {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
          {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}

          {profile.region && <p><strong>Region:</strong> {profile.region.name}</p>}
          {profile.zone && <p><strong>Zone:</strong> {profile.zone.name}</p>}
          {profile.woreda && <p><strong>Woreda:</strong> {profile.woreda.name}</p>}
          {profile.kebele && <p><strong>Kebele:</strong> {profile.kebele.name}</p>}
        </CardContent>
      </Card>
    </div>
  )
}