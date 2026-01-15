import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview"); // overview, users, venues
    const [users, setUsers] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVenueId, setEditingVenueId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        pricePerGuest: '',
        priceRange: '',
        description: '',
        images: []
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [usersRes, venuesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/venues')
            ]);
            setUsers(usersRes.data);
            setVenues(venuesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('location', formData.location);
            data.append('capacity', formData.capacity);
            data.append('pricePerGuest', formData.pricePerGuest);
            data.append('priceRange', formData.priceRange);
            data.append('description', formData.description);

            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i]);
            }

            if (editingVenueId) {
                await api.put(`/admin/venues/${editingVenueId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/venues', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowAddModal(false);
            setEditingVenueId(null);
            fetchAllData();
            setFormData({
                name: '',
                location: '',
                capacity: '',
                pricePerGuest: '',
                priceRange: '',
                description: '',
                images: []
            });
        } catch (err) {
            console.error(err);
            alert("Failed to save venue. Please check your inputs.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchAllData();
            } catch (err) {
                alert("Failed to delete user");
            }
        }
    };

    const handleDeleteVenue = async (id) => {
        if (window.confirm("Are you sure you want to delete this venue?")) {
            try {
                await api.delete(`/admin/venues/${id}`);
                fetchAllData();
            } catch (err) {
                alert("Failed to delete venue");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    if (loading && users.length === 0 && venues.length === 0) {
        return (
            <div className="loading-container">
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    Banquet<span>Connect</span>
                </div>
                <nav className="sidebar-nav">
                    <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <span>📊</span> Overview
                    </div>
                    <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <span>👥</span> Users
                    </div>
                    <div className={`nav-item ${activeTab === 'venues' ? 'active' : ''}`} onClick={() => setActiveTab('venues')}>
                        <span>🏢</span> Venues
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-info">
                        <h1>
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'venues' && 'Venue Management'}
                        </h1>
                        <p>Welcome back, Admin</p>
                    </div>
                    {activeTab === 'venues' && (
                        <button className="btn-primary" onClick={() => {
                            setEditingVenueId(null);
                            setFormData({
                                name: '',
                                location: '',
                                capacity: '',
                                pricePerGuest: '',
                                priceRange: '',
                                description: '',
                                images: []
                            });
                            setShowAddModal(true);
                        }}>
                            + Add Venue
                        </button>
                    )}
                </header>

                {activeTab === 'overview' && (
                    <StatsOverview users={users} venues={venues} />
                )}

                {activeTab === 'users' && (
                    <div className="content-card">
                        <div className="card-header">
                            <h2>Registered Users</h2>
                        </div>
                        <UserTable users={users} onDelete={handleDeleteUser} />
                    </div>
                )}

                {activeTab === 'venues' && (
                    <div className="content-card">
                        <div className="card-header">
                            <h2>Banquet Venues</h2>
                        </div>
                        <VenueTable venues={venues} onDelete={handleDeleteVenue} />
                    </div>
                )}
            </main>

            {showAddModal && (
                <VenueModal
                    formData={formData}
                    onChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onSubmit={handleSubmit}
                    onClose={() => setShowAddModal(false)}
                    isEditing={!!editingVenueId}
                />
            )}
        </div>
    );
}

// Sub-components
const StatsOverview = ({ users, venues }) => {
    const adminCount = users.filter(u => u.role === 'admin').length;
    const ownerCount = users.filter(u => u.role === 'owner').length;
    const userCount = users.filter(u => u.role === 'user').length;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-icon">👥</div>
            </div>
            <div className="stat-card">
                <div>
                    <div className="stat-label">Total Venues</div>
                    <div className="stat-value">{venues.length}</div>
                </div>
                <div className="stat-icon">🏢</div>
            </div>
            <div className="stat-card">
                <div>
                    <div className="stat-label">Business Owners</div>
                    <div className="stat-value">{ownerCount}</div>
                </div>
                <div className="stat-icon">👔</div>
            </div>
            <div className="stat-card">
                <div>
                    <div className="stat-label">System Admins</div>
                    <div className="stat-value">{adminCount}</div>
                </div>
                <div className="stat-icon">🛡️</div>
            </div>
        </div>
    );
};

const UserTable = ({ users, onDelete }) => (
    <table className="admin-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <span className={`badge badge-${user.role}`}>
                            {user.role}
                        </span>
                    </td>
                    <td>
                        {user.role !== 'admin' && (
                            <button className="btn-danger" onClick={() => onDelete(user._id)}>
                                Delete
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const VenueTable = ({ venues, onDelete }) => (
    <table className="admin-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {venues.map(venue => (
                <tr key={venue._id}>
                    <td>
                        <img
                            src={venue.images?.[0] ? `http://localhost:5000${venue.images[0]}` : 'https://via.placeholder.com/60x40'}
                            alt=""
                            className="venue-img-table"
                        />
                    </td>
                    <td>{venue.name}</td>
                    <td>{venue.location}</td>
                    <td>{venue.capacity} Guests</td>
                    <td>
                        <button className="btn-danger" onClick={() => onDelete(venue._id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const VenueModal = ({ formData, onChange, onImageChange, onSubmit, onClose, isEditing }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h2>{isEditing ? 'Update Venue' : 'Add New Venue'}</h2>
                <button className="btn-outline" onClick={onClose}>&times;</button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Venue Name</label>
                        <input className="form-control" name="name" value={formData.name} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input className="form-control" name="location" value={formData.location} onChange={onChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input className="form-control" name="capacity" type="number" value={formData.capacity} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label>Price Per Guest</label>
                            <input className="form-control" name="pricePerGuest" type="number" value={formData.pricePerGuest} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Price Range Text (Display Only)</label>
                        <input className="form-control" name="priceRange" value={formData.priceRange} onChange={onChange} required placeholder="e.g. 50k - 1 Lakh" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={onChange} required rows="4" />
                    </div>
                    <div className="form-group">
                        <label>Images</label>
                        <input type="file" multiple accept="image/*" onChange={onImageChange} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary">{isEditing ? 'Update' : 'Add Venue'}</button>
                </div>
            </form>
        </div>
    </div>
);

export default AdminDashboard;
