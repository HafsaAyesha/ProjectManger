import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="section-header">
        <h2>Simple, Transparent Pricing</h2>
        <p>Choose the plan that fits your needs. Always flexible, always fair.</p>
      </div>
      <div className="pricing-grid">
        {/* Starter */}
        <div className="pricing-card">
          <h3>Starter</h3>
          <p>Perfect for solo freelancers</p>
          <div className="price">$29<span>/month</span></div>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> Up to 3 projects</li>
            <li><i className="fa-solid fa-check"></i> 5 team members</li>
            <li><i className="fa-solid fa-check"></i> Basic reporting</li>
            <li><i className="fa-solid fa-check"></i> Email support</li>
          </ul>
          <button className="pricing-btn secondary">Get Started</button>
        </div>

        {/* Pro */}
        <div className="pricing-card featured">
          <div className="badge">MOST POPULAR</div>
          <h3>Professional</h3>
          <p>For growing freelancers</p>
          <div className="price">$79<span>/month</span></div>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> Unlimited projects</li>
            <li><i className="fa-solid fa-check"></i> 20 team members</li>
            <li><i className="fa-solid fa-check"></i> Advanced analytics</li>
            <li><i className="fa-solid fa-check"></i> Priority support</li>
            <li><i className="fa-solid fa-check"></i> Integrations</li>
          </ul>
          <button className="pricing-btn primary">Start Free Trial</button>
        </div>

        {/* Enterprise */}
        <div className="pricing-card">
          <h3>Enterprise</h3>
          <p>For larger teams</p>
          <div className="price">$199<span>/month</span></div>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> Everything in Pro</li>
            <li><i className="fa-solid fa-check"></i> Unlimited team members</li>
            <li><i className="fa-solid fa-check"></i> Custom integrations</li>
            <li><i className="fa-solid fa-check"></i> Dedicated support</li>
            <li><i className="fa-solid fa-check"></i> SSO & advanced security</li>
          </ul>
          <button className="pricing-btn secondary">Contact Sales</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;