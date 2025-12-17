import React from 'react';
import './UseCases.css';

const useCaseData = [
    { number: 1, title: "Web Developers", desc: "Manage client projects, track milestones, and deliver on time with version control integration and agile boards." },
    { number: 2, title: "Designers & Agencies", desc: "Organize visual assets, share mockups directly with clients, and gather feedback seamlessly with annotation tools." },
    { number: 3, title: "Consultants", desc: "Track billable hours across multiple engagements, manage client relationships (CRM), and automate invoicing for time spent." },
    { number: 4, title: "Marketing Teams", desc: "Coordinate cross-platform campaigns, manage content calendars, and collaborate on copy and assets effortlessly." }
];

const UseCases = () => {
  return (
    <section className="use-cases-section" id="use-cases">
      <div className="use-cases-container">

        <div className="use-cases-content-column">
          <h2>Built for Your Workflow</h2>
          <p className="intro">
            From solo freelancers to small agencies, Freelance Flow provides dedicated features to handle client collaboration, time tracking, and project delivery.
          </p>

          <div className="use-case-list">
            {useCaseData.map((item) => (
              <div className="use-case-item" key={item.number}>
                <div className="use-case-number">{item.number}</div>
                <div className="use-case-details">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

  
        <div className="use-cases-visual-column">
          <img src="/img_2.png" alt="Project management dashboard illustration" />
        </div>

      </div>
    </section>
  );
};

export default UseCases;