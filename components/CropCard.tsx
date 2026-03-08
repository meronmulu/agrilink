// import React from 'react'
// import Image from 'next/image'
// import { Card, CardContent } from '@/components/ui/card'
// import { Edit, Trash2, BarChart2, Tractor, Coffee, History } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// export interface Crop {
//     id: string
//     name: string
//     category: string
//     status: 'In Stock' | 'Low Stock' | 'Out of Season' | 'In Stock (placeholder)'
//     price: number
//     unit: string
//     currentStock: number
//     maxStock: number
//     image?: string
// }

// interface CropCardProps {
//     crop: Crop
//     onEdit?: (crop: Crop) => void
//     onDelete?: (id: string) => void
// }

// export default function CropCard({ crop, onEdit, onDelete }: CropCardProps) {
//     const isOutOfSeason = crop.status === 'Out of Season'

//     return (
//         <Card className={`overflow-hidden rounded-2xl border-gray-100 ${isOutOfSeason ? 'opacity-70 bg-gray-50' : 'bg-white'}`}>
//             <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
//                 {crop.image ? (
//                     <>
//                         <Image
//                             src={crop.image}
//                             alt={crop.name}
//                             fill
//                             className="object-cover"
//                         />
//                     </>
//                 ) : (
//                     <div className="text-gray-300">
//                         {crop.category === 'Vegetables' && <Tractor size={48} />}
//                         {crop.category === 'Commodity' && <Coffee size={48} />}
//                         {(!crop.category || (crop.category !== 'Vegetables' && crop.category !== 'Commodity')) && (
//                             <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
//                         )}
//                     </div>
//                 )}

//                 {/* Category Badge */}
//                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
//                     {crop.category}
//                 </div>

//                 {/* Delete button overlay */}
//                 {onDelete && (
//                     <button
//                         onClick={() => onDelete(crop.id)}
//                         className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-white transition-colors shadow-sm"
//                         title="Remove listing"
//                     >
//                         <Trash2 size={14} />
//                     </button>
//                 )}
//             </div>

//             <CardContent className="p-5">
//                 <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight flex-1 mr-2">
//                         {crop.name}
//                     </h3>
//                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
//             ${crop.status === 'In Stock' || crop.status === 'In Stock (placeholder)' ? 'bg-emerald-100 text-emerald-700' : ''}
//             ${crop.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : ''}
//             ${crop.status === 'Out of Season' ? 'bg-gray-200 text-gray-600' : ''}
//           `}>
//                         {crop.status.replace(' (placeholder)', '')}
//                     </span>
//                 </div>

//                 <div className="mb-4 flex items-end gap-1">
//                     {isOutOfSeason ? (
//                         <span className="text-2xl font-bold text-gray-400">-- ETB</span>
//                     ) : (
//                         <span className="text-2xl font-bold text-emerald-500">{crop.price} ETB</span>
//                     )}
//                     <span className="text-gray-400 text-sm mb-1">/{crop.unit}</span>
//                 </div>

//                 {/* Stock Bar */}
//                 <div className="space-y-1.5 mb-6">
//                     <div className="flex justify-between text-xs font-medium text-gray-500">
//                         <span>Stock Level</span>
//                         <span>{crop.currentStock}{crop.unit} / {crop.maxStock}{crop.unit}</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
//                         <div
//                             className={`h-full rounded-full ${crop.status === 'Low Stock' ? 'bg-amber-400' : 'bg-emerald-500'
//                                 } ${isOutOfSeason ? 'bg-gray-300' : ''}`}
//                             style={{ width: `${Math.min(100, Math.max(0, (crop.currentStock / crop.maxStock) * 100))}%` }}
//                         ></div>
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                     <Button
//                         variant="outline"
//                         className="flex-1 h-9 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
//                         onClick={() => onEdit?.(crop)}
//                     >
//                         <Edit size={16} className="mr-2" />
//                         <span className="text-xs font-semibold">Edit Listing</span>
//                     </Button>
//                     <Button variant="outline" className="flex-1 h-9 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50">
//                         {isOutOfSeason ? (
//                             <>
//                                 <History size={16} className="mr-2" />
//                                 <span className="text-xs font-semibold">History</span>
//                             </>
//                         ) : (
//                             <>
//                                 <BarChart2 size={16} className="mr-2" />
//                                 <span className="text-xs font-semibold">Analytics</span>
//                             </>
//                         )}

//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
