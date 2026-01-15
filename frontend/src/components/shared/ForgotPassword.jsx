import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import '../user/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const isOwner = window.location.href.includes('owner');
            const endpoint = isOwner ? '/auth/owner/forgot-password' : '/auth/user/forgot-password';

            const res = await api.post(endpoint, { email });
            setMessage(res.data.msg);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="signin-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
            <div className="signin-card" style={{ maxWidth: '400px', background: '#fff' }}>
                <h2 className="signin-welcome">Forgot Password</h2>
                <p className="signin-subtitle">Enter your email to receive a reset link</p>

                <form className="signin-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {message && <p style={{ color: 'green', fontSize: '0.9rem', marginBottom: '1rem' }}>{message}</p>}
                    {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="signin-footer">
                        <Link to="/signin" className="signin-link">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
