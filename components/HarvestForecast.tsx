import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, CheckCircle2, AlertTriangle, Plus } from 'lucide-react'

export default function HarvestForecast() {
    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <CalendarDays className="text-emerald-500" size={20} />
                    Harvest Forecast
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Event 1 */}
                <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-xl px-3 py-2 h-14 min-w-[56px]">
                        <span className="text-xs font-bold uppercase">Oct</span>
                        <span className="text-lg font-extrabold leading-none">15</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Wheat Harvest</h4>
                        <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Expected yield: 4,000kg</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 size={14} />
                            <span>On Track</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full"></div>

                {/* Event 2 */}
                <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center bg-amber-50 text-amber-600 rounded-xl px-3 py-2 h-14 min-w-[56px]">
                        <span className="text-xs font-bold uppercase">Nov</span>
                        <span className="text-lg font-extrabold leading-none">02</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Maize Collection</h4>
                        <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Expected yield: 2,500kg</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                            <AlertTriangle size={14} />
                            <span>Risk of delay</span>
                        </div>
                    </div>
                </div>

                {/* Add Event Button */}
                <button className="w-full py-2.5 mt-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                    <Plus size={16} />
                    Add Harvest Event
                </button>

            </CardContent>
        </Card>
    )
}
