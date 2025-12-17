import React from 'react';
import './Features.css'; // Import the CSS file

const featureData = [
    { icon: 'fa-list-check', title: 'Task Management', description: 'Create, organize, and track tasks with ease. Set priorities, deadlines, and assign team members.' },
    { icon: 'fa-chart-gantt', title: 'Timeline View', description: 'Visualize your projects with Gantt charts and timelines. Stay on track with real-time updates.' },
    { icon: 'fa-comments', title: 'Client Collaboration', description: 'Communicate directly with clients. Share updates, get feedback, and keep everyone in sync.' },
    { icon: 'fa-clock', title: 'Time Tracking', description: 'Log hours spent on projects. Generate accurate invoices and reports for billing.' },
    { icon: 'fa-file-invoice', title: 'Invoicing', description: 'Create professional invoices in seconds. Automate billing and track payments.' },
    { icon: 'fa-chart-pie', title: 'Analytics & Reports', description: 'Get insights into your productivity and project performance with detailed analytics.' },
];

const Features = () => {
    return (
        <section className="features" id="features">
            <div className="section-header">
                <h2>Powerful Features for Every Freelancer</h2>
                <p>Everything you need to manage projects, collaborate with clients, and grow your business.</p>
            </div>
            <div className="features-grid">
                {featureData.map((feature, index) => (
                    <div className="feature-card" key={index}>
                        <div className="feature-icon">
                            {/* Note: Requires a library like Font Awesome to be included in your project */}
                            <i className={`fa-solid ${feature.icon}`}></i>
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;