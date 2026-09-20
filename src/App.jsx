import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import InternshipPage from './pages/InternshipPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Preloader from './components/common/Preloader';

// New Pages & Components
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import CookieBanner from './components/common/CookieBanner';

export default function App() {
  // Step 4: Render Free-Tier Anti-Sleep Optimization
  useEffect(() => {
    // Silently fire a fetch request to wake up the backend server
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/health`).catch(() => {
      // Ignore errors silently on the frontend
    });
  }, []);

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="internship" element={<InternshipPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="verify" element={<CertificateVerificationPage />} />

          {/* Legal Pages */}
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
          <Route path="cookie-policy" element={<CookiePolicyPage />} />
          
          {/* Protected Dashboards */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <StudentDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
