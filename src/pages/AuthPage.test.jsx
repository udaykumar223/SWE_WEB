import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthPage from './AuthPage';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
        register: vi.fn(),
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
    ToastContainer: () => null,
}));

describe('AuthPage', () => {
    it('renders login form by default', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Full Name')).not.toBeInTheDocument();
    });

    it('switches to sign up form', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Sign Up'));
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    it('updates input values on change', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        const emailInput = screen.getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });
});
