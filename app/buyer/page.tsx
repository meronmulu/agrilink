import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MarketPlace from '@/components/MarketPlace'
import ProtectedRoute from '@/components/ProtectedRoute'


export default function page() {
  return (
    <ProtectedRoute roles={ ["BUYER"]}>
    <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <MarketPlace/>
          </main>
          <Footer />    
  </div>
  </ProtectedRoute>
  )
}
