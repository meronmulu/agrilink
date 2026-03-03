import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Heart, MessageSquare } from 'lucide-react'
import Image from 'next/image'

// Mock Data
const farmers = [
    {
        id: 1,
        name: 'Farmer Abebe',
        location: 'Gojjam • Cereals',
        image: 'https://images.unsplash.com/photo-1595804562098-b807df4567ac?q=80&w=2071&auto=format&fit=crop',
        online: true
    },
    {
        id: 2,
        name: "Sara's Organic Farm",
        location: 'Sidama • Fruits',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3',
        online: false
    },
    {
        id: 3,
        name: 'Alemitu Coffee',
        location: 'Jimma • Coffee',
        image: 'https://plus.unsplash.com/premium_photo-1663040330953-ad9748bde9dc?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
        online: true
    }
]

export default function FavoriteFarmers() {
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
                                <Image src={farmer.image} alt={farmer.name} fill className="object-cover" />
                                {/* Online Indicator */}
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${farmer.online ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">{farmer.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{farmer.location}</p>
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
