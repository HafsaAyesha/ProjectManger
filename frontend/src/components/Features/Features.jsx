import React from 'react';

const Features = () => {
  const features = [
    { icon: "fa-list-check", title: "Task Management", desc: "Create, organize, and track tasks with ease." },
    { icon: "fa-chart-gantt", title: "Timeline View", desc: "Visualize your projects with Gantt charts and timelines." },
    { icon: "fa-comments", title: "Client Collaboration", desc: "Communicate directly with clients seamlessly." },
    { icon: "fa-clock", title: "Time Tracking", desc: "Log hours spent on projects for accurate billing." },
    { icon: "fa-file-invoice", title: "Invoicing", desc: "Create professional invoices in seconds." },
    { icon: "fa-chart-pie", title: "Analytics & Reports", desc: "Get insights into your productivity and performance." },
  ];

  return (
    <section className="features" id="features">
      <div className="section-header">
        <h2>Powerful Features for Every Freelancer</h2>
        <p>Everything you need to manage projects, collaborate with clients, and grow your business.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon"><i className={`fa-solid ${feature.icon}`}></i></div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;