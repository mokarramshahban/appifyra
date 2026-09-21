import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  return (
    <main className="main-area fix pt-120 pb-120 bg-slate-50 dark:bg-[#060813]" style={{ marginTop: '100px', marginBottom: '100px',   }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="title mb-40 text-main text-slate-900 dark:text-white font-extrabold">Cookie Policy</h2>
            <div className="content text-slate-900 dark:text-white">
              <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              <h4 className="mt-4 text-main text-slate-900 dark:text-white font-bold">1. What Are Cookies</h4>
              <p className="text-slate-700 dark:text-slate-300">As is common practice with almost all professional websites, this site uses cookies, which are small text files stored on your device, to improve your experience.</p>
              <h4 className="mt-4 text-main text-slate-900 dark:text-white font-bold">2. How We Use Cookies</h4>
              <p className="text-slate-700 dark:text-slate-300">We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
              <h4 className="mt-4 text-main text-slate-900 dark:text-white font-bold">3. Disabling Cookies</h4>
              <p className="text-slate-700 dark:text-slate-300">You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CookiePolicyPage;
