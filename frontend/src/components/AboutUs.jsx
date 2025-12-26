import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-header">
                    <h1 className="legal-title">About Us</h1>
                    <p className="legal-subtitle">Bringing people together in perfect spaces.</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>Our Mission</h2>
                        <p>
                            At Banquet Booking, our mission is to simplify the process of finding and booking the perfect venue for life's most important moments. Whether it's a dream wedding, a corporate gala, or an intimate birthday celebration, we believe that the right setting sets the tone for unforgettable memories.
                        </p>
                    </section>

                    <section>
                        <h2>Who We Are</h2>
                        <p>
                            Founded in 2025, we are a team of event enthusiasts and tech innovators based in Kathmandu, Nepal. We recognized the frustration of visiting multiple venues, making endless phone calls, and dealing with opaque pricing. We set out to create a transparent, user-friendly platform that connects venue owners directly with customers.
                        </p>
                    </section>

                    <section>
                        <h2>What We Do</h2>
                        <p>
                            We provide a comprehensive marketplace where you can browse, compare, and book luxury banquet halls and event spaces. Our platform offers:
                        </p>
                        <ul>
                            <li>High-quality images and virtual tours of venues.</li>
                            <li>Transparent pricing and package details.</li>
                            <li>Real-time availability checking.</li>
                            <li>Secure online booking management.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Our Values</h2>
                        <p>
                            <strong>Trust:</strong> We verify every venue to ensure quality and reliability.<br />
                            <strong>Simplicity:</strong> We design for ease of use, removing the stress from event planning.<br />
                            <strong>Community:</strong> We support local businesses and help them grow by connecting them with the right audience.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
