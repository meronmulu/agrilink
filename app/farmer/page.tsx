import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Marketplace from '@/components/MarketPlace'

export default function page() {
  return (
    <div className='overflow-y-hidden'>
        <Header/>
        <Marketplace/>
        <Footer/> 
        
    </div>
  )
}
 