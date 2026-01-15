import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-header">
                    <h1 className="legal-title">Terms & Conditions</h1>
                    <p className="legal-subtitle">Last updated: December 2025</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Banquet Booking. By accessing our website and using our services, you agree to be bound by the following terms and conditions. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2>2. Booking Services</h2>
                        <p>
                            Banquet Booking acts as an intermediary between you (the "User") and venue owners. We facilitate the booking process but are not the owners or operators of the venues listed.
                        </p>
                        <p>
                            When you make a booking, you are entering into a direct contract with the venue owner. We are not responsible for the performance of the venue owner's obligations.
                        </p>
                    </section>

                    <section>
                        <h2>3. User Responsibilities</h2>
                        <p>
                            You agree to provide accurate and complete information when creating an account or making a booking. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2>4. Payments and Cancellations</h2>
                        <p>
                            Payment terms are determined by the individual venues. Deposit requirements and cancellation policies are displayed on the booking page for each venue.
                        </p>
                        <p>
                            Refunds, if applicable, are processed according to the specific venue's cancellation policy.
                        </p>
                    </section>

                    <section>
                        <h2>5. Venue Owner Obligations</h2>
                        <p>
                            Venue owners must ensure that their listings are accurate and that they can provide the facilities and services described. They are responsible for the safety and compliance of their venues with local regulations.
                        </p>
                    </section>

                    <section>
                        <h2>6. Limitation of Liability</h2>
                        <p>
                            Banquet Booking shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services or any booking made through our platform.
                        </p>
                    </section>

                    <section>
                        <h2>7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2>8. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at support@banquetbooking.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
