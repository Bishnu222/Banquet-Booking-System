import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import '../../components/shared/ProfilePage.css'; // Reusing CSS for now

function UserProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('UserProfile: Fetching from /auth/user/me');
                const res = await api.get('/auth/user/me');
                console.log('UserProfile: Response:', res.data);
                setName(res.data.name);
                setEmail(res.data.email);
                setLoading(false);
            } catch (err) {
                console.error('UserProfile Error:', err.response?.data || err.message);
                if (err.response && err.response.status === 401) {
                    navigate('/signin');
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const updateData = {
                name,
                password: password || undefined
            };

            const res = await api.put('/auth/user/update-profile', updateData);

            // Update both sessionStorage and localStorage
            if (sessionStorage.getItem('userName')) {
                sessionStorage.setItem('userName', res.data.user.name);
            }
            localStorage.setItem('userName', res.data.user.name);

            alert("Profile updated successfully!");
            setPassword('');
            setConfirmPassword('');
            navigate('/home');

        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container user-profile">
            <div className="profile-card">
                <h2>My Profile (User)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="read-only-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password (Optional)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    {password && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/home')}>Back to Home</button>
                        <button type="submit" className="btn-primary">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
