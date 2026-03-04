'use client'

import React from 'react'
import { Search, ChevronDown, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CropCard, { Crop } from '@/components/CropCard'
import HarvestForecast from '@/components/HarvestForecast'
import AIStorageTips from '@/components/AIStorageTips'

// Mock Data matching the design
const myCrops: Crop[] = [
    {
        id: '1',
        name: 'Premium Teff (High Grade)',
        category: 'Grains',
        status: 'In Stock',
        price: 170,
        unit: 'kg',
        currentStock: 450,
        maxStock: 500,
        image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=1968&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Organic Avocados',
        category: 'Fruits',
        status: 'Low Stock',
        price: 75,
        unit: 'kg',
        currentStock: 120,
        maxStock: 2000,
        image: 'https://images.unsplash.com/photo-1519448896000-844d18fa0fd4?auto=format&fit=crop&q=80&w=2074&ixlib=rb-4.0.3'
    },
    {
        id: '3',
        name: 'Red Onions (Shallot)',
        category: 'Vegetables',
        status: 'Out of Season',
        price: 0,
        unit: 'kg',
        currentStock: 0,
        maxStock: 1000,
    },
    {
        id: '4',
        name: 'Export Coffee Beans',
        category: 'Commodity',
        status: 'In Stock (placeholder)', // mapped to In Stock styling in the CropCard
        price: 420,
        unit: 'kg',
        currentStock: 2100,
        maxStock: 3000,
    }
]

export default function MyCropsPage() {
    return (
        <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">

                {/* Top Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search my crops..."
                            className="pl-10 h-11 bg-white border-gray-200 focus:ring-emerald-500/20"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-11 bg-white border-gray-200 text-gray-700 w-full sm:w-auto px-4 justify-between min-w-[140px]">
                            All Categories <ChevronDown size={16} className="ml-2 text-gray-400" />
                        </Button>
                        <Button variant="outline" className="h-11 bg-white border-gray-200 text-gray-700 w-full sm:w-auto px-4 justify-between min-w-[120px]">
                            Status: All <ChevronDown size={16} className="ml-2 text-gray-400" />
                        </Button>
                    </div>

                    {/* Action Button */}
                    <Button className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:w-auto px-6 whitespace-nowrap hidden sm:flex">
                        <Plus size={18} className="mr-2" />
                        Post New Crop
                    </Button>
                </div>

                {/* Mobile Action Button */}
                <Button className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:hidden">
                    <Plus size={18} className="mr-2" />
                    Post New Crop
                </Button>

                {/* Crop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myCrops.map(crop => (
                        <CropCard key={crop.id} crop={crop} />
                    ))}
                </div>

            </div>

            {/* Right Sidebar (Extras) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <HarvestForecast />
                <AIStorageTips />
            </div>

        </div>
    )
}
