import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Handshake, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getActiveNegotiations, NegotiationItem } from '@/services/buyerService'
import { useLanguage } from '@/context/LanguageContext'

export default function ActiveNegotiations() {
    const { t } = useLanguage()
    const [negotiations, setNegotiations] = useState<NegotiationItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNegotiations = async () => {
            try {
                const data = await getActiveNegotiations()
                setNegotiations(data)
            } catch (error) {
                console.error('Failed to fetch negotiations:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNegotiations()
    }, [])

    if (loading) {
        return (
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Handshake className="text-emerald-500" size={20} />
                        {t('active_negotiations') || 'Active Negotiations'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border">
            <CardHeader className="p-4 sm:p-6 border-b border-gray-100 bg-white flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <Handshake className="text-emerald-500 shrink-0" size={20} />
                    {t('active_negotiations') || 'Active Negotiations'}
                </CardTitle>
                <span className="text-sm font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer cursor-pointer whitespace-nowrap">{t('view_all') || 'View All'}</span>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-gray-100 bg-white">
                {negotiations.map((item) => (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">

                        {/* Image */}
                        <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <Image src={item.image} alt={item.product} fill className="object-cover" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3 md:mb-0">
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.product}</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('farmer') || 'Farmer'}: <span className="text-emerald-600 font-medium">{item.farmer}</span></p>
                                </div>
                                <div className="self-start">
                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>

                            {/* Pricing Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 mt-2 md:mt-0">
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{t('quantity') || 'Quantity'}</p>
                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{item.quantity}</p>
                                </div>
                                {item.currentPrice && (
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{t('current_price') || 'Current Price'}</p>
                                        <p className="font-bold text-gray-900 text-sm sm:text-base">{item.currentPrice}</p>
                                    </div>
                                )}
                                {item.originalPrice && (
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{t('original') || 'Original'}</p>
                                        <p className="font-semibold text-gray-400 line-through text-sm sm:text-base">{item.originalPrice}</p>
                                    </div>
                                )}
                                {item.myOffer && (
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{t('my_offer') || 'My Offer'}</p>
                                        <p className="font-bold text-gray-900 text-sm sm:text-base">{item.myOffer}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {item.actions.map(action => (
                                    <Button
                                        key={action}
                                        variant={action === 'Review Offer' ? 'default' : 'outline'}
                                        className={`h-9 text-xs sm:text-sm font-bold px-4 ${action === 'Review Offer'
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {t(action.toLowerCase().replace(/ /g, '_')) || action}
                                    </Button>
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
