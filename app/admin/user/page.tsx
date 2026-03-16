'use client'

import { useEffect, useState } from "react"
import { getUsers, deleteUser } from "@/services/authService"
import { User } from "@/types/auth"

import { Card, CardContent } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

import { Loader2, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminUsersPage() {

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

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
      await loadUsers()
      setOpen(false)
      setDeleteId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.includes(search)
  )
  .sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

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

    <div className="p-1 md:p-6 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">
            User Management
          </h1>

          <p className="text-sm text-gray-500">
            Manage farmers, buyers and agents
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative w-72">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

        </div>

      </div>

      {/* TABLE */}

      <Card className="shadow-sm border p-5">

        <CardContent className="p-0">

          <div className="border rounded-lg overflow-hidden">

            <Table>

              <TableHeader>

                <TableRow className="bg-gray-50">

                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {paginatedUsers.map((user) => (

                  <TableRow key={user.id} className="hover:bg-gray-50">

                    <TableCell className="font-medium">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                          {user.profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <span>
                          {user.profile?.fullName || "No Name"}
                        </span>

                      </div>

                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>{user.phone}</TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>

                      {user.status === "ACTIVE" && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          ACTIVE
                        </Badge>
                      )}

                      {user.status === "PENDING" && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          PENDING
                        </Badge>
                      )}

                      {user.status === "INACTIVE" && (
                        <Badge variant="destructive">
                          INACTIVE
                        </Badge>
                      )}

                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">

                      <div className="flex justify-end">

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal size={16} />
                            </Button>

                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Pencil size={16} />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600 cursor-pointer"
                              onClick={() => {
                                setDeleteId(user.id)
                                setOpen(true)
                              }}
                            >
                              <Trash2 size={16} />
                              Delete
                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </div>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

      {/* PAGINATION */}

      <Pagination>

        <PaginationContent>

          <PaginationItem>

            <PaginationPrevious
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />

          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {

            const page = index + 1

            return (

              <PaginationItem key={page}>

                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>

              </PaginationItem>

            )

          })}

          <PaginationItem>

            <PaginationNext
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />

          </PaginationItem>

        </PaginationContent>

      </Pagination>

      {/* DELETE DIALOG */}

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>
              Delete User
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this user?
              This action cannot be undone.
            </DialogDescription>

          </DialogHeader>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  )
}