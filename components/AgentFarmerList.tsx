'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyFarmer } from "@/services/authService"
import { User } from "@/types/auth"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import { Loader2, Search, Plus } from "lucide-react"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "./ui/button"

export default function AdminUsersPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getMyFarmer()
      setUsers(data)
    } catch (err) {
      console.error(err)
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

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

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
    <div className="p-4 space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {'Farmer Management'}
          </h1>
          <p className="text-sm text-gray-500">
            {'Manage farmers, roles, and account status'}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Input
              placeholder={t('search_users') || "Search users..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 w-72"
            />
            <Search className="absolute left-2 top-2 h-4 w-4" />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder={t('status') || "Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('all_status') || 'All Status'}</SelectItem>
              <SelectItem value="ACTIVE">{t('active') || 'Active'}</SelectItem>
              <SelectItem value="PENDING">{t('pending') || 'Pending'}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => router.push('/agent/register-farmer')}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('register_new_farmer') || 'Register'}
          </Button>
        </div>

      </div>



      {/* TABLE remains same */}

      {/* TABLE */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">{ 'Farmer'}</TableHead>
                  <TableHead>{t('email') || 'Email'}</TableHead>
                  <TableHead>{t('phone') || 'Phone'}</TableHead>
                  <TableHead>{t('status') || 'Status'}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">

                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">

                          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={user.profile?.imageUrl || "/placeholder.png"}
                              alt={user.profile?.fullName || "User"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          <span className="font-medium text-gray-900 capitalize">
                            {user.profile?.fullName || "No Name"}
                          </span>

                        </div>
                      </TableCell>

                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>

                     

                      <TableCell>
                        <Badge
                          className={
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-600"
                              : user.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-200 text-gray-600"
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

          </div>
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} -{" "}
          {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length}
        </p>

        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

    </div>
  )
}




