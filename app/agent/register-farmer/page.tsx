'use client'

import AgentFarmerRegistration from '@/components/AgentFarmerRegistration'
import OtherSignUpPage from '@/components/OtherSignUpPage'

export default function RegisterFarmerPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            
            {/* Card */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border p-6 md:p-10">
                
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Registration Portal
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Complete the steps to register a farmer and create an account.
                    </p>
                </div>

                {/* Content */}
                <div>
                    <AgentFarmerRegistration />
                </div>

            </div>

        </div>
    )
}