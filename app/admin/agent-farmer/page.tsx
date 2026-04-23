'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getAgents, getAgentFarmers } from '@/services/authService'

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { User } from '@/types/auth'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [farmersCount, setFarmersCount] = useState<Record<string, number>>({})

  const router = useRouter()

  // SEARCH
  const [search, setSearch] = useState('')

  // PAGINATION
  const [page, setPage] = useState(1)
  const pageSize = 7

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAgents()
        setAgents(data || [])

        const counts: Record<string, number> = {}

        await Promise.all(
          data.map(async (agent: User) => {
            try {
              const farmers = await getAgentFarmers(agent.id)
              counts[agent.id] = farmers.length
            } catch {
              counts[agent.id] = 0
            }
          })
        )

        setFarmersCount(counts)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // FILTER
  const filtered = useMemo(() => {
    return agents.filter(a => {
      const name = (a.profile?.fullName || '').toLowerCase()
      const email = (a.email || '').toLowerCase()
      const phone = (a.phone || '')

      const q = search.toLowerCase()

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(search)
      )
    })
  }, [agents, search])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Agents Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage all agents with their assigned farmers
          </p>
        </div>

        <Button
          onClick={() => router.push(`/admin/agent-approval`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5"
        >
          All Role requests
        </Button>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search agent..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="lg:w-72"
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Farmers</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No agents found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={a.profile?.imageUrl || "/placeholder.png"}
                            alt="user"
                            fill
                            className="object-cover"
                          />
                        </div>
                        {a.profile?.fullName}                      
                        </div>
                    </TableCell>
                 

                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.phone}</TableCell>

                    <TableCell className="text-emerald-600 font-semibold">
                      {farmersCount[a.id] ?? 0}
                    </TableCell>

                    <TableCell>
                      <Button
                        className="border-emerald-600 hover:bg-emerald-700 hover:text-white text-emerald-600 bg-white"
                        onClick={() =>
                          router.push(`/admin/agent-farmer/${a.id}/farmer`)
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

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(p => Math.max(p - 1, 1))}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  )
}