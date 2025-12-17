import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    { text: "Freelance Flow transformed how I manage my projects. I've cut down project management time by 50% and my clients love the transparency.", name: "Sarah Kumar", role: "Web Developer", initials: "SK" },
    { text: "Finally, a project management tool built for freelancers. The invoicing feature alone has saved me hours every month.", name: "Michael Chen", role: "UI/UX Designer", initials: "MC" },
    { text: "The time tracking and reporting features are incredible. My billing is now accurate and my clients are happier with detailed project breakdowns.", name: "Emma Rodriguez", role: "Content Strategist", initials: "EM" },
  ];

  // Duplicate testimonials for an infinite-scroll visual effect (3 originals + 3 copies = 6 total)
  const infiniteTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="testimonials" id="testimonials">
      <div className="section-header">
        <h2>Loved by Freelancers Worldwide</h2>
        <p>See what our users have to say about Freelance Flow.</p>
      </div>
      

      <div className="carousel-container">
        <div className="carousel-track">
          {infiniteTestimonials.map((t, index) => (
            <div 
              className="testimonial-card" 
              key={index}
              data-card-index={index % testimonials.length}
            >
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div className="author-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;