import React, { useState } from "react";
import { useToast } from '../../context/ToastContext';
import "../user/Auth.css";
import "./OwnerAuth.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function OwnerLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            localStorage.clear();
            sessionStorage.clear();

            const res = await api.post('/auth/owner/login', {
                email,
                password
            });

            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('role', res.data.user.role);
            sessionStorage.setItem('userName', res.data.user.name);
            sessionStorage.setItem('userId', res.data.user.id);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);
            localStorage.setItem('userId', res.data.user.id);

            addToast("Logged in successfully! Welcome back.", 'success');
            navigate('/owner-dashboard', { replace: true });

        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.msg || "Login failed.", 'error');
        }
    };

    return (
        <div className="signin-container owner-mode">
            <div className="signin-left">
                <div className="signin-overlay">
                    <div className="signin-left-content">
                        <h1 className="signin-brand-title">Banquet Manager</h1>
                        <p className="signin-brand-tagline">Manage your venues and bookings with ease</p>
                    </div>
                </div>
            </div>
            <div className="signin-right">
                <div className="signin-header">
                    {/* Login Role Toggle */}
                    <div className="login-toggle-container">
                        <button className="login-toggle-btn" onClick={() => navigate('/signin')}>User Login</button>
                        <button className="login-toggle-btn active">Owner Login</button>
                    </div>

                    <h2 className="signin-welcome">Partner Login</h2>
                    <p className="signin-subtitle">Access your banquet management dashboard</p>
                </div>
                <div className="signin-card">
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="signin-button">Sign In as Owner</button>
                        <div className="signin-footer">
                            <p>Want to list your banquet?{" "}
                                <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); navigate('/owner-signup'); }}>
                                    Register here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OwnerLogin;
