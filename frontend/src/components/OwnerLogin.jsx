import React, { useState } from "react";
import "./OwnerAuth.css"; // Import the new dedicated CSS
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function OwnerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });

            const userRole = res.data.user.role;
            if (userRole !== 'owner' && userRole !== 'admin') {
                alert("Access Denied: Partner Portal is for banquet owners only.");
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', userRole);

            if (userRole === 'admin') navigate('/admin-dashboard');
            else navigate('/owner-dashboard');

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.msg || err.message || "Login failed";
            alert(errorMessage);
        }
    };

    return (
        <div className="owner-auth-container">
            {/* Form Side (Left for owners, distinct from User login) */}
            <div className="owner-auth-form-side">
                <div className="owner-auth-card">
                    <div className="owner-auth-header">
                        {/* Auth Switch Buttons */}
                        <div className="auth-switch-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '5px', background: '#f8fafc', borderRadius: '8px', width: 'fit-content', border: '1px solid #e2e8f0', margin: '0 auto 1.5rem auto' }}>
                            <button
                                className="auth-switch-btn"
                                style={{ background: 'transparent', color: '#666', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                onClick={() => navigate('/signin')}
                            >
                                User Login
                            </button>
                            <button
                                className="auth-switch-btn active"
                                style={{ background: '#1a237e', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'default', fontWeight: '600' }}
                                disabled
                            >
                                Owner Login
                            </button>
                        </div>

                        <h2 className="owner-auth-welcome">Banquet Ownwer Login</h2>
                        <p className="owner-auth-subtitle">
                            Access your business dashboard
                        </p>
                    </div>

                    <form className="owner-auth-form" onSubmit={handleSubmit}>
                        <div className="owner-form-group">
                            <label htmlFor="email">Business Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter Email"
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="owner-options">
                            <label className="owner-checkbox">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember Device
                            </label>
                            <a href="#" className="owner-link" style={{ fontSize: '0.9rem' }}>Forgot Password?</a>
                        </div>

                        <button type="submit" className="owner-btn">
                            Login
                        </button>

                        <div className="owner-footer">
                            New to our platform?
                            <Link to="/owner-signup" className="owner-link">
                                SignUp Here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Brand Side (Right for owners) */}
            <div className="owner-auth-brand-side">
                <div className="owner-auth-brand-content">
                    <h1 className="owner-auth-title">Banquet Owner</h1>
                    <p className="owner-auth-tagline">
                        "Elevate your venue business with our premium booking management solutions."
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OwnerLogin;
