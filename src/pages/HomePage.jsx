import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import InternshipHighlightSection from '../components/sections/InternshipHighlightSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowWeWorkSection from '../components/sections/HowWeWorkSection';
import QuickVerifySection from '../components/sections/QuickVerifySection';
import IndustriesSection from '../components/sections/IndustriesSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <main className="main">
      <HeroSection />
      <ServicesSection />
      <InternshipHighlightSection />
      <QuickVerifySection />
      <FeaturesSection />
      <HowWeWorkSection />
      <IndustriesSection />
      <ContactSection />
    </main>
  );
}
