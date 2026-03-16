'use client'

import { useEffect, useState } from "react"
import { approveRoleRequest, getRoleRequests } from "@/services/roleRequestService"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Phone, 
  User, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  BadgeCheck,
  AlertCircle,
  Filter,
  Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RoleRequest {
  id: string
  requestedRole: string
  status: string
  createdAt?: string
  user: {
    email: string
    phone: string
    name?: string
    department?: string
  }
}

export default function RoleRequestCards() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("ALL")
  const [processingId, setProcessingId] = useState<string | null>(null)

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
      console.log("Approved:", res)
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "APPROVED" } : req
        )
      )
    } catch (error) {
      console.error("Approve failed", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await approveRoleRequest(id, false)
      console.log("Rejected:", res)
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "REJECTED" } : req
        )
      )
    } catch (error) {
      console.error("Reject failed", error)
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          label: "Pending Review"
        }
      case "APPROVED":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          label: "Approved"
        }
      case "REJECTED":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: XCircle,
          label: "Rejected"
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
          label: status
        }
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
    <div className="min-h-screen   p-4 sm:px-6 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Role Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and review role change requests from users
            </p>
          </div>

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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="text-2xl font-bold text-amber-900">
              {requests.filter(r => r.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
            <p className="text-sm text-emerald-700">Approved</p>
            <p className="text-2xl font-bold text-emerald-900">
              {requests.filter(r => r.status === "APPROVED").length}
            </p>
          </div>
          <div className="bg-rose-50 rounded-xl p-4 shadow-sm border border-rose-100">
            <p className="text-sm text-rose-700">Rejected</p>
            <p className="text-2xl font-bold text-rose-900">
              {requests.filter(r => r.status === "REJECTED").length}
            </p>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
            <p className="text-gray-600">
              {filter === "ALL" 
                ? "There are no role requests to display" 
                : `No ${filter.toLowerCase()} requests found`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((req) => {
              const StatusIcon = getStatusConfig(req.status).icon
              const statusColor = getStatusConfig(req.status).color

              return (
                <Card
                  key={req.id}
                  className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/20 overflow-hidden"
                >
                  <CardContent className="p-6 space-y-5">
                    {/* Status Badge - Top Right */}
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="outline" 
                        className={`${statusColor} border flex items-center gap-1.5 px-3 py-1`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {getStatusConfig(req.status).label}
                      </Badge>
                      
                      {req.createdAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* User Info with Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-gray-200 group-hover:border-primary/20 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold text-lg">
                          {getInitials(req.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {req.user.name || "User"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-sm text-gray-600 truncate">
                            Requesting: <span className="font-medium text-primary">{req.requestedRole}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* Contact Information */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-600 group/item">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/item:bg-primary/5 transition-colors">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="truncate flex-1">{req.user.email}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 group/item">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/item:bg-primary/5 transition-colors">
                          <Phone className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="truncate flex-1">{req.user.phone}</span>
                      </div>

                      {req.user.department && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="truncate flex-1">{req.user.department}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {req.status === "PENDING" && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-sm hover:shadow-md transition-all"
                          onClick={() => handleApprove(req.id)}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all"
                          onClick={() => handleReject(req.id)}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </div>
                    )}

                    {req.status !== "PENDING" && (
                      <div className="pt-2">
                        <Button 
                          variant="ghost" 
                          className="w-full text-gray-500 hover:text-gray-700 cursor-default"
                          disabled
                        >
                          {req.status === "APPROVED" ? "Request Approved" : "Request Rejected"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}