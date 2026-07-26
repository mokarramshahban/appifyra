import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const location = useLocation();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const isAdmin = currentUser?.email === 'appifyra@gmail.com';
  const profileRef = useRef(null);

  // Close menus on route change or outside click
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsMoreMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="xb-header-area" className="header-area header-style-three header-transparent" style={{ overflow: 'visible' }}>
      <div className={`xb-header stricky original ${isSticky ? 'stricky-fixed stricked-menu' : ''}`} style={{ overflow: 'visible' }}>
        <div className="container" style={{ overflow: 'visible' }}>
          <div className="header__wrap ul_li_between" style={{ overflow: 'visible' }}>
            {/* Logo */}
            <div className="header-logo">
              <Link to="/">
                <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra Logo" />
              </Link>
            </div>
            
            {/* Clean Desktop Navigation Bar */}
            <div className="main-menu__wrap ul_li navbar navbar-expand-xl">
              <nav className="main-menu collapse navbar-collapse" style={{ overflow: 'visible' }}>
                <ul style={{ overflow: 'visible' }}>
                  <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                      <span>Home</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
                      <span>About Us</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>
                      <span>Services</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/internship" className={({ isActive }) => isActive ? "active" : ""}>
                      <span>Internship</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
                      <span>Contact</span>
                    </NavLink>
                  </li>
                  
                  {/* Clean Explore Dropdown */}
                  <li 
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsMoreMenuOpen(true)}
                    onMouseLeave={() => setIsMoreMenuOpen(false)}
                  >
                    <a 
                      href="#!" 
                      onClick={(e) => e.preventDefault()} 
                      className={`d-flex align-items-center gap-1 ${isMoreMenuOpen ? "active" : ""}`}
                    >
                      <span>Explore</span>
                      <i className="far fa-angle-down" style={{ fontSize: '11px', transition: 'transform 0.2s', transform: isMoreMenuOpen ? 'rotate(180deg)' : 'none' }}></i>
                    </a>

                    {/* Explore Dropdown Submenu */}
                    {isMoreMenuOpen && (
                      <ul 
                        className="submenu" 
                        style={{ 
                          position: 'absolute',
                          display: 'block', 
                          opacity: 1, 
                          visibility: 'visible', 
                          top: '100%', 
                          left: 0,
                          minWidth: '210px',
                          backgroundColor: '#090536',
                          border: '1px solid rgba(174, 109, 254, 0.3)',
                          borderRadius: '12px',
                          padding: '10px 0',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                          zIndex: 9999
                        }}
                      >
                        <li>
                          <Link to="/verify" className="py-2 px-3 text-white d-flex align-items-center gap-2">
                            <i className="far fa-certificate" style={{ color: '#38bdf8' }}></i>
                            <span>Verify Certificate</span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              </nav>

              {/* User Profile & Auth Widget */}
              <div className="ms-4 d-none d-xl-block" ref={profileRef} style={{ position: 'relative' }}>
                {currentUser ? (
                  <div style={{ position: 'relative' }}>
                    <div 
                      className="d-flex align-items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      style={{ 
                        cursor: 'pointer', 
                        padding: '4px 12px 4px 6px', 
                        borderRadius: '30px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <UserAvatar name={currentUser.displayName || currentUser.email} size={28} />
                      <span className="text-white" style={{ fontSize: '13px', fontWeight: '500', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.displayName?.split(' ')[0] || 'User'}
                      </span>
                      <i className="far fa-angle-down text-white-50" style={{ fontSize: '11px', transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}></i>
                    </div>

                    {/* Floating Overlay Profile Dropdown */}
                    {isProfileMenuOpen && (
                      <div 
                        className="p-3 text-white"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 10px)',
                          right: 0,
                          minWidth: '220px',
                          backgroundColor: '#090536',
                          border: '1px solid rgba(174, 109, 254, 0.4)',
                          borderRadius: '16px',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
                          zIndex: 9999
                        }}
                      >
                        <div className="pb-2 mb-2 d-flex align-items-center gap-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <UserAvatar name={currentUser.displayName || currentUser.email} size={32} />
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600' }}>{currentUser.displayName}</div>
                            <div className="text-muted" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                          </div>
                        </div>

                        <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
                          <li className="mb-2">
                            <Link 
                              to={isAdmin ? "/admin" : "/dashboard"} 
                              className="text-white d-flex align-items-center gap-2 py-1"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <i className={`fas ${isAdmin ? 'fa-user-shield text-success' : 'fa-th-large text-primary'}`}></i>
                              <span>{isAdmin ? "Admin Panel" : "My Dashboard"}</span>
                            </Link>
                          </li>
                          <li className="mb-2">
                            <Link 
                              to="/verify" 
                              className="text-white d-flex align-items-center gap-2 py-1"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <i className="far fa-certificate text-info"></i>
                              <span>Verify Certificate</span>
                            </Link>
                          </li>
                          <li className="pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <button 
                              onClick={logout} 
                              className="btn btn-sm btn-outline-danger w-100 text-start d-flex align-items-center gap-2"
                              style={{ borderRadius: '8px', fontSize: '12px' }}
                            >
                              <i className="fas fa-sign-out-alt"></i> Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={loginWithGoogle} 
                    className="btn btn-sm text-white" 
                    style={{
                      background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      padding: '6px 18px'
                    }}
                  >
                    <i className="fab fa-google me-1"></i> Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Header Buttons */}
            <div className="header-bar-mobile side-menu d-xl-none d-flex align-items-center gap-2">
              {currentUser ? (
                <button 
                  onClick={logout} 
                  className="btn btn-sm btn-outline-light me-2" 
                  style={{ borderRadius: '15px', fontSize: '11px' }}
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={loginWithGoogle} 
                  className="btn btn-sm text-white me-2" 
                  style={{ background: '#431DAB', borderRadius: '15px', fontSize: '11px' }}
                >
                  Sign In
                </button>
              )}
              <button 
                className={`xb-nav-mobile ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={toggleMobileMenu}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
                aria-label="Toggle Navigation"
              >
                <i className="far fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`xb-header-wrap ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className={`xb-header-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="xb-header-menu-scroll">
            <div 
              className="xb-menu-close xb-hide-xl xb-close" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="xb-logo-mobile xb-hide-xl">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/assets/img/logo/appifyra.png" alt="Appifyra Mobile Logo" />
              </Link>
            </div>
            
            <nav className="xb-header-nav">
              <ul className="xb-menu-primary clearfix">
                <li>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}><span>Home</span></Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}><span>About Us</span></Link>
                </li>
                <li>
                  <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}><span>Services</span></Link>
                </li>
                <li>
                  <Link to="/internship" onClick={() => setIsMobileMenuOpen(false)}><span>Internship</span></Link>
                </li>
                <li>
                  <Link to="/verify" onClick={() => setIsMobileMenuOpen(false)}><span>Verify Certificate</span></Link>
                </li>
                {currentUser && (
                  <li>
                    <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                      <span>{isAdmin ? "Admin Panel" : "My Dashboard"}</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}><span>Contact</span></Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div 
          className={`xb-header-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      </div>
    </header>
  );
}
