'use client'

import { useEffect, useState } from "react"
import {
  getUsers,
  deleteUser,
  updateUserPassword
} from "@/services/authService"

import { User } from "@/types/auth"

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
  Loader2, Pencil, Trash2, MoreHorizontal, Search
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

export default function AdminUsersPage() {

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  // DELETE
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // EDIT PASSWORD
  const [editOpen, setEditOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // DELETE
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteUser(deleteId)
      toast.success("User deleted successfully")
      await loadUsers()
      setOpen(false)
    } catch {
      toast.error("Failed to delete user")
    }
  }

  // UPDATE PASSWORD
  const handleUpdatePassword = async () => {
    if (!selectedUserId) return

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      await updateUserPassword(selectedUserId, {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword
      })

      toast.success("Password updated successfully")

      setEditOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.log(error)
     toast.error("Failed to update password")

}
  }

  // ✅ FILTER + SORT (NEWEST FIRST)
  const filteredUsers = users
    .slice()
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
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
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage users, roles, and account status
        </p>
        </div>
        

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">

          {/* SEARCH */}
          <div className="relative">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 w-72"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 " />
          </div>

          {/* ROLE FILTER */}
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="AGENT">Agent</SelectItem>
              <SelectItem value="BUYER">Buyer</SelectItem>
              <SelectItem value="FARMER">Farmer</SelectItem>
            </SelectContent>
          </Select>

          {/* STATUS FILTER */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* TABLE */}
      <Card className="shadow-sm border rounded-2xl">
        <CardContent className="p-4">
          <div className="overflow-x-auto">

            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">

                      <TableCell className="pl-6">
                        {user.profile?.fullName || "No Name"}
                      </TableCell>

                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>

                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>

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

                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(user.id)
                                setEditOpen(true)
                              }}
                            >
                              <Pencil size={14} className="mr-2" />
                              Edit Password
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setDeleteId(user.id)
                                setOpen(true)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
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
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length}
        </p>

        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} />
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
              <PaginationNext onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

      {/* DELETE DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user?
          </DialogDescription>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT PASSWORD DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogTitle>Update Password</DialogTitle>

          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className='bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white '
             onClick={handleUpdatePassword}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}