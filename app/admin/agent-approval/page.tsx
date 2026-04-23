'use client'

import { useEffect, useState, useMemo } from "react"
import { approveRoleRequest, getRoleRequests } from "@/services/roleRequestService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { RoleRequest } from "@/types/roleRequest"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function RoleRequestTable() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ FIXED: separate action-based loading state
  const [processing, setProcessing] = useState<{
    id: string | null
    action: "APPROVE" | "REJECT" | null
  }>({
    id: null,
    action: null,
  })

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 7
  const router = useRouter()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const data = await getRoleRequests()
      setRequests(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  /* ================= FILTER + SEARCH ================= */
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const name = req.user.profile?.fullName?.toLowerCase() || ""
      const matchesSearch = name.includes(search.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || req.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  /* ================= STATUS UPDATE ================= */
  const updateStatus = (id: string, status: "APPROVED" | "REJECTED") => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status } : req
      )
    )
  }

  /* ================= APPROVE ================= */
  const handleApprove = async (id: string) => {
    setProcessing({ id, action: "APPROVE" })

    try {
      await approveRoleRequest(id, true)
      toast.success("Approved successfully")
      updateStatus(id, "APPROVED")
    } catch {
      toast.error("Failed to approve")
    } finally {
      setProcessing({ id: null, action: null })
    }
  }

  /* ================= REJECT ================= */
  const handleReject = async (id: string) => {
    setProcessing({ id, action: "REJECT" })

    try {
      await approveRoleRequest(id, false)
      toast.success("Rejected successfully")
      updateStatus(id, "REJECTED")
    } catch {
      toast.error("Failed to reject")
    } finally {
      setProcessing({ id: null, action: null })
    }
  }

  /* ================= STATUS UI ================= */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending" }
      case "APPROVED":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle, label: "Approved" }
      case "REJECTED":
        return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle, label: "Rejected" }
      default:
        return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: AlertCircle, label: status }
    }
  }

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Role Requests</h1>
        <p className="text-gray-500">Manage all role change requests</p>
      </div>

      {/* FILTER */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-96"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((req) => {
                const statusConfig = getStatusConfig(req.status)
                const StatusIcon = statusConfig.icon

                return (
                  <TableRow
                    key={req.id}
                    onClick={() => router.push(`/admin/agent-approval/${req.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {/* USER */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={req.user.profile?.imageUrl || "/placeholder.png"}
                            alt="user"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">
                          {req.user.profile?.fullName || "User"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{req.requestedRole}</Badge>
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      <div>{req.user.email}</div>
                      <div className="text-gray-400">{req.user.phone}</div>
                    </TableCell>

                    <TableCell className="text-sm text-gray-500">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}
                    </TableCell>

                    <TableCell>
                      <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right">
                      {req.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">

                          {/* APPROVE */}
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApprove(req.id)
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={
                              processing.id === req.id &&
                              processing.action === "APPROVE"
                            }
                          >
                            {processing.id === req.id &&
                            processing.action === "APPROVE" ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              "Approve"
                            )}
                          </Button>

                          {/* REJECT */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReject(req.id)
                            }}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50"
                            disabled={
                              processing.id === req.id &&
                              processing.action === "REJECT"
                            }
                          >
                            {processing.id === req.id &&
                            processing.action === "REJECT" ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              "Reject"
                            )}
                          </Button>

                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {req.status}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>

        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-6">
        <Pagination>
          <PaginationContent className="gap-1">

            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none" : ""}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

    </div>
  )
}