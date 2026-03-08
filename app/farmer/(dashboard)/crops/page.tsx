'use client'

import { Search, ChevronDown, Plus, Sprout } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import HarvestForecast from '@/components/HarvestForecast'
import AIStorageTips from '@/components/AIStorageTips'

export default function MyCropsPage() {

  const crops = []
  const filtered = []

  return (
    <>
      {/* <AddCropModal open={false} /> */}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <div className="flex-1 space-y-6">

          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search my crops..."
                className="pl-10 h-11 bg-white border-gray-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">

              <Button
                variant="outline"
                className="h-11 bg-white border-gray-200 text-gray-700 px-4 justify-between min-w-[150px]"
              >
                Category
                <ChevronDown size={16} className="ml-2 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                className="h-11 bg-white border-gray-200 text-gray-700 px-4 justify-between min-w-[130px]"
              >
                Status
                <ChevronDown size={16} className="ml-2 text-gray-400" />
              </Button>

            </div>

            {/* Post Button Desktop */}
            <Button
              className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:w-auto px-6 whitespace-nowrap hidden sm:flex"
            >
              <Plus size={18} className="mr-2" />
              Post New Crop
            </Button>

          </div>

          {/* Mobile Post Button */}
          <Button
            className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:hidden"
          >
            <Plus size={18} className="mr-2" />
            Post New Crop
          </Button>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <Sprout size={48} className="mb-4 text-gray-200" />

            <p className="font-semibold text-gray-600 text-lg">
              No crops yet
            </p>

            <p className="text-sm mt-1">
              Click "Post New Crop" to list your first crop on the marketplace.
            </p>

            <Button className="mt-5 bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus size={16} className="mr-2" />
              Post New Crop
            </Button>
          </div>

          {/* Crop Grid Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <CropCard />
            <CropCard /> */}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <HarvestForecast />
          <AIStorageTips />
        </div>

      </div>
    </>
  )
}