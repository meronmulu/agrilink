'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, ArrowUpDown, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { getAgentFarmers, Farmer } from '@/services/agentService'

export default function AgentFarmerList() {
  const { t } = useLanguage()
  const router = useRouter()

  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof Farmer>('fullName')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  const pageSize = 6

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await getAgentFarmers()
        setFarmers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchFarmers()
  }, [])

  const handleSort = (key: keyof Farmer) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const filteredData = useMemo(() => {
    return farmers
      .filter((f) =>
        `${f.fullName} ${f.email} ${f.phone} ${f.region}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = a[sortKey] ?? ''
        const bVal = b[sortKey] ?? ''

        if (aVal < bVal) return sortAsc ? -1 : 1
        if (aVal > bVal) return sortAsc ? 1 : -1
        return 0
      })
  }, [farmers, search, sortKey, sortAsc])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t('registered_farmers') || 'Registered Farmers'}
          </h1>
        </div>

        <Button
          onClick={() => router.push('/agent/register-farmer')}
          className="bg-emerald-500 hover:bg-emerald-600 py-4"
        >
          <Plus className="mr-2 h-4 w-4" py-4 />
          {t('register_new_farmer') || 'Register'}
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search farmers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('fullName')}>
                  Name <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('registeredDate')}>
                  Date <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((farmer) => (
              <TableRow key={farmer.id}>

                <TableCell className="font-medium">
                  {farmer.fullName}
                </TableCell>

                <TableCell>{farmer.email}</TableCell>
                <TableCell>{farmer.phone}</TableCell>

                <TableCell>
                  {farmer.region}, {farmer.woreda}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      farmer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {farmer.status}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(farmer.registeredDate).toLocaleDateString()}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  )
}