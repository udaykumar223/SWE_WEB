import api from './api';

export const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        }
        return response.data;
    },

    // Logout user
    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    // Get current user (Verify token)
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return { success: false };
        }
    },

    // Get stored user
    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!sessionStorage.getItem('token');
    },
};
