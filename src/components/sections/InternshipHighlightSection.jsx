import React from 'react';
import { Link } from 'react-router-dom';

export default function InternshipHighlightSection() {
  const summerFeatures = [
    'Hands-on Live Project Modules',
    '1-on-1 Senior Developer Mentorship',
    'University Summer Training NOC Support',
    'Official Verifiable Completion Certificate'
  ];

  const semesterFeatures = [
    'Full Software Development Lifecycle Exposure',
    'Real Production Architecture & Code Reviews',
    'University Semester Project File & NOC Clearance',
    'Job Placement Assistance & PPO Opportunity'
  ];

  return (
    <section className="pt-100 pb-100 pos-rel" style={{ backgroundColor: 'rgba(9, 5, 54, 0.4)' }}>
      <div className="container">
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span className="sub-title">
            <img src="/assets/img/icon/cap.svg" alt="Cap" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
            <span>UNIVERSITY ALIGNED TRAINING</span>
          </span>
          <h2 className="title text-white mb-2" style={{ fontWeight: '800' }}>Industry Internship & Industrial Training</h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: '#9da1b4', fontSize: '15px' }}>
            Work on live production software, receive 1-on-1 mentorship from industry engineers, and fulfill your university CS/Engineering degree requirements.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* 45-Day Track */}
          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 text-white h-100 d-flex flex-column justify-content-between"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(103, 128, 210, 0.4)',
                background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.3) 0%, rgba(1, 3, 21, 0.95) 100%)',
                boxShadow: '0 20px 40px rgba(67, 29, 171, 0.2)'
              }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge px-3 py-2" style={{ backgroundColor: '#431DAB', color: '#fff', fontSize: '12px', letterSpacing: '0.5px' }}>
                    SUMMER / SHORT-TERM
                  </span>
                  <span style={{ color: '#ae6dfe', fontWeight: '800', fontSize: '20px' }}>45 Days Track</span>
                </div>

                <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>45-Day Practical Internship</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Intensive hands-on module guidance, live mini-project building, and official completion certificate for summer training requirements.
                </p>

                <div className="mb-4">
                  {summerFeatures.map((feat, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '14px', color: '#e0e7ff' }}>
                      <i className="fas fa-check-circle" style={{ color: '#4ade80' }}></i>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/internship" className="btn btn-outline-light w-100 py-3" style={{ borderRadius: '12px', fontWeight: '700' }}>
                View 45-Day Track Details <i className="far fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>

          {/* 6-Month Track */}
          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 text-white h-100 d-flex flex-column justify-content-between"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(174, 109, 254, 0.4)',
                background: 'linear-gradient(135deg, rgba(174, 109, 254, 0.25) 0%, rgba(1, 3, 21, 0.95) 100%)',
                boxShadow: '0 20px 40px rgba(174, 109, 254, 0.2)'
              }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge px-3 py-2" style={{ backgroundColor: '#AE6DFE', color: '#000', fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px' }}>
                    SEMESTER INDUSTRIAL
                  </span>
                  <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '20px' }}>6 Months Track</span>
                </div>

                <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>6-Month Semester Training</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Full software development lifecycle exposure for final-year engineering students. Work with senior leads and receive placement assistance.
                </p>

                <div className="mb-4">
                  {semesterFeatures.map((feat, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '14px', color: '#e0e7ff' }}>
                      <i className="fas fa-check-circle" style={{ color: '#4ade80' }}></i>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/internship" className="btn btn-primary w-100 py-3" style={{ background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)', border: 'none', borderRadius: '12px', fontWeight: '700' }}>
                View 6-Month Track Details <i className="far fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
