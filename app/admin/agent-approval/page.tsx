'use client'

import { useEffect, useState } from "react"
import { approveRoleRequest, getRoleRequests } from "@/services/roleRequestService"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  BadgeCheck,
  AlertCircle,
  Filter,
  Loader2,
  LayoutGrid,
  List
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // Added Table imports
import { toast } from "sonner"
import Image from "next/image"

interface RoleRequest {
  id: string
  requestedRole: string
  status: string
  createdAt?: string
  user: {
    email: string
    phone: string
    profile?: {
      fullName?: string
      image?: string
    }
  }
}

export default function RoleRequestCards() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("ALL")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [view, setView] = useState<"grid" | "list">("grid") // New state for view toggle

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const data = await getRoleRequests()
      setRequests(data)
    } catch (error) {
      console.error("Failed to fetch role requests", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await approveRoleRequest(id, true)
      if (res) {
        toast.success("Role request approved successfully", { position: "top-center" })
      }
      setRequests((prev) =>
        prev.map((req) => req.id === id ? { ...req, status: "APPROVED" } : req)
      )
    } catch (error) {
      toast.error("Failed to approve role request", { position: "top-center" ,})
      console.log(error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await approveRoleRequest(id, false)
      if (res) {
        toast.success("Role request Rejected successfully", { position: "top-center" })
      }
      setRequests((prev) =>
        prev.map((req) => req.id === id ? { ...req, status: "REJECTED" } : req)
      )
    } catch (error) {
      console.log(error)
      toast.error("Failed to Rejected role request", { position: "top-center" })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending Review" }
      case "APPROVED":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle, label: "Approved" }
      case "REJECTED":
        return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle, label: "Rejected" }
      default:
        return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: AlertCircle, label: status }
    }
  }

 
  const filteredRequests = filter === "ALL"
    ? requests
    : requests.filter(req => req.status === filter)

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Role Requests
            </h1>
            <p className="text-gray-600 mt-1">Manage and review role change requests from users</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="px-3 bg-white shadow-sm border-gray-200"
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                title={view === "grid" ? "Switch to List View" : "Switch to Grid View"}
              >
                {view === "grid" ? (
                  <LayoutGrid className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </Button>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Filter className="w-4 h-4" />
                  {filter === "ALL" ? "All Requests" : `${filter} Requests`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilter("ALL")}>
                  <span className="flex-1">All Requests</span>
                  {filter === "ALL" && <BadgeCheck className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("PENDING")}>
                  <span className="flex-1">Pending</span>
                  {filter === "PENDING" && <BadgeCheck className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("APPROVED")}>
                  <span className="flex-1">Approved</span>
                  {filter === "APPROVED" && <BadgeCheck className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("REJECTED")}>
                  <span className="flex-1">Rejected</span>
                  {filter === "REJECTED" && <BadgeCheck className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards (Kept as requested) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="text-2xl font-bold text-amber-900">{requests.filter(r => r.status === "PENDING").length}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
            <p className="text-sm text-emerald-700">Approved</p>
            <p className="text-2xl font-bold text-emerald-900">{requests.filter(r => r.status === "APPROVED").length}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-4 shadow-sm border border-rose-100">
            <p className="text-sm text-rose-700">Rejected</p>
            <p className="text-2xl font-bold text-rose-900">{requests.filter(r => r.status === "REJECTED").length}</p>
          </div>
        </div>

        {/* Dynamic Content: Grid or List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((req) => {
              const StatusIcon = getStatusConfig(req.status).icon
              const statusColor = getStatusConfig(req.status).color
              return (
                <Card key={req.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`${statusColor} border flex items-center gap-1.5 px-3 py-1`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {getStatusConfig(req.status).label}
                      </Badge>
                      {req.createdAt && <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={req.user.profile?.image || "/placeholder.png"}
                          alt="Farmer"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{req.user.profile?.fullName || "User"}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-sm text-gray-600 truncate">Requesting: <span className="font-medium text-primary">{req.requestedRole}</span></p>
                        </div>
                      </div>
                    </div>
                    <Separator className="bg-gray-100" />
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{req.user.email}</span></div>
                      <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /><span>{req.user.phone}</span></div>
                    </div>
                    {req.status === "PENDING" ? (
                      <div className="flex gap-3 pt-2">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(req.id)} disabled={processingId === req.id}>
                          {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                        </Button>
                        <Button variant="outline" className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleReject(req.id)} disabled={processingId === req.id}>
                          {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <Button variant="ghost" className="w-full text-gray-500 cursor-default" disabled>
                          {req.status === "APPROVED" ? "Request Approved" : "Request Rejected"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          /* List View (Table) */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>User</TableHead>
                  <TableHead>Requested Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => {
                  const StatusIcon = getStatusConfig(req.status).icon
                  const statusColor = getStatusConfig(req.status).color
                  return (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={req.user.profile?.image || "/placeholder.png"}
                              alt="Farmer"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900">{req.user.profile?.fullName || "User"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{req.requestedRole}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-600">
                          <div>{req.user.email}</div>
                          <div className="text-gray-400">{req.user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColor} flex w-fit items-center gap-1 px-2 py-0.5 text-[11px]`}>
                          <StatusIcon className="w-3 h-3" />
                          {getStatusConfig(req.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(req.id)} disabled={processingId === req.id}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 border-rose-200 text-rose-600" onClick={() => handleReject(req.id)} disabled={processingId === req.id}>
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">{req.status}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}