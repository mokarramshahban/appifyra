import React from 'react';

export default function StudentAmbassadorSection() {
  return (
    <section id="stu-amb" className="testimonial pt-160 pos-rel z-1">
      <div className="container">
        <div className="cs-tes_wrap">
          {/* Section Title */}
          <div className="sec-title--two sec-title--three text-center mb-175">
            <span className="sub-title wow fadeInDown" data-wow-duration="600ms">
              <img src="/assets/img/icon/like-tag.svg" alt="Like Tag Icon" />
              <span>Student Program</span>
            </span>
            <h2 className="title wow fadeInDown" data-wow-duration="600ms">
              Student Ambassador Program
            </h2>
          </div>

          {/* Content Section */}
          <div className="cs-tes-content">
            <div className="cs-testimonial-slider">
              <div className="cs-tes-item row">
                {/* Left Section */}
                <div className="col-12 col-md-6 mb-4 mb-md-0 xb-centre-item d-flex justify-content-center align-items-center">
                  <div className="xb-item--img text-center">
                    <img 
                      src="/assets/img/icon/trophy.svg" 
                      alt="Student Ambassador Trophy" 
                      className="img-fluid" 
                      style={{ maxWidth: '600px', maxHeight: '400px' }}
                    />
                  </div>
                </div>

                {/* Right Section (Text Content) */}
                <div className="col-12 col-md-6 mb-4 mb-md-0 xb-right-item">
                  <p className="xb-item--content">
                    Become an Appifyra Student Ambassador to develop leadership skills, represent Appifyra on campus, and gain exclusive perks. This is your chance to grow as a leader while helping us expand our presence at your college.
                  </p>
                  <div className="xb-item--author">
                    <span className="xb-item--name">Applications Closing Soon!</span>
                    <span className="xb-item--desig">Don’t miss the chance to shine and lead your college.</span>
                  </div>
                  <div className="xb-item--holder ul_li">
                    <div className="xb-item--time">
                      <span className="xb-item--number">#1</span>
                      <span className="xb-item--text">Be a campus leader and <br /> grow your skills.</span>
                    </div>
                    <div className="xb-item--time">
                      <span className="xb-item--number">100%</span>
                      <span className="xb-item--text">Exclusive recognition and <br /> opportunities await you.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div className="xb-btn text-center mt-60">
            <a 
              href="https://forms.gle/LEnYZMxRQpFfvySV9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="blc-btn"
            >
              <span>Apply Now <i className="far fa-angle-right"></i></span>
              <span className="btn-shape">
                <svg width="362" height="78" viewBox="0 0 362 78" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.5 22.7183L25.5093 1.39453H337.972L361.5 22.7092V56.5515L337.98 76.6051H25.5093L0.5 55.2813V22.7183Z" fill="url(#paint0_linear_1600_stu_btn)" stroke="#23263C"></path>
                  <defs>
                    <linearGradient id="paint0_linear_1600_stu_btn" x1="1.29285" y1="38.9973" x2="362" y2="33.9973" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#431DAB"></stop>
                      <stop offset="1" stopColor="#AE6DFE"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="cs-tes-shape">
        <div className="shape shape--one">
          <img src="/assets/img/shape/linea-bg-shape.png" alt="Line Shape" />
        </div>
        <div className="shape shape--two">
          <img className="world" src="/assets/img/shape/world.png" alt="World Shape" />
        </div>
        <div className="shape shape--three">
          <img src="/assets/img/shape/linear-shape.png" alt="Linear Shape" />
        </div>
      </div>
    </section>
  );
}
