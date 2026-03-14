import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MarketPlace from '@/components/MarketPlace'

export default function page() {
  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1">
            <MarketPlace/>
          </main>
          <Footer />
  </div>
  )
}
