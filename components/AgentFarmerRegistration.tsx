'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Phone, MapPin, Map, Sprout, CheckCircle2 } from 'lucide-react'

export default function AgentFarmerRegistration() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        region: '',
        farmSize: '',
        primaryCrops: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call for registration
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        setIsSuccess(true)

        // Reset form after showing success message
        setTimeout(() => {
            setIsSuccess(false)
            setFormData({ fullName: '', phoneNumber: '', region: '', farmSize: '', primaryCrops: '' })
        }, 3000)
    }

    if (isSuccess) {
        return (
            <Card className="max-w-2xl mx-auto shadow-sm border-gray-100">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
                    <p className="text-gray-500 max-w-sm">
                        The farmer has been successfully registered in the system. They will receive an SMS confirmation shortly.
                    </p>
                    <button
                        onClick={() => { setIsSuccess(false); setFormData({ fullName: '', phoneNumber: '', region: '', farmSize: '', primaryCrops: '' }) }}
                        className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Register Another Farmer
                    </button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-sm border-gray-100">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Register New Farmer</CardTitle>
                <CardDescription>Enter the farmer's details below to enroll them in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative group">
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter farmer's full name"
                                    className="pl-10"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={16} />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative group">
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+251 9..."
                                    className="pl-10"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={16} />
                            </div>
                        </div>

                        {/* Region/Location */}
                        <div className="space-y-2">
                            <label htmlFor="region" className="text-sm font-medium text-gray-700">Region / Zone</label>
                            <div className="relative group">
                                <Input
                                    id="region"
                                    name="region"
                                    required
                                    value={formData.region}
                                    onChange={handleChange}
                                    placeholder="e.g., Oromia, Jimma"
                                    className="pl-10"
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={16} />
                            </div>
                        </div>

                        {/* Farm Size */}
                        <div className="space-y-2">
                            <label htmlFor="farmSize" className="text-sm font-medium text-gray-700">Farm Size (Hectares)</label>
                            <div className="relative group">
                                <Input
                                    id="farmSize"
                                    name="farmSize"
                                    type="number"
                                    step="0.1"
                                    required
                                    value={formData.farmSize}
                                    onChange={handleChange}
                                    placeholder="e.g., 2.5"
                                    className="pl-10"
                                />
                                <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Primary Crops */}
                    <div className="space-y-2">
                        <label htmlFor="primaryCrops" className="text-sm font-medium text-gray-700">Primary Crops</label>
                        <div className="relative group">
                            <Input
                                id="primaryCrops"
                                name="primaryCrops"
                                required
                                value={formData.primaryCrops}
                                onChange={handleChange}
                                placeholder="e.g., Coffee, Teff, Wheat (comma separated)"
                                className="pl-10"
                            />
                            <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={16} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Complete Registration'
                        )}
                    </button>
                </form>
            </CardContent>
        </Card>
    )
}
