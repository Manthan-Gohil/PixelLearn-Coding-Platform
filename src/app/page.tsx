"use client";

import { useState, useEffect } from "react";
import StandardLayout from "@/components/layout/StandardLayout";
import LandingReveal from "@/components/LandingReveal";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CoursesPreview from "@/components/home/CoursesPreview";
import AIToolsHighlight from "@/components/home/AIToolsHighlight";
import PricingPreview from "@/components/home/PricingPreview";
import CTASection from "@/components/home/CTASection";

// This variable persists during client-side navigation but resets on full page reload
let hasShownRevealInThisSession = false;

export default function Home() {
  const [showReveal, setShowReveal] = useState(!hasShownRevealInThisSession);

  useEffect(() => {
    if (!hasShownRevealInThisSession) {
      const timer = setTimeout(() => {
        setShowReveal(false);
        hasShownRevealInThisSession = true;
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showReveal && <LandingReveal />}
      <StandardLayout
        noContainer={true}
        particlesCount={25}
        className={`overflow-x-hidden transition-opacity duration-1000 ${showReveal ? 'h-screen overflow-hidden opacity-0' : 'opacity-100'}`}
      >
        <HeroSection />
        <FeaturesSection />
        <CoursesPreview />
        <AIToolsHighlight />
        <PricingPreview />
        <CTASection />
      </StandardLayout>
    </>
  );
}
