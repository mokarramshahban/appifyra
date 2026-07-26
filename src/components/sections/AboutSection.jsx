import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section id="about" className="about pt-60 pb-100 pos-rel">
      <div className="container">
        <div className="cs-about-wrap pos-rel">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="cs-about_left">
                <div className="sec-title--two sec-title--three">
                  <span className="sub-title">
                    <img src="/assets/img/icon/magic02.svg" alt="Magic Icon" />
                    <span>About us</span>
                  </span>
                  <h2 className="title text-white" style={{ fontWeight: '800', fontSize: '36px' }}>
                    Empowering Your Digital Presence with Innovation
                  </h2>
                  <p className="content mt-3" style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7' }}>
                    Appifyra is your trusted partner for innovative web development, app development, cloud services, graphic design, video editing, and data analytics. With a focus on delivering tailored digital solutions, we help businesses enhance their online presence and gain actionable insights to drive success in a rapidly evolving digital landscape.
                  </p>
                </div>
                <div className="xb-btn mt-4">
                  <Link to="/contact" className="btn btn-primary px-4 py-3" style={{ borderRadius: '12px', fontWeight: '700' }}>
                    <span>Get started now <i className="far fa-angle-right ms-2"></i></span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="cs-about_right pos-rel text-center">
                <div 
                  className="p-4 text-white d-inline-block w-100"
                  style={{
                    borderRadius: '24px',
                    backgroundColor: 'rgba(15, 18, 41, 0.75)',
                    border: '1px solid rgba(174, 109, 254, 0.3)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <img 
                    src="/assets/img/about/img04.png" 
                    alt="About Appifyra" 
                    className="img-fluid mb-4"
                    style={{ borderRadius: '16px', maxHeight: '280px', objectFit: 'cover' }}
                  />
                  <div className="d-flex align-items-center justify-content-center gap-3 p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px' }}>
                    <h3 className="text-primary mb-0" style={{ fontWeight: '800', fontSize: '32px' }}>10+</h3>
                    <span className="text-white text-start" style={{ fontSize: '14px', maxWidth: '280px' }}>
                      Skilled team members dedicated to engineering excellence.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
