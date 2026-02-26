import CoreFeature from "@/components/CoreFeature";
import CustomerSays from "@/components/CostomerSays";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroSection from "@/components/HeroSection";
import MarketPlacePreview from "@/components/MarketPlacePreview";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CoreFeature />
        <MarketPlacePreview />
        <HeroSection />
        <CustomerSays />
      </main>
      <Footer />
    </>
  );
}

