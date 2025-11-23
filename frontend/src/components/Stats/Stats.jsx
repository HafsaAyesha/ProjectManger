import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { icon: "fa-check", number: "500+", text: "Projects Completed" },
    { icon: "fa-users", number: "1000+", text: "Happy Freelancers" },
    { icon: "fa-clock", number: "50%", text: "Time Saved" },
    { icon: "fa-chart-line", number: "99%", text: "Client Satisfaction" },
  ];

  return (
    <section id="statistics" className="header-info">
      {stats.map((stat, index) => (
        <div className="info" key={index}>
          <div className="icon"><i className={`fa-solid ${stat.icon}`}></i></div>
          <h2>{stat.number}</h2>
          <p>{stat.text}</p>
        </div>
      ))}
    </section>
  );
};

export default Stats;
