'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/ProductGallery'
import ProductInfo from '@/components/ProductInfo'
import Link from 'next/link'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

// Dummy product images
const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=2070', // Main pile of grain
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1974', // Bowl
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=2070', // Field
]

export default function ProductDetailsPage() {
    const [activeTab, setActiveTab] = useState('description')

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-xs text-gray-500 font-medium mb-8 overflow-x-auto whitespace-nowrap">
                        <Link href="/buyer/marketplace" className="hover:text-emerald-600">Marketplace</Link>
                        <ChevronRight size={14} className="mx-2 shrink-0" />
                        <span className="hover:text-emerald-600 cursor-pointer">Grains</span>
                        <ChevronRight size={14} className="mx-2 shrink-0" />
                        <span className="text-gray-900 font-bold">Premium Teff</span>
                    </nav>

                    {/* Top Section: Gallery & Info */}
                    <div className="flex flex-col lg:flex-row mb-16 shadow-lg lg:shadow-none rounded-3xl overflow-hidden border border-gray-100 lg:border-none">
                        {/* Gallery Left Side */}
                        <div className="w-full lg:w-3/5 p-4 lg:p-0">
                            <ProductGallery images={PRODUCT_IMAGES} isOrganic={true} />
                        </div>

                        {/* Info Right Side */}
                        <div className="w-full lg:w-2/5">
                            <ProductInfo />
                        </div>
                    </div>

                    {/* Bottom Tabs Section */}
                    <div className="max-w-4xl">
                        {/* Tabs Header */}
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            {['Description', 'Nutritional Info', 'Farming Methods'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === tab.toLowerCase() ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase() && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <div className="text-gray-600 leading-relaxed text-sm md:text-base space-y-6">
                            <p>
                                Sourced directly from the fertile highlands of Gojjam, our Premium Brown Teff is harvested using traditional sustainable methods passed down through generations. This "super-grain" is naturally gluten-free and packed with essential minerals including iron, calcium, and magnesium.
                            </p>
                            <p>
                                Characterized by its rich, nutty flavor and deep cocoa-colored grains, it's the perfect choice for authentic Injera or as a modern substitute in baking. Every purchase directly supports smallholder farmers in the Gojjam region, ensuring fair wages and community development.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                    <span className="font-medium text-gray-700 text-sm">100% Organic certified by local authorities</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                    <span className="font-medium text-gray-700 text-sm">Triple-cleaned and stone-ground compatible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                    <span className="font-medium text-gray-700 text-sm">Direct-from-farm supply chain</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                    <span className="font-medium text-gray-700 text-sm">Rich in protein and dietary fiber</span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-12 border-gray-100" />

                        {/* Reviews Section Placeholder */}
                        <div id="reviews">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                                <button className="text-emerald-600 font-bold text-sm hover:underline">Write a Review ↗</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Review 1 */}
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                                ST
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Sarah Tadesse</h4>
                                                <div className="flex text-amber-500">
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Absolutely best quality teff I've found online. The color is deep and rich, and it makes the most perfect, sour injera. Highly recommend!
                                    </p>
                                </div>

                                {/* Review 2 */}
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                DK
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Daniel Kebede</h4>
                                                <div className="flex text-amber-500">
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star className="fill-current" size={12} />
                                                    <Star size={12} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">1 week ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Fast delivery to Addis. The packaging was very secure and the grain is clean of any dust or debris. Will buy again.
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <Button variant="outline" className="text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100">
                                    Load More Reviews
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
