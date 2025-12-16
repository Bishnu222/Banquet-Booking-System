import React, { useState } from "react";
import "./OwnerAuth.css"; // Import the new dedicated CSS
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function OwnerSignup() {
    const navigate = useNavigate();
    // State for the fields requested: Venue Name, Location, Phone, Email, Password
    const [businessName, setBusinessName] = useState(""); // Venue Name
    const [location, setLocation] = useState("");         // Location
    const [phone, setPhone] = useState("");               // Phone Number
    const [email, setEmail] = useState("");               // Email
    const [password, setPassword] = useState("");         // Password

    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                name: businessName, // Using Venue Name as main Name for now
                businessName,
                location,
                phone,
                email,
                password,
                role: 'owner'
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);

            navigate('/owner-dashboard');

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.msg || err.message || "Registration failed";
            alert(errorMessage);
        }
    };

    return (
        <div className="owner-auth-container">
            {/* Form Side */}
            <div className="owner-auth-form-side">
                <div className="owner-auth-card">
                    <div className="owner-auth-header">
                        {/* Auth Switch Buttons */}
                        <div className="auth-switch-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '5px', background: '#f8fafc', borderRadius: '8px', width: 'fit-content', border: '1px solid #e2e8f0', margin: '0 auto 1.5rem auto' }}>
                            <button
                                className="auth-switch-btn"
                                style={{ background: 'transparent', color: '#666', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                onClick={() => navigate('/signup')}
                            >
                                User Signup
                            </button>
                            <button
                                className="auth-switch-btn active"
                                style={{ background: '#1a237e', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'default', fontWeight: '600' }}
                                disabled
                            >
                                Owner Signup
                            </button>
                        </div>
                        <h2 className="owner-auth-welcome">Banquet Owner</h2>
                        <p className="owner-auth-subtitle">
                            Join our network of premium venues
                        </p>
                    </div>

                    <form className="owner-auth-form" onSubmit={handleSubmit}>

                        <div className="owner-form-group">
                            <label htmlFor="businessName">Venue Name</label>
                            <input
                                id="businessName"
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                required
                                placeholder="Ex. Grand Palace Hall"
                            />
                        </div>

                        <div className="owner-form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                placeholder="City, Area"
                            />
                        </div>

                        <div className="owner-form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="+977-98..."
                            />
                        </div>

                        <div className="owner-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="owner-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="owner-form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="owner-options">
                            <label className="owner-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    required
                                />
                                <span>I agree to the <a href="#" className="owner-link">Terms of Banquets</a></span>
                            </label>
                        </div>

                        <button type="submit" className="owner-btn">
                            Register Venue
                        </button>

                        <div className="owner-footer">
                            Already a partner?
                            <Link to="/owner-login" className="owner-link">
                                Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Brand Side */}
            <div className="owner-auth-brand-side">
                <div className="owner-auth-brand-content">
                    <h1 className="owner-auth-title">Grow With Us</h1>
                    <p className="owner-auth-tagline">
                        "Connect with thousands of clients looking for the perfect venue for their special moments."
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OwnerSignup;
