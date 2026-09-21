import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="main-area fix pt-120 pb-120" style={{ marginTop: '100px', marginBottom: '100px', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
        <h2 className="title mb-40">Page Not Found</h2>
        <p className="mb-4">Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
        <Link to="/" className="btn bg-blue-600 text-white hover:bg-blue-700 shadow-md dark:bg-blue-600/80 font-semibold" style={{ padding: '15px 30px', background: 'var(--tg-theme-primary)', color: 'var(--color-text-main)', borderRadius: '5px' }}>
          Back to Homepage
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
