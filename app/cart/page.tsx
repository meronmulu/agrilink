'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import img from '@/public/agriGirl.jpg'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function Page() {
    return (
        <div>
            <Header/>
            <div className="pt-24 px-4 md:px-12 bg-[#F5F5F5] min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="md:col-span-2 space-y-6">

                        <Card className="p-5 rounded-2xl">
                            <div className="flex gap-4">

                                <div className="relative w-28 h-28 rounded-xl overflow-hidden">
                                    <Image src={img} alt="Teff" fill className="object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        Premium Brown Teff
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Sold by Abebe Mekonnen
                                    </p>

                                    <p className="text-emerald-600 font-semibold mt-2">
                                        ETB 180 / kg
                                    </p>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex border rounded-lg overflow-hidden">
                                            <button className="px-3 py-1">-</button>
                                            <span className="px-4">2</span>
                                            <button className="px-3 py-1">+</button>
                                        </div>

                                        <button className="text-red-500 text-sm">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>

                    {/* RIGHT - Order Summary */}
                    <Card className="p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>ETB 360</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>ETB 50</span>
                            </div>
                        </div>

                        <div className="border-t my-4"></div>

                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span className="text-emerald-600">ETB 410</span>
                        </div>

                        <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                            Proceed to Checkout
                        </Button>
                    </Card>

                </div>
            </div>
            <Footer/>
        </div>

    )
}