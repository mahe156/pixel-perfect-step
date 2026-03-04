import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import CampaignShowcase from "@/components/landing/CampaignShowcase";
import Calculator from "@/components/landing/Calculator";
import Trust from "@/components/landing/Trust";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <CampaignShowcase />
      <Calculator />
      <Trust />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
