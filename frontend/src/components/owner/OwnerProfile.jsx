import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import './OwnerProfile.css';

const OwnerProfile = () => {
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        phone: '',
        location: ''
    });

    const { addToast } = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/owner/me');
            setOwner(res.data);
            setFormData({
                name: res.data.name,
                businessName: res.data.businessName || '',
                phone: res.data.phone || '',
                location: res.data.location || ''
            });
        } catch (err) {
            addToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/owner/update', formData);
            setOwner(res.data);
            setEditing(false);
            addToast('Profile updated successfully', 'success');
        } catch (err) {
            addToast(err.response?.data?.msg || 'Update failed', 'error');
        }
    };

    if (loading) return <div className="loader">Loading Profile...</div>;

    return (
        <div className="owner-profile-container">
            <div className="owner-profile-card">
                <div className="owner-profile-header">
                    <h2>Owner Profile Settings</h2>
                </div>

                {!editing ? (
                    <div className="owner-profile-view">
                        <div className="profile-section">
                            <h3 className="profile-section-title">Owner Details</h3>
                            <div className="profile-info-item">
                                <span className="profile-info-label">Banquet Name</span>
                                <div className="profile-info-value">{owner.businessName || 'Not specified'}</div>
                            </div>
                            <div className="profile-info-item">
                                <span className="profile-info-label">Phone</span>
                                <div className="profile-info-value">{owner.phone || 'Not specified'}</div>
                            </div>
                            <div className="profile-info-item">
                                <span className="profile-info-label">Banquets Location</span>
                                <div className="profile-info-value">{owner.location || 'Not specified'}</div>
                            </div>
                            <div className="profile-info-item">
                                <span className="profile-info-label">Email Address</span>
                                <div className="profile-info-value">{owner.email}</div>
                            </div>
                        </div>
                        <button className="edit-toggle-btn" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div className="profile-section">
                            <h3 className="profile-section-title">Owner Details</h3>
                            <div className="profile-form-group">
                                <label className="profile-form-label">Banquet Name</label>
                                <input
                                    type="text"
                                    className="profile-form-input"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    placeholder="Enter banquet name"
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">Phone</label>
                                <input
                                    type="text"
                                    className="profile-form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">Banquets Location</label>
                                <input
                                    type="text"
                                    className="profile-form-input"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="profile-form-input"
                                    value={owner.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="profile-section-title">Security</h3>
                            <div className="profile-form-group">
                                <label className="profile-form-label">New Password</label>
                                <input
                                    type="password"
                                    className="profile-form-input"
                                    placeholder="Leave blank to keep unchanged"
                                />
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button type="button" className="profile-btn profile-btn-secondary" onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="profile-btn profile-btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OwnerProfile;
