'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAgentFarmers } from '@/services/authService'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/auth'
import { Loader2, MapPin, Users } from 'lucide-react'
import Image from 'next/image'

export default function AgentFarmersPage() {
    const { id } = useParams()
    const [farmers, setFarmers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const data = await getAgentFarmers(id as string)
                setFarmers(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchFarmers()
    }, [id])

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-emerald-500" size={34} />
                
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    Farmers under Agent
                </h1>
                <p className="text-sm text-muted-foreground">
                    All farmers assigned to this agent
                </p>
            </div>

            {/* Table Card */}
            <Card className="border rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {farmers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Users className="w-6 h-6" />
                                            No farmers found
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                farmers.map((farmer) => {


                                    return (
                                        <TableRow
                                            key={farmer.id}
                                            className="hover:bg-muted/30 transition"
                                        >
                                            {/* Farmer Identity */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">

                                                    {/* Avatar */}
                                                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                                        <Image
                                                            src={farmer?.profile?.imageUrl || "/placeholder.png"}
                                                            alt="Farmer"
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex flex-col leading-tight">

                                                        {/* Name */}
                                                        <span className="font-semibold text-gray-900 capitalize">
                                                            {farmer?.profile?.fullName || "Unknown Farmer"}
                                                        </span>



                                                    </div>

                                                </div>
                                            </TableCell>

                                            {/* Contact */}
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <span className="text-muted-foreground">
                                                        {farmer.phone}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {farmer.email}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Location */}
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2 items-center text-sm">
                                                    {farmer.profile?.kebele?.woreda?.zone?.region?.name && (
                                                        <Badge variant="secondary">
                                                            {farmer.profile?.kebele?.woreda?.zone?.region?.name}
                                                        </Badge>
                                                    )}
                                                    {farmer.profile?.kebele?.woreda?.zone?.name && (
                                                        <Badge variant="secondary">
                                                            {farmer.profile?.kebele?.woreda?.zone?.name}
                                                        </Badge>
                                                    )}
                                                    {farmer.profile?.kebele?.woreda?.name && (
                                                        <Badge variant="secondary">
                                                            {farmer.profile?.kebele?.woreda?.name}
                                                        </Badge>
                                                    )}
                                                    {farmer.profile?.kebele?.name && (
                                                        <Badge>
                                                            {farmer.profile?.kebele?.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}