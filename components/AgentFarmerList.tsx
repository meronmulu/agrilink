
'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyFarmer } from "@/services/authService"
import { User } from "@/types/auth"
import { useLanguage } from "@/context/LanguageContext"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination, PaginationContent,
  PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select, SelectContent,
  SelectItem, SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Loader2,
  Search,
  Plus,
  Users,
  CheckCircle,
  Clock3
} from "lucide-react"

import Image from "next/image"

export default function FarmerManagementPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  const usersPerPage = 7

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getMyFarmer()
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users
    .slice()
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })
    .filter((user) => {
      const matchesSearch =
        user.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.includes(search)

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter

      return matchesSearch && matchesStatus
    })

  const totalFarmers = users.length
  const activeFarmers = users.filter(u => u.status === "ACTIVE").length
  const pendingFarmers = users.filter(u => u.status === "PENDING").length

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Farmer Management
          </h1>
          <p className="text-gray-500">
            Manage all registered farmers and statuses
          </p>
        </div>

        <Button
          onClick={() => router.push('/agent/register-farmer')}
          className="bg-emerald-500 hover:bg-emerald-600 h-10"
        >
          <Plus className="mr-2 h-6 w-4" />
          Register Farmer
        </Button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="shadow-sm rounded-xl ">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Farmers</p>
              <h2 className="text-3xl font-bold">{totalFarmers}</h2>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <Users className="text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-xl ">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Active Farmers</p>
              <h2 className="text-3xl font-bold">{activeFarmers}</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-xl ">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending Farmers</p>
              <h2 className="text-3xl font-bold">{pendingFarmers}</h2>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock3 className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={
                t('search_users') || 'Search farmers...'
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                All Status
              </SelectItem>
              <SelectItem value="ACTIVE">
                Active
              </SelectItem>
              <SelectItem value="PENDING">
                Pending
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>


      {/* TABLE */}
      <Card className="shadow-sm rounded-xl ">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                    No farmers found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={user.profile?.imageUrl || "/placeholder.png"}
                            alt={user.profile?.fullName || "Farmer"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="font-medium">
                          {user.profile?.fullName || "No Name"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.profile?.kebele?.name}</TableCell>

                    <TableCell>
                      <Badge
                        className={
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        

        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

    </div>
  )
}
