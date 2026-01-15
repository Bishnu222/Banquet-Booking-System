import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../user/UserProfile';
import OwnerProfile from '../owner/OwnerProfile';

function ProfilePage() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check sessionStorage first (tab-specific), then localStorage
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const storedRole = sessionStorage.getItem('role') || localStorage.getItem('role');

        // DEBUG: Log localStorage values
        console.log('=== ProfilePage Debug ===');
        console.log('Token exists:', !!token);
        console.log('Stored role:', storedRole);
        console.log('Storage type:', sessionStorage.getItem('token') ? 'sessionStorage (tab-specific)' : 'localStorage (shared)');
        console.log('userName:', sessionStorage.getItem('userName') || localStorage.getItem('userName'));
        console.log('userId:', sessionStorage.getItem('userId') || localStorage.getItem('userId'));
        console.log('========================');

        // If no token, redirect to appropriate login
        if (!token) {
            navigate('/signin');
            return;
        }

        // If no role stored, clear storage and redirect
        if (!storedRole) {
            console.warn('No role found in storage. Clearing session.');
            sessionStorage.clear();
            localStorage.clear();
            navigate('/signin');
            return;
        }

        // Validate role
        if (storedRole !== 'user' && storedRole !== 'admin' && storedRole !== 'owner') {
            console.error('Invalid role:', storedRole);
            sessionStorage.clear();
            localStorage.clear();
            navigate('/signin');
            return;
        }

        setRole(storedRole);
    }, [navigate]);

    if (!role) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;

    // Route to correct profile component based on role. (Admins and Users use the same component)
    if (role === 'user' || role === 'admin') {
        return <UserProfile />;
    } else if (role === 'owner') {
        return <OwnerProfile />;
    } else {
        return <div>Invalid role. Please login again.</div>;
    }
}

export default ProfilePage;

