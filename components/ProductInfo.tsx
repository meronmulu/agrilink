'use client'

import React, { useState } from 'react'
import { Star, MessageSquare, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ProductInfo() {
    const [quantity, setQuantity] = useState(1)

    return (
        <div className="flex flex-col h-full bg-white p-6 md:p-8 rounded-2xl lg:rounded-l-none border border-gray-100 lg:border-l-0 shadow-sm lg:shadow-none">

            {/* Header Info */}
            <div className="mb-6">
                <p className="text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2">
                    Premium Harvest
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                    Premium Brown Teff<br />from Gojjam
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="fill-current" size={16} />
                        <Star className="fill-current" size={16} />
                        <Star className="fill-current" size={16} />
                        <Star className="fill-current" size={16} />
                        <Star className="fill-current" size={16} />
                        <span className="font-semibold text-gray-900 ml-1">4.8</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <a href="#reviews" className="hover:text-emerald-600 underline underline-offset-2">124 reviews</a>
                </div>
            </div>

            {/* Price & Stock */}
            <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-emerald-600">ETB 180</span>
                    <span className="text-gray-500 font-medium pb-1">/ kg</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    In Stock & Ready to Ship
                </div>
            </div>

            {/* Seller Profile */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src="https://images.unsplash.com/photo-1595804562098-b807df4567ac?q=80&w=2071&auto=format&fit=crop"
                            alt="Farmer Profile"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-1">
                            Abebe Bikila
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </h4>
                        <p className="text-xs text-gray-500">Verified Farmer • 4.9 Rating</p>
                    </div>
                </div>
                <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs font-semibold h-8 rounded-lg px-3">
                    <MessageSquare size={14} className="mr-1.5" />
                    Message Farmer
                </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl w-32 bg-gray-50 h-12">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-semibold text-gray-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl text-base shadow-sm">
                        <ShoppingCart size={18} className="mr-2" />
                        Add to Cart
                    </Button>
                </div>
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold h-12 rounded-xl text-base">
                    Buy Now
                </Button>
            </div>

            {/* Meta Traits Grid */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Origin</p>
                    <p className="text-sm font-semibold text-gray-900">Gojjam, Ethiopia</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Harvest Date</p>
                    <p className="text-sm font-semibold text-gray-900">November 2023</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pack Sizes</p>
                    <p className="text-sm font-semibold text-gray-900">1kg, 5kg, 25kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Certifications</p>
                    <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Organic</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Fair Trade</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
