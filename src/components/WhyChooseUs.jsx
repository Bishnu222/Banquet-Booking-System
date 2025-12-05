import React from 'react'
import './WhyChooseUs.css'

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#3B82F6"/>
          <path d="M20 18H44C45.1 18 46 18.9 46 20V44C46 45.1 45.1 46 44 46H20C18.9 46 18 45.1 18 44V20C18 18.9 18.9 18 20 18Z" stroke="white" strokeWidth="2.5" fill="none"/>
          <path d="M18 26H46" stroke="white" strokeWidth="2.5"/>
          <path d="M28 18V46" stroke="white" strokeWidth="2.5"/>
          <path d="M36 18V46" stroke="white" strokeWidth="2.5"/>
          <circle cx="32" cy="36" r="4" fill="white"/>
        </svg>
      ),
      title: 'Easy Booking',
      description: 'Simple and intuitive booking process in just a few clicks.'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#8B5CF6"/>
          <path d="M32 20C28.7 20 26 22.7 26 26C26 29.3 28.7 32 32 32C35.3 32 38 29.3 38 26C38 22.7 35.3 20 32 20Z" fill="white"/>
          <path d="M22 40C22 35.6 26.5 32 32 32C37.5 32 42 35.6 42 40V44H22V40Z" fill="white"/>
          <path d="M48 40C48 36.7 45.3 34 42 34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M52 44V40C52 36.7 49.3 34 46 34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Multiple Venues',
      description: 'Choose from our selection of premium banquet halls.'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#10B981"/>
          <circle cx="32" cy="32" r="14" stroke="white" strokeWidth="2.5" fill="none"/>
          <path d="M32 24V32L38 38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Real-time Availability',
      description: 'Check availability and book your preferred date instantly.'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#F59E0B"/>
          <path d="M32 18L36.5 28.5L48 30.5L40 38.5L42 50L32 44.5L22 50L24 38.5L16 30.5L27.5 28.5L32 18Z" fill="white"/>
        </svg>
      ),
      title: 'Premium Service',
      description: 'Dedicated support team to help plan your perfect event.'
    }
  ]

  return (
    <section className="why-choose-us">
      <div className="container">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">
          We make event planning effortless with our comprehensive booking system
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs

