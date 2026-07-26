import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section id="about" className="about pt-60 pb-100">
      <div className="container">
        <div className="cs-about-wrap pos-rel">
          <div className="row mt-none-60">
            <div className="col-lg-6 mt-60">
              <div className="cs-about_left">
                <div className="sec-title--two sec-title--three">
                  <span className="sub-title wow fadeInUp" data-wow-duration="600ms">
                    <img src="/assets/img/icon/magic02.svg" alt="Magic Icon" />
                    <span>About us</span>
                  </span>
                  <h2 className="title wow skewIn" data-wow-delay="150ms" data-wow-duration="600ms">
                    Empowering Your Digital Presence with Innovation
                  </h2>
                  <p className="content wow fadeInUp" data-wow-delay="300ms" data-wow-duration="600ms">
                    Appifyra is your trusted partner for innovative web development, app development, cloud services, graphic design, video editing, and data analytics. With a focus on delivering tailored digital solutions, we help businesses enhance their online presence and gain actionable insights to drive success in a rapidly evolving digital landscape.
                  </p>
                </div>
                <div className="xb-btn mt-85 wow fadeInUp" data-wow-delay="450ms" data-wow-duration="600ms">
                  <Link to="/contact" className="blc-btn">
                    <span>Get started now <i className="far fa-angle-right"></i></span>
                    <span className="btn-shape">
                      <svg width="271" height="60" viewBox="0 0 271 60" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 17.2308L20.1225 0.5H252.042L270.5 17.2217V43.7692L252.05 59.5H20.1225L0.5 42.7692V17.2308Z" fill="#010315" stroke="url(#paint0_linear_about1)" />
                        <defs>
                          <linearGradient id="paint0_linear_about1" x1="271" y1="61.5556" x2="232.791" y2="-3.08978" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#6780D2" />
                            <stop offset="1" stopColor="#2F3B8D" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="btn-shape2">
                      <svg width="362" height="78" viewBox="0 0 362 78" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 22.7183L25.5093 1.39453H337.972L361.5 22.7092V56.5515L337.98 76.6051H25.5093L0.5 55.2813V22.7183Z" fill="url(#paint0_linear_about2)" stroke="#23263C" />
                        <defs>
                          <linearGradient id="paint0_linear_about2" x1="1.29285" y1="38.9973" x2="362" y2="33.9973" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#431DAB" />
                            <stop offset="1" stopColor="#AE6DFE" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 mt-60">
              <div className="cs-about_right wow fadeInRight" data-wow-duration="600ms">
                <div className="xb-img">
                  <img src="/assets/img/about/img04.png" alt="About Appifyra" />
                </div>
                <div className="xb-content">
                  <div className="xb-item--img">
                    <img src="/assets/img/bg/abt-cnt_bg.png" alt="Counter Background" />
                  </div>
                  <div className="xb-item--inner">
                    <h3 className="xb-item--number">10+</h3>
                    <span className="xb-item--content">Our skilled team members dedicated to delivering excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xb-shape">
            <img src="/assets/img/bg/content_bg.png" alt="Content Background Shape" />
          </div>
        </div>
      </div>
    </section>
  );
}
