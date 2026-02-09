import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getMe();
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        // Token invalid/expired
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        setUser(null);
                    }
                } catch (error) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                sessionStorage.removeItem('user'); // Clean up any stale user data
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        // Real API returns { token, user } directly
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        // Real API register returns { message } only. 
        // User needs to login after register, or we auto-login.
        // For now, we don't set user here basically.
        // setUser(data.user); // Remove this or handle auto-login if backend supports it.
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
