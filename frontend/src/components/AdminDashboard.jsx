import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <div style={{ marginBottom: '20px' }}>
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
        </div>
    );
}

export default AdminDashboard;
