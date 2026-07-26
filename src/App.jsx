import React from 'react';
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

export default function App() {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="internship" element={<InternshipPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="verify" element={<CertificateVerificationPage />} />
          
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

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}
