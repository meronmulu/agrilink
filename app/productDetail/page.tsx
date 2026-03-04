'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import img from '../../public/agriGirl.jpg'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'
import Link from 'next/link'

export default function ProductDetail() {
    const [showContact, setShowContact] = useState(false)

    return (
        <div>
            <Header />
            <div className="py-24 px-4 md:px-12 bg-[#F5F5F5] min-h-screen">
                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

                    {/* LEFT SIDE - IMAGE */}
                    <div>
                        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={img}
                                alt="Premium Brown Teff"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Thumbnail images */}
                        <div className="flex gap-4 mt-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="relative w-24 h-24 rounded-xl overflow-hidden border hover:border-emerald-500 cursor-pointer"
                                >
                                    <Image
                                        src={img}
                                        alt="Thumbnail"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE - DETAILS */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Brown Teff
                            </h1>
                        </div>

                        {/* Price */}
                        <div>
                            <h2 className="text-3xl font-bold text-emerald-600">
                                ETB 180 <span className="text-base text-gray-500">/ kg</span>
                            </h2>
                            <p className="text-sm text-green-600 mt-1">
                                In Stock & Ready to Ship
                            </p>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <Link href="/cart">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white ">
                                    Add to Cart
                                </Button>
                            </Link>

                            <Link href="/payment">
                                <Button
                                    variant="outline"
                                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                >
                                    Buy Now
                                </Button>
                            </Link>


                        </div>

                        <div className="grid">
                            <Card className="p-5 rounded-2xl shadow-sm border border-gray-100">

                                {/* Farmer Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                        AM
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Abebe Mekonnen
                                        </h4>
                                        <p className='text-sm'>farmer</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <p className="mt-4 text-sm text-gray-600">
                                    📍 Gojjam, Ethiopia
                                </p>

                                {/* Contact Section */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className="mt-4">
                                        {!showContact ? (
                                            <Button
                                                variant="outline"
                                                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                                onClick={() => setShowContact(true)}
                                            >
                                                Show Contact
                                            </Button>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-800">
                                                    +251 9 12 34 56 78
                                                </p>

                                            </div>
                                        )}
                                    </div>

                                    {/* Chat Button */}
                                    <div className="mt-4">
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Start Chat
                                        </Button>
                                    </div>
                                </div>


                            </Card>
                        </div>

                    </div>
                </div>

                {/* Description Section */}
                <div className="max-w-6xl mx-auto mt-16">
                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Sourced directly from the fertile highlands of Gojjam, our Premium Brown Teff
                        is harvested using traditional sustainable methods passed down through
                        generations. This “super-grain” is naturally gluten-free and packed with
                        essential minerals including iron, calcium, and magnesium.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
                        <p>✔ 100% Organic certified by local authorities</p>
                        <p>✔ Triple-cleaned and stone-ground compatible</p>
                        <p>✔ Direct-from-farm supply chain</p>
                        <p>✔ Rich in protein and dietary fiber</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}