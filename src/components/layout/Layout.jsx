import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Preloader from '../common/Preloader';

export default function Layout() {
  return (
    <div className="body_wrap bg-white dark:bg-[#060813] !text-slate-900 dark:text-slate-100 min-h-screen">
      <Preloader />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
