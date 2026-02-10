import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
    authService: {
        getMe: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
    },
}));

const TestComponent = () => {
    const { user, login, logout, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="user">{user?.name || 'No User'}</div>
            <div data-testid="auth">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    it('provides authentication state', async () => {
        authService.getMe.mockResolvedValue({ success: false });

        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByTestId('auth')).toHaveTextContent('Not Authenticated');
        });
    });

    it('handles login successfully', async () => {
        const mockUser = { id: 1, name: 'Test User' };
        authService.login.mockResolvedValue({ user: mockUser, token: 'fake-token' });
        authService.getMe.mockResolvedValue({ success: true, data: mockUser });

        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            getByText('Login').click();
        });

        await waitFor(() => {
            expect(getByTestId('auth')).toHaveTextContent('Authenticated');
            expect(getByTestId('user')).toHaveTextContent('Test User');
        });
    });

    it('handles logout', async () => {
        const mockUser = { id: 1, name: 'Test User' };
        authService.getMe.mockResolvedValue({ success: true, data: mockUser });

        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByTestId('auth')).toHaveTextContent('Authenticated');
        });

        await act(async () => {
            getByText('Logout').click();
        });

        expect(getByTestId('auth')).toHaveTextContent('Not Authenticated');
        expect(authService.logout).toHaveBeenCalled();
    });
});
