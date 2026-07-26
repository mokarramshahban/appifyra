import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`xb-backtotop style-3 ${active ? 'active' : ''}`}>
      <a href="#top" className="scroll" onClick={scrollToTop}>
        <i className="far fa-arrow-up"></i>
      </a>
    </div>
  );
}
