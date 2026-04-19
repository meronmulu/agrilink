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
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

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

  // SEARCH + FILTERS
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('ALL')
  const [zone, setZone] = useState('ALL')
  const [woreda, setWoreda] = useState('ALL')
  const [kebele, setKebele] = useState('ALL')

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

  // LOCATION
  const getLoc = (a: User) => {
    const keb = a.profile?.kebele
    const wore = keb?.woreda
    const zon = wore?.zone
    const reg = zon?.region

    return {
      region: reg?.name || '',
      zone: zon?.name || '',
      woreda: wore?.name || '',
      kebele: keb?.name || '',
    }
  }

  // OPTIONS
  const regions = useMemo(
    () => Array.from(new Set(agents.map(a => getLoc(a).region).filter(Boolean))),
    [agents]
  )

  const zones = useMemo(
    () =>
      Array.from(
        new Set(
          agents
            .filter(a => region === 'ALL' || getLoc(a).region === region)
            .map(a => getLoc(a).zone)
            .filter(Boolean)
        )
      ),
    [agents, region]
  )

  const woredas = useMemo(
    () =>
      Array.from(
        new Set(
          agents
            .filter(
              a =>
                (region === 'ALL' || getLoc(a).region === region) &&
                (zone === 'ALL' || getLoc(a).zone === zone)
            )
            .map(a => getLoc(a).woreda)
            .filter(Boolean)
        )
      ),
    [agents, region, zone]
  )

  const kebeles = useMemo(
    () =>
      Array.from(
        new Set(
          agents
            .filter(
              a =>
                (region === 'ALL' || getLoc(a).region === region) &&
                (zone === 'ALL' || getLoc(a).zone === zone) &&
                (woreda === 'ALL' || getLoc(a).woreda === woreda)
            )
            .map(a => getLoc(a).kebele)
            .filter(Boolean)
        )
      ),
    [agents, region, zone, woreda]
  )

  // FILTER
  const filtered = agents.filter(a => {
    const loc = getLoc(a)

    const matchesSearch =
      (a.profile?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.phone || '').includes(search)

    return (
      matchesSearch &&
      (region === 'ALL' || loc.region === region) &&
      (zone === 'ALL' || loc.zone === zone) &&
      (woreda === 'ALL' || loc.woreda === woreda) &&
      (kebele === 'ALL' || loc.kebele === kebele)
    )
  })

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Agents Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all agents with their assigned farmers and locations
        </p>
      </div>
      <Card className="">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">


          {/* SEARCH */}
          <Input
            placeholder="Search agent..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="lg:w-72"
          />

          {/* FILTER GROUP */}
          <div className="flex flex-wrap gap-3">

            <Select value={region} onValueChange={(v) => {
              setRegion(v)
              setZone('ALL')
              setWoreda('ALL')
              setKebele('ALL')
              setPage(1)
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Regions</SelectItem>
                {regions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={zone} onValueChange={(v) => {
              setZone(v)
              setWoreda('ALL')
              setKebele('ALL')
              setPage(1)
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Zones</SelectItem>
                {zones.map(z => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={woreda} onValueChange={(v) => {
              setWoreda(v)
              setKebele('ALL')
              setPage(1)
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Woreda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Woredas</SelectItem>
                {woredas.map(w => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={kebele} onValueChange={(v) => {
              setKebele(v)
              setPage(1)
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Kebele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Kebeles</SelectItem>
                {kebeles.map(k => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
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
                <TableHead>Location</TableHead>
                <TableHead>Farmers</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No agents found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map(a => {
                  const loc = getLoc(a)

                  return (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={a.profile?.imageUrl || "/placeholder.png"}
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          {a.profile?.fullName}
                        </div>
                      </TableCell>

                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.phone}</TableCell>

                      <TableCell>
                        {loc.region} / {loc.zone} / {loc.woreda} / {loc.kebele}
                      </TableCell>

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
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(p => Math.max(p - 1, 1))} />
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
            <PaginationNext onClick={() => setPage(p => Math.min(p + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  )
}