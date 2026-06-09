import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VerticalArchitecture } from "@/components/VerticalArchitecture";
import { ProblemSolution } from "@/components/ProblemSolution";
import { MainSolution } from "@/components/MainSolution";
import { Benefits } from "@/components/Benefits";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhatsAppPopup } from "@/components/WhatsAppPopup";
import { VapiWidget } from "@/components/VapiWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Structural technical grid lines background (Linear/Evervault style) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-[6vw] opacity-35">
        <div className="w-px h-full bg-primary/5" />
        <div className="w-px h-full bg-primary/5 hidden sm:block" />
        <div className="w-px h-full bg-primary/5 hidden md:block" />
        <div className="w-px h-full bg-primary/5" />
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <VerticalArchitecture />
        <div className="hairline" />
        <ProblemSolution />
        <div className="hairline" />
        <MainSolution />
        <div className="hairline" />
        <Benefits />
        <div className="hairline" />
        <ContactForm />
        <Footer />
      </div>

      <WhatsAppButton />
      <WhatsAppPopup />
      <VapiWidget />
    </div>
  );
};

export default Index;
