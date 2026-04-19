'use client'

import { useEffect, useState, useMemo } from 'react'
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
import { Loader2, Users } from 'lucide-react'
import Image from 'next/image'

import { Input } from '@/components/ui/input'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function AgentFarmersPage() {
  const { id } = useParams()

  const [farmers, setFarmers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // 🔍 SEARCH
  const [search, setSearch] = useState('')

  // 📄 PAGINATION
  const [page, setPage] = useState(1)
  const pageSize = 7

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await getAgentFarmers(id as string)
        setFarmers(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchFarmers()
  }, [id])

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return farmers.filter(f => {
      const name = f.profile?.fullName?.toLowerCase() || ''
      return name.includes(search.toLowerCase())
    })
  }, [farmers, search])

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / pageSize)

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={34} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Farmers under Agent
        </h1>
        <p className="text-sm text-muted-foreground">
          All farmers assigned to this agent
        </p>
      </div>

      {/* 🔍 SEARCH BAR */}
      <Card className="p-4">
        <Input
          placeholder="Search farmer by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="md:w-72"
        />
      </Card>

      {/* TABLE */}
      <Card >
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

              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="w-6 h-6" />
                      No farmers found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (

                paginated.map(farmer => (
                  <TableRow key={farmer.id} className="hover:bg-muted/30 transition">

                    {/* FARMER */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={farmer?.profile?.imageUrl || "/placeholder.png"}
                            alt="Farmer"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <span className="font-semibold">
                          {farmer?.profile?.fullName || "Unknown Farmer"}
                        </span>
                      </div>
                    </TableCell>

                    {/* CONTACT */}
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{farmer.phone}</span>
                        <span className="text-muted-foreground">
                          {farmer.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* LOCATION */}
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {farmer.profile?.kebele?.woreda?.zone?.region?.name && (
                          <Badge variant="secondary">
                            {farmer.profile.kebele.woreda.zone.region.name}
                          </Badge>
                        )}
                        {farmer.profile?.kebele?.woreda?.zone?.name && (
                          <Badge variant="secondary">
                            {farmer.profile.kebele.woreda.zone.name}
                          </Badge>
                        )}
                        {farmer.profile?.kebele?.woreda?.name && (
                          <Badge variant="secondary">
                            {farmer.profile.kebele.woreda.name}
                          </Badge>
                        )}
                        {farmer.profile?.kebele?.name && (
                          <Badge>{farmer.profile.kebele.name}</Badge>
                        )}
                      </div>
                    </TableCell>

                  </TableRow>
                ))
              )}

            </TableBody>

          </Table>
        </div>
      </Card>

    
<div className="flex items-center justify-center mt-6">
  <Pagination>
    <PaginationContent>

      <PaginationItem>
        <PaginationPrevious
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className={page === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>

      {Array.from({ length: totalPages || 1 }).map((_, i) => (
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
          onClick={() => setPage(p => Math.min(p + 1, totalPages || 1))}
          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>

    </PaginationContent>
  </Pagination>
</div>

    </div>
  )
}