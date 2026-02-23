import CoreFeature from "@/components/CoreFeature";
import CostomerSays from "@/components/CostomerSays";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroSection from "@/components/HeroSection";
import MarketPlacePreview from "@/components/MarketPlacePreview";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <CoreFeature/>
      <MarketPlacePreview/>
      <HeroSection/>
      <CostomerSays/>
      <Footer/>
    </div>
  );
}

