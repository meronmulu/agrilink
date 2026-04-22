'use client'

import { useEffect, useState } from "react"
import { approveRoleRequest, getRoleRequests } from "@/services/roleRequestService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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



export default function RoleRequestTable() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    fetchRequests()
  }, [])

  /* ================= FETCH ================= */
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

  /* ================= SAFE STATUS UPDATE ================= */
  const updateStatus = (id: string, status: "APPROVED" | "REJECTED") => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status }
          : req
      )
    )
  }

  /* ================= APPROVE ================= */
  const handleApprove = async (id: string) => {
    setProcessingId(id)

    try {
      await approveRoleRequest(id, true)

      toast.success("Approved successfully")

      updateStatus(id, "APPROVED") 

    } catch (error) {
      toast.error("Failed to approve")
      console.log(error)
    } finally {
      setProcessingId(null)
    }
  }

  /* ================= REJECT ================= */
  const handleReject = async (id: string) => {
    setProcessingId(id)

    try {
      await approveRoleRequest(id, false)

      toast.success("Rejected successfully")

      updateStatus(id, "REJECTED") 

    } catch (error) {
      toast.error("Failed to reject")
      console.log(error)
    } finally {
      setProcessingId(null)
    }
  }

  /* ================= STATUS UI ================= */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          label: "Pending",
        }
      case "APPROVED":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          label: "Approved",
        }
      case "REJECTED":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: XCircle,
          label: "Rejected",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
          label: status,
        }
    }
  }

  /* ================= LOADING ================= */
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
        <h1 className="text-2xl font-bold">Price Management </h1>
         
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>

          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {requests.map((req) => {
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

                  {/* ROLE */}
                  <TableCell>
                    <Badge variant="secondary">
                      {req.requestedRole}
                    </Badge>
                  </TableCell>

                  {/* CONTACT */}
                  <TableCell className="text-sm text-gray-600">
                    <div>{req.user.email}</div>
                    <div className="text-gray-400">{req.user.phone}</div>
                  </TableCell>

                  {/* DATE */}
                  <TableCell className="text-sm text-gray-500">
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  {/* STATUS */}
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
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(req.id)
                          }}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>

                        {/* REJECT */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReject(req.id)
                          }}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
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
            })}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}