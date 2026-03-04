import React from 'react'
import { BrainCircuit, Info, AlertOctagon } from 'lucide-react'

export default function AIStorageTips() {
    return (
        <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">

            {/* Decorative background circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <BrainCircuit className="text-emerald-400" size={20} />
                </div>
                <h3 className="font-bold text-lg">AI Storage Tips</h3>
            </div>

            <div className="space-y-4">
                {/* Tip 1 - Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Info size={14} />
                        <span>For Avocados</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        "Keep storage temp at 5°C to extend shelf life by 4 days. Humidity should be 85%."
                    </p>
                </div>

                {/* Tip 2 - Alert */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <AlertOctagon size={14} />
                        <span>Alert</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        "High moisture detected in Teff silo #2. Aerate immediately to prevent spoilage."
                    </p>
                </div>
            </div>

            <button className="w-full mt-6 bg-white text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors shadow-sm">
                View All Insights
            </button>

        </div>
    )
}
