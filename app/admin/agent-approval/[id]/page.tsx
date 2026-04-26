
'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import {
    Loader2,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    MapPin,
    Clock,
    AlertCircle
} from "lucide-react"

import {
    getRoleRequests,
    approveRoleRequest
} from "@/services/roleRequestService"

import { toast } from "sonner"
import { RoleRequest } from "@/types/roleRequest"

/* ================= STATUS CONFIG ================= */
const getStatusConfig = (status: string) => {
    switch (status) {
        case "PENDING":
            return {
                color: "bg-amber-50 text-amber-700 border-amber-200",
                icon: Clock,
                label: "Pending Review",
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



export default function Page() {
    const { id } = useParams()
    const router = useRouter()

    const [data, setData] = useState<RoleRequest | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [approving, setApproving] = useState(false)
    const [rejecting, setRejecting] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getRoleRequests()
                console.log("role requests", res)

                const found = res.find((item: RoleRequest) => item.id === id)

                setData(found || null)
            } catch (err) {
                console.log(err)
                toast.error("Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetch()
    }, [id])

    const handleApprove = async () => {
        if (!data) return
        setApproving(true)

        try {
            await approveRoleRequest(data.id, true, data.requestedRole)

            toast.success("Approved successfully")

            setData(prev =>
                prev ? { ...prev, status: "APPROVED" } : prev
            )

            router.push("/admin/agent-approval")
        } catch {
            toast.error("Failed to approve")
        } finally {
            setApproving(false)
        }
    }
    const handleReject = async () => {
        if (!data) return
        setRejecting(true)

        try {
            await approveRoleRequest(data.id, false)
            toast.success("Rejected successfully")

            setData(prev => prev ? { ...prev, status: "REJECTED" } : prev)
            router.push("/admin/agent-approval")
        } catch {
            toast.error("Failed to reject")
        } finally {
            setRejecting(false)
        }
    }

    if (loading) {
        return (
            <div className="h-[70vh] flex justify-center items-center">
                <Loader2 className="animate-spin text-emerald-500" />
            </div>
        )
    }

    if (!data) return <div className="text-center py-10">No data</div>

    const profile = data.user.profile
    const statusConfig = getStatusConfig(data.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">

            {/* ================= PROFILE ================= */}
            <Card>
                <CardContent className="p-6 flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={profile?.imageUrl || "/default-avatar.png"}
                            alt="user"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">
                            {profile?.fullName}
                        </h2>

                        <div className="flex gap-2 mt-2">
                            <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                                <StatusIcon size={14} />
                                {statusConfig.label}
                            </Badge>

                            <Badge variant="secondary">
                                {data.requestedRole}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6 space-y-3">
                        <h3 className="font-semibold">Contact</h3>
                        <Separator />

                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {data.user.email || "N/A"}
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                {data.user.phone || "N/A"}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= LOCATION ================= */}
                <Card>
                    <CardContent className="p-6 space-y-3">
                        <h3 className="font-semibold">Location</h3>
                        <Separator />

                        <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} />
                            {data.kebeleId || "Unknown location"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ================= PROFESSIONAL ================= */}
            <Card>
                <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold">Professional Info</h3>
                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div>
                            <p className="text-gray-500">Current Role</p>
                            <p>{data.currentRole}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Education</p>
                            <p>{data.educationLevel}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Digital Skills</p>
                            <p>{data.digitalSkills ? "Yes" : "No"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Agriculture Experience</p>
                            <p>{data.experienceInAgriculture ? "Yes" : "No"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Government Assigned</p>
                            <p>{data.governmentAssigned ? "Yes" : "No"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">User Status</p>
                            <p>{data.user?.status || "N/A"}</p>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* ================= DOCUMENTS ================= */}
            <Card>
                <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold">Verification Documents</h3>
                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.verificationCredentials?.map((img: string, i: number) => (
                            <div
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className="relative h-40 cursor-pointer rounded overflow-hidden border"
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Action</h3>
                    <Separator />

                    <div className="flex gap-3 items-center">

                        {/* APPROVE */}
                        <Button
                            size="sm"
                            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                            onClick={handleApprove}
                            disabled={approving || rejecting}
                        >
                            {approving ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                "Approve"
                            )}
                        </Button>

                        {/* REJECT */}
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-9 px-4 border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                            onClick={handleReject}
                            disabled={rejecting || approving}
                        >
                            {rejecting ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                "Reject"
                            )}
                        </Button>

                    </div>


                </CardContent>
            </Card>



            {/* ================= IMAGE MODAL ================= */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full max-w-3xl h-[80vh]">
                        <Image
                            src={selectedImage}
                            alt="preview"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

