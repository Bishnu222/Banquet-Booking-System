import React from 'react'
import './Venues.css'

const Venues = () => {
  const venues = [
    {
      id: 1,
      name: 'Grand Palace Hall',
      description: 'Traditional elegance meets modern amenities',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      name: 'Classic Ballroom',
      description: 'European-style architecture with timeless charm',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      name: 'Garden Pavilion',
      description: 'Outdoor elegance with poolside views',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      name: 'Modern Event Center',
      description: 'Contemporary design with state-of-the-art facilities',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    }
  ]

  return (
    <section className="venues">
      <div className="container">
        <h2 className="section-title">Our Venues in Nepal</h2>
        <p className="section-subtitle">
          Explore our elegant spaces across Kathmandu and beyond!
        </p>
        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <div className="venue-image-container">
                <img src={venue.image} alt={venue.name} className="venue-image" />
              </div>
              <div className="venue-info">
                <h3 className="venue-name">{venue.name}</h3>
                <p className="venue-description">{venue.description}</p>
                <button className="venue-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Venues

