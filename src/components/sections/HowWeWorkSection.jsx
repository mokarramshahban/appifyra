import React from 'react';

export default function HowWeWorkSection() {
  const steps = [
    {
      num: '01',
      title: 'Risk Assessment & Consultation',
      icon: '/assets/img/icon/work-icon01.png',
      img: '/assets/img/work/img01.png',
      hasArrow: true
    },
    {
      num: '02',
      title: 'Solution Design and Implementation',
      icon: '/assets/img/icon/work-icon02.png',
      img: '/assets/img/work/img02.png',
      hasArrow: true,
      isMiddle: true
    },
    {
      num: '03',
      title: 'Monitoring and Support',
      icon: '/assets/img/icon/work-icon03.png',
      img: '/assets/img/work/img03.png',
      hasArrow: false
    }
  ];

  return (
    <section className="work w-full bg-slate-50 dark:bg-[#060813] dark:bg-[url('/assets/img/bg/work-bg.png')] dark:bg-cover dark:bg-center">
      <div className="container">
        <div className="xb-work-wrap pos-rel pt-100 pb-155">
          <div className="sec-title--two sec-title--three text-center mb-60">
            <span className="sub-title wow fadeInDown bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4" data-wow-duration="600ms">
              <img src="/assets/img/icon/work.svg" alt="Work Icon" />
              <span>How we works</span>
            </span>
            <h2 className="title wow fadeInDown text-slate-900 font-bold dark:text-white" data-wow-duration="600ms">
              Our Comprehensive Workflow
            </h2>
          </div>

          <div className="row align-items-center">
            {steps.map((step, idx) => (
              <div className="col-lg-4 mt-30 d-inline-flex justify-content-center" key={idx}>
                <div className={`xb-work-item pos-rel ${step.isMiddle ? 'xb-work-item--middle' : ''}`}>
                  <div className="xb-item--ineer">
                    <div className="xb-item--icon">
                      <img src={step.icon} alt={step.title} />
                    </div>
                    <h4 className="xb-item--title text-slate-900 font-semibold dark:text-white">{step.title}</h4>
                  </div>
                  <div className="xb-img">
                    <img src={step.img} alt={step.title} />
                  </div>
                  <div className="xb-item--content">
                    <div className="xb-item--line">
                      <img src="/assets/img/icon/das-linee01.png" alt="Dashed Line" />
                    </div>
                    <span className="xb-item--number">{step.num}</span>
                  </div>
                  {step.hasArrow && (
                    <div className="xb-item--arrow">
                      <img src="/assets/img/icon/right-arrow.png" alt="Right Arrow" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
