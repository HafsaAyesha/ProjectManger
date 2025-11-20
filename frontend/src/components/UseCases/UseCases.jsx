import React from 'react';
import './UseCases.css';

const UseCases = () => {
  return (
    /* We apply the background image here so React looks in the 'public' folder */
    <section className="use-cases" style={{ backgroundImage: 'url(/img_2.jpeg)' }}>
      <div className="use-cases-content">
        <div className="text-box">
          <h2>Built for Your Workflow</h2>
          <p className="intro">
            Whether you're a solo freelancer or managing a team, Freelance Flow adapts to your needs.
          </p>
          {[
            { title: "1. Web Developers", desc: "Manage client projects, track milestones, and deliver on time with version control integration." },
            { title: "2. Designers", desc: "Organize projects, share mockups with clients, and iterate based on feedback seamlessly." },
            { title: "3. Consultants", desc: "Track engagements, billable hours, and deliverables in one centralized platform." },
            { title: "4. Marketing Teams", desc: "Coordinate campaigns, manage content calendars, and collaborate effortlessly." }
          ].map((item, index) => (
            <div className="use-case-item" key={index}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;