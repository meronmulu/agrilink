'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutPage() {
  const [selected, setSelected] = useState('telebirr')

  return (
    <div>
      <Header/>
      <div className="py-24 px-4 md:px-12 bg-[#F5F5F5] min-h-screen">
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

          {/* LEFT SIDE - PAYMENT METHODS */}
          <div className="md:col-span-2">

            <h1 className="text-3xl font-bold mb-2">
              Payment Method
            </h1>
            <p className="text-gray-500 mb-8">
              Choose your preferred local payment provider to complete the purchase.
            </p>

            <div className="space-y-4">

              {/* TELEBIRR */}
              <Card
                onClick={() => setSelected('telebirr')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition
                ${selected === 'telebirr'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200'
                  }`}
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      TB
                    </div>

                    <div>
                      <h3 className="font-semibold">Telebirr</h3>
                      <p className="text-sm text-gray-500">
                        Fast and secure mobile payment
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selected === 'telebirr'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-gray-300'
                    }`}
                  >
                    {selected === 'telebirr' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>

                </div>
              </Card>

              {/* CBE BIRR */}
              <Card
                onClick={() => setSelected('cbe')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition
                ${selected === 'cbe'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-900 text-white flex items-center justify-center font-bold">
                    CBE
                  </div>

                  <div>
                    <h3 className="font-semibold">CBE Birr</h3>
                    <p className="text-sm text-gray-500">
                      Commercial Bank of Ethiopia Mobile Banking
                    </p>
                  </div>
                </div>
              </Card>

              {/* BANK TRANSFER */}
              <Card
                onClick={() => setSelected('bank')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition
                ${selected === 'bank'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                    🏦
                  </div>

                  <div>
                    <h3 className="font-semibold">Bank Transfer</h3>
                    <p className="text-sm text-gray-500">
                      Direct deposit from any local bank
                    </p>
                  </div>
                </div>
              </Card>

            </div>

            {/* ESCROW INFO */}
            <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <ShieldCheck className="text-emerald-600" />
              <div>
                <h4 className="font-semibold text-emerald-700">
                  Secure Escrow Payment
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Funds are held securely and only released to the seller once you confirm receipt of your agricultural products.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <Card className="p-6 rounded-2xl h-fit shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Jimma Arabica Coffee</span>
                <span>45,000 ETB</span>
              </div>

              <div className="flex justify-between">
                <span>White Teff</span>
                <span>12,000 ETB</span>
              </div>

            </div>

            <div className="border-t my-6"></div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>57,000 ETB</span>
              </div>

              <div className="flex justify-between">
                <span>Service Fee (2%)</span>
                <span>1,140 ETB</span>
              </div>
            </div>

            <div className="border-t my-6"></div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Grand Total</span>
              <span className="text-emerald-600">58,140 ETB</span>
            </div>

            <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Confirm and Pay
            </Button>

            <p className="text-xs text-gray-400 mt-4">
              By confirming this payment, you agree to the Terms of Service and Escrow Agreement.
            </p>

          </Card>

        </div>
      </div>
      <Footer/>
    </div>

  )
}