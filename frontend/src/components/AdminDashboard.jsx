import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
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
        if (activeTab === 'users') fetchUsers();
        else fetchVenues();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const res = await api.get('/venues');
            setVenues(res.data);
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
                await api.put(`/venues/${editingVenueId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/venues', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowAddModal(false);
            setEditingVenueId(null);
            fetchVenues();
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
                fetchUsers();
            } catch (err) {
                alert("Failed to delete user");
            }
        }
    };

    const handleDeleteVenue = async (id) => {
        if (window.confirm("Are you sure you want to delete this venue?")) {
            try {
                await api.delete(`/venues/${id}`);
                fetchVenues();
            } catch (err) {
                alert("Failed to delete venue");
            }
        }
    };

    if (loading && users.length === 0 && venues.length === 0) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    navigate('/');
                }} style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </header>

            {/* Tabs */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            border: 'none',
                            background: activeTab === 'users' ? '#333' : '#eee',
                            color: activeTab === 'users' ? 'white' : '#333',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => setActiveTab('venues')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: activeTab === 'venues' ? '#333' : '#eee',
                            color: activeTab === 'venues' ? 'white' : '#333',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Venues
                    </button>
                </div>
                {activeTab === 'venues' && (
                    <button
                        onClick={() => {
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
                        }}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: '#2cb57e',
                            color: 'white',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        + Add Venue
                    </button>
                )}
            </div>

            {activeTab === 'users' ? (
                <>
                    <h3>Users List</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Role</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.name}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.email}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.85em',
                                            background: user.role === 'admin' ? '#333' : user.role === 'owner' ? '#2cb57e' : '#e0e0e0',
                                            color: user.role === 'user' ? '#333' : 'white'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                style={{ background: '#ff4b4b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h3>Venues List</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Image</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Location</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Capacity</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map(venue => (
                                <tr key={venue._id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                        <img src={venue.images?.[0] || 'placeholder.jpg'} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{venue.name}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{venue.location}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{venue.capacity}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                        <button
                                            onClick={() => handleDeleteVenue(venue._id)}
                                            style={{ background: '#ff4b4b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ marginTop: 0 }}>{editingVenueId ? 'Update Venue' : 'Add New Venue'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Venue Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
                                <input name="location" value={formData.location} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Capacity</label>
                                <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Price Range</label>
                                <input name="priceRange" value={formData.priceRange} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} placeholder="e.g. 50k - 1 Lakh" />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Price Per Guest</label>
                                <input name="pricePerGuest" type="number" value={formData.pricePerGuest} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Images</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    {editingVenueId ? 'Update' : 'Add Venue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
