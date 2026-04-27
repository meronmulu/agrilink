'use client'

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MarketPrice } from "@/types/market-place"
import {
  getMarketPrices,
  approveMarketPrice,
  rejectMarketPrice,
} from "@/services/marketPrice"
import { useLanguage } from "@/context/LanguageContext"


export default function MarketPricePage() {
  const { t } = useLanguage()
  const [data, setData] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [woredaFilter, setWoredaFilter] = useState("all")
  const [page, setPage] = useState(1)

  const pageSize = 5

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await getMarketPrices()
      setData(res)
    } catch (err) {
      toast.error(t('toast_failed_load_market_prices') || "Failed to load market prices")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= APPROVE ================= */
  const handleApprove = async (id: string) => {
    try {
      await approveMarketPrice(id)

      toast.success(t('toast_price_approved') || "Price approved")

      setData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: "APPROVED" }
            : item
        )
      )
    } catch (err) {
      toast.error(t('toast_approval_failed') || "Approval failed")
      console.log(err)
    }
  }

  /* ================= REJECT ================= */
  const handleReject = async (id: string) => {
    try {
      await rejectMarketPrice(id)

      toast.success("Price rejected")

      setData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: "REJECTED" }
            : item
        )
      )
    } catch (err) {
      toast.error("Rejection failed")
      console.log(err)
    }
  }

  /* ================= FILTER ================= */
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.product?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.productId.toLowerCase().includes(search.toLowerCase())

    const matchesWoreda =
      woredaFilter === "all" ||
      item.woreda?.name === woredaFilter

    return matchesSearch && matchesWoreda
  })

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

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
      <h1 className="text-2xl font-bold mb-6">
        {t('market_price_mgt') || 'Market Price Management'}
      </h1>

      {/* FILTER CARD */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <Input
            placeholder={t('search_by_name') || "Search by name..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-96"
          />

          <Select
            value={woredaFilter}
            onValueChange={(value) => {
              setWoredaFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder={t('all_locations') || "All Locations"} />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Locations
              </SelectItem>

              {[...new Set(data.map(i => i.woreda?.name))]
                .filter(Boolean)
                .map((w, i) => (
                  <SelectItem key={i} value={w as string}>
                    {w}
                  </SelectItem>
                ))}
            </SelectContent>

          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">

                {/* PRODUCT */}
                <TableCell className="font-medium">
                  {item.product?.name || item.productId}
                </TableCell>

                {/* PRICE */}
                <TableCell className="font-semibold text-emerald-600">
                  {item.price} ETB
                </TableCell>

                {/* LOCATION */}
                <TableCell className="text-gray-600">
                  {item.woreda?.name || "-"}
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <Badge
                    className={
                      item.status === "APPROVED"
                        ? "bg-emerald-600"
                        : item.status === "REJECTED"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }
                  >
                    {item.status || "PENDING"}
                  </Badge>
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-right space-x-2">

                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleApprove(item.id)}
                    disabled={item.status !== "PENDING"}
                  >
                    {t('approve') || 'Approve'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(item.id)}
                    disabled={item.status !== "PENDING"}
                  >
                    Reject
                  </Button>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">

        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages || 1 }).map((_, i) => {
              const pageNumber = i + 1

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage(p => Math.min(p + 1, totalPages || 1))
                }
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>

      </div>

    </div>
  )
}