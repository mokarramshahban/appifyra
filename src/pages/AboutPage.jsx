import React from 'react';
import AboutSection from '../components/sections/AboutSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowWeWorkSection from '../components/sections/HowWeWorkSection';
import ContactSection from '../components/sections/ContactSection';

export default function AboutPage() {
  return (
    <div className="pt-100">
      <AboutSection />
      <FeaturesSection />
      <HowWeWorkSection />
      <ContactSection />
    </div>
  );
}
