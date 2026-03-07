'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function Page() {
    const { items, summary, updateQuantity, removeItem } = useCart()
    const { t } = useLanguage()

    return (
        <div>
            <Header/>
            <div className="pt-24 px-4 md:px-12 bg-[#F5F5F5] min-h-screen">
                <h1 className="text-3xl font-bold mb-8">{t('cart_title')}</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">{t('cart_empty')}</p>
                        <Link href="/buyer/marketplace">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {t('cart_continue_shopping')}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            {items.map((item) => (
                                <Card key={item.id} className="p-5 rounded-2xl">
                                    <div className="flex gap-4">
                                        <div className="relative w-28 h-28 rounded-xl overflow-hidden">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                    {t('market_no_image')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {t('cart_sold_by')} {item.seller}
                                            </p>

                                            <p className="text-emerald-600 font-semibold mt-2">
                                                ${item.price.toFixed(2)} / {item.unit}
                                            </p>

                                            {/* Quantity */}
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex border rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                        disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 text-sm hover:text-red-700"
                                                >
                                                    {t('cart_remove')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* RIGHT - Order Summary */}
                        <Card className="p-6 rounded-2xl h-fit">
                            <h2 className="text-xl font-semibold mb-4">
                                {t('cart_order_summary')}
                            </h2>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>{t('cart_subtotal')}</span>
                                    <span>${summary.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t('cart_delivery')}</span>
                                    <span>${summary.delivery.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t my-4"></div>

                            <div className="flex justify-between font-semibold text-lg">
                                <span>{t('cart_total')}</span>
                                <span className="text-emerald-600">${summary.total.toFixed(2)}</span>
                            </div>

                            <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                                {t('cart_proceed_checkout')}
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    )
}