'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
    images: string[]
    isOrganic?: boolean
}

export default function ProductGallery({ images, isOrganic }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0)

    return (
        <div className="space-y-4 w-full">
            {/* Main Image */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                {isOrganic && (
                    <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        Organic Certified
                    </div>
                )}
                <Image
                    src={images[activeImage]}
                    alt={`Product image ${activeImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={cn(
                            "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                            activeImage === idx ? "border-emerald-500 shadow-sm" : "border-transparent hover:border-emerald-200"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}

                {/* Play Video Placeholder Thumbnail */}
                <button className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors">
                    <PlayCircle size={24} />
                </button>
            </div>
        </div>
    )
}
