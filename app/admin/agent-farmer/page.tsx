'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAgents, getAgentFarmers } from '@/services/authService'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { User } from '@/types/auth'
import { Loader2, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export default function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [farmersCount, setFarmersCount] = useState<Record<string, number>>({})

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsData = await getAgents()
        setAgents(agentsData)

        // fetch farmer count for each agent
        const counts: Record<string, number> = {}

        await Promise.all(
          agentsData.map(async (agent: User) => {
            try {
              const farmers = await getAgentFarmers(agent.id)
              counts[agent.id] = farmers.length
            } catch {
              counts[agent.id] = 0
            }
          })
        )

        setFarmersCount(counts)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={34} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Manage all registered agents and their farmers
          </p>
        </div>
      </div>

      <Card className="border shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>

                {/* ✅ NEW COLUMN */}
                <TableHead>Farmers</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {agents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="w-6 h-6" />
                      No agents found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                agents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/30 transition">

                    {/* Agent */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={agent.profile?.imageUrl || ''} />
                          <AvatarFallback>
                            {agent.profile?.fullName?.slice(0, 2).toUpperCase() || 'AG'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">
                            {agent.profile?.fullName || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{agent.phone}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>
                      {agent.profile?.kebele?.name}
                    </TableCell>

                    {/* ✅ FARMER COUNT */}
                    <TableCell>
                      <span className="font-medium text-emerald-600">
                        {farmersCount[agent.id] ?? 0}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        onClick={() =>
                          router.push(`/admin/agent-farmer/${agent.id}/farmer`)
                        }
                      >
                        View Farmers
                      </Button>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}