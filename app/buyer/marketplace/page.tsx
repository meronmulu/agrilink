import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MarketPlace from "@/components/MarketPlace";

export default function BuyerMarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MarketPlace />
      </main>
      <Footer />
    </div>
  );
}
