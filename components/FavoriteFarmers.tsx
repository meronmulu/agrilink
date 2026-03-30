import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Heart, MessageSquare, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { getFavoriteFarmers, FavoriteFarmer } from '@/services/buyerService'

export default function FavoriteFarmers() {
    const [farmers, setFarmers] = useState<FavoriteFarmer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const data = await getFavoriteFarmers()
                setFarmers(data)
            } catch (error) {
                console.error('Failed to fetch favorite farmers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFarmers()
    }, [])

    if (loading) {
        return (
            <Card className="rounded-2xl border-gray-100 shadow-sm border mb-6">
                <CardHeader className="p-4 sm:p-6 border-b border-gray-50 bg-white">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <Heart className="text-emerald-500 fill-current shrink-0" size={20} />
                        Favorite Farmers
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 bg-white flex justify-center items-center">
                    <Loader2 className="animate-spin text-emerald-500" size={24} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border mb-6">
            <CardHeader className="p-4 sm:p-6 border-b border-gray-50 bg-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <Heart className="text-emerald-500 fill-current shrink-0" size={20} />
                    Favorite Farmers
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 bg-white space-y-5">
                {farmers.map((farmer) => (
                    <div key={farmer.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                {farmer.imageUrl ? (
                                    <Image src={farmer.imageUrl} alt={farmer.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs font-bold">
                                        {farmer.name.charAt(0)}
                                    </div>
                                )}
                                {/* Online Indicator */}
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-400`}></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">{farmer.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{farmer.location}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-amber-500">★</span>
                                    <span className="text-xs text-gray-600">{farmer.rating}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-600">{farmer.productsCount} products</span>
                                </div>
                            </div>
                        </div>

                        <button className="text-gray-400 hover:text-emerald-500 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg">
                            <MessageSquare size={18} />
                        </button>
                    </div>
                ))}

                <div className="pt-2 text-center">
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1 mx-auto">
                        View All Favorites <span>→</span>
                    </button>
                </div>

            </CardContent>
        </Card>
    )
}
