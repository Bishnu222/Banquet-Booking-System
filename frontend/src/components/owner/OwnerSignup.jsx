import React, { useState } from "react";
import { useToast } from '../../context/ToastContext';
import "../user/Auth.css";
import "./OwnerAuth.css";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function OwnerSignup() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({

        email: "",
        password: "",
        businessName: "",
        phone: "",
        location: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            addToast("Password must be at least 8 characters long", 'error');
            return;
        }

        try {
            const res = await api.post('/auth/owner/signup', formData);

            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('role', res.data.user.role);
            sessionStorage.setItem('userName', res.data.user.name);
            sessionStorage.setItem('userId', res.data.user.id);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);
            localStorage.setItem('userId', res.data.user.id);

            addToast("Account created successfully! Welcome partner.", 'success');
            navigate('/owner-dashboard', { replace: true });
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.msg || "Signup failed.", 'error');
        }
    };

    return (
        <div className="signin-container owner-mode">
            <div className="signin-left">
                <div className="signin-overlay">
                    <div className="signin-left-content">
                        <h1 className="signin-brand-title">Grow Your Business</h1>
                        <p className="signin-brand-tagline">List your venue and reach thousands of customers</p>
                    </div>
                </div>
            </div>
            <div className="signin-right">
                <div className="signin-header">

                    <h2 className="signin-welcome">Partner Registration</h2>
                    <p className="signin-subtitle">Create an account to start managing your venues</p>
                </div>
                <div className="signin-card">
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input id="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="businessName">Business Name</label>
                                <input id="businessName" type="text" value={formData.businessName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input id="phone" type="text" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="location">Business Location</label>
                                <input id="location" type="text" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <button type="submit" className="signin-button" style={{ marginTop: '10px' }}>Register Business</button>
                        <div className="signin-footer">
                            <p>Already have a partner account?{" "}
                                <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); navigate('/owner-login'); }}>
                                    Login here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OwnerSignup;
