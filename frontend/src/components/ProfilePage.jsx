import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Will create this next

function ProfilePage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Email usually typically read-only or requires re-auth
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current user details or use localStorage if limited
        // Better to fetch fresh data, but we might not have a /me endpoint yet
        // We can rely on localStorage for initial display or add a /me endpoint
        // For now, let's use what we stored in localStorage or fetch via a new endpoint if needed.
        // Actually, let's assume we can rely on localStorage for Name/Role since successful login updates it.
        // BUT, for a profile page, it's best to verify.
        // Let's implement a simple "fetch my profile" or just use what we have.
        // Given complexity, let's just pre-fill from localStorage for now, 
        // OR simply set name from localStorage.

        const storedName = localStorage.getItem('userName');
        const storedRole = localStorage.getItem('role');
        // Email is not stored in localStorage in our previous steps.
        // We really should have a /me or /profile endpoint to get current user data.
        // Since I just added /update-profile (PUT), I haven't added GET /profile.
        // Let's add GET /profile in the backend quickly or just rely on the user knowing their name.
        // Wait, the user wants to EDIT their credential.

        if (storedName) setName(storedName);
        if (storedRole) setRole(storedRole);
        setLoading(false);

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await api.put('/auth/update-profile', {
                name,
                password: password || undefined // Send undefined if empty so backend ignores it
            });

            // Update localStorage
            localStorage.setItem('userName', res.data.user.name);
            alert("Profile updated successfully!");
            setPassword('');
            setConfirmPassword('');
            // Navigate back to dashboard
            if (role === 'owner') navigate('/owner-dashboard');
            else navigate('/home');

        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {password && (
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
