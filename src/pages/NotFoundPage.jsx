import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="main-area fix pt-120 pb-120 bg-slate-50 dark:bg-[#060813]" style={{ marginTop: '100px', marginBottom: '100px', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
        <h2 className="title mb-40">Page Not Found</h2>
        <p className="mb-4">Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
        <Link to="/" className="btn bg-blue-100 text-blue-900 border border-blue-200 shadow-sm dark:bg-blue-600 dark:text-white dark:border-none hover:bg-blue-200 dark:hover:bg-blue-700 font-semibold" style={{ padding: '15px 30px', background: 'var(--tg-theme-primary)', color: 'var(--color-text-main)', borderRadius: '5px' }}>
          Back to Homepage
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
