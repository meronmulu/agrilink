'use client'

import { useEffect, useState } from "react"
import {
  getUsers,
  deleteUser,
} from "@/services/authService"

import { User } from "@/types/auth"
import { useLanguage } from "@/context/LanguageContext"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog, DialogContent, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog"

import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"

import {
  Loader2, Trash2, MoreHorizontal, Search
} from "lucide-react"

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function AdminUsersPage() {
  const { t } = useLanguage()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 7

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      console.log(data)
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteUser(deleteId)
      toast.success(t('toast_user_deleted') || "User deleted successfully")
      await loadUsers()
      setOpen(false)
    } catch {
      toast.error(t('toast_failed_delete_user') || "Failed to delete user")
    }
  }

  // FILTER
  const filteredUsers = users
    .slice()
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })
    .filter(user => {
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

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  )

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          {t('user_management') || 'User Management'}
        </h1>
        <p className="text-sm text-gray-500">
          {t('manage_users_desc') || 'Manage users, roles, and status'}
        </p>
      </div>

      {/* FILTER CARD */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          {/* SEARCH */}
          <div className="relative">
            <Input
              placeholder={t('search_users') || "Search users..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 w-96"
            />
            <Search className="absolute left-2 top-2 h-4 w-4" />
          </div>

          <div className="flex gap-3 flex-wrap">

            {/* ROLE */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('role') || "Role"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('all_roles') || 'All Roles'}</SelectItem>
                <SelectItem value="ADMIN">{t('admin') || 'Admin'}</SelectItem>
                <SelectItem value="AGENT">{t('role_agent') || 'Agent'}</SelectItem>
                <SelectItem value="BUYER">{t('buyer') || 'Buyer'}</SelectItem>
                <SelectItem value="FARMER">{t('role_farmer_opt') || 'Farmer'}</SelectItem>
              </SelectContent>
            </Select>

            {/* STATUS */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('status') || "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('all_status') || 'All Status'}</SelectItem>
                <SelectItem value="ACTIVE">{t('active') || 'Active'}</SelectItem>
                <SelectItem value="PENDING">{t('pending') || 'Pending'}</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user') || 'User'}</TableHead>
                <TableHead>{t('email') || 'Email'}</TableHead>
                <TableHead>{t('phone') || 'Phone'}</TableHead>
                <TableHead>{t('role') || 'Role'}</TableHead>
                <TableHead>{t('status') || 'Status'}</TableHead>
                <TableHead className="text-right">{t('actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    {t('no_users_found') || 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map(user => (
                  <TableRow key={user.id}>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={user.profile?.imageUrl || "/placeholder.png"}
                            alt="user"
                            fill
                            className="object-cover"
                          />
                        </div>
                        {user.profile?.fullName || (t('no_name') || "No Name")}
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>

                    <TableCell>
                      <Badge variant={"secondary"}>{user.role}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }>
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(user.id)
                              setOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete') || 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>

          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
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
                setCurrentPage(p => Math.min(p + 1, totalPages))
              }
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>

      {/* DELETE DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{t('delete_user') || 'Delete User'}</DialogTitle>
          <DialogDescription>
            {t('delete_user_desc') || 'Are you sure you want to delete this user?'}
          </DialogDescription>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('delete') || 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}