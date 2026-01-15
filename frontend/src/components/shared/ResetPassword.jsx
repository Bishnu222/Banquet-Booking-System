import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api';
import '../user/Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const isOwner = window.location.href.includes('owner');
            const endpoint = isOwner ? `/auth/owner/reset-password/${token}` : `/auth/user/reset-password/${token}`;

            const res = await api.post(endpoint, { password });
            setMessage(res.data.msg);
            setLoading(false);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate(isOwner ? '/owner-login' : '/signin');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="signin-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
            <div className="signin-card" style={{ maxWidth: '400px', background: '#fff' }}>
                <h2 className="signin-welcome">Reset Password</h2>
                <p className="signin-subtitle">Enter your new password below</p>

                <form className="signin-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && <p style={{ color: 'green', fontSize: '0.9rem', marginBottom: '1rem' }}>{message}</p>}
                    {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="signin-footer">
                        <p>Remembered your password? <Link to="/signin" className="signin-link">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
