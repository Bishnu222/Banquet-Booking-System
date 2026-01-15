import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
    config => {
        // Try sessionStorage first (tab-specific), fallback to localStorage
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const role = sessionStorage.getItem('role') || localStorage.getItem('role');

        // DEBUG: Log request details
        console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('   Token exists:', !!token);
        console.log('   Role:', role);
        console.log('   Storage:', sessionStorage.getItem('token') ? 'sessionStorage' : 'localStorage');

        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.warn('🔴 Unauthorized - Token likely expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            // Optional: redirect to signin if not already there
            if (!window.location.pathname.includes('/signin')) {
                window.location.href = '/signin?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
