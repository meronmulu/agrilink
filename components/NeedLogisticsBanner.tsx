import React from 'react'
import { Truck, X } from 'lucide-react'

export default function NeedLogisticsBanner({ t }: { t: any }) {
    return (
        <div className="bg-emerald-500 rounded-2xl p-6 text-white relative shadow-md overflow-hidden group">

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-10 translate-y-10"></div>

            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X size={18} />
            </button>

            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Truck size={24} className="text-white" />
                </div>

                <h3 className="text-lg font-bold mb-2">
                    {t('sales_logistics_title')}
                </h3>

                <p className="text-emerald-50 text-sm leading-relaxed mb-6">
                    {t('sales_logistics_desc')}
                </p>

                <button className="w-full h-11 bg-white text-emerald-600 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors">
                    {t('sales_logistics_btn')}
                </button>
            </div>

        </div>
    )
}
