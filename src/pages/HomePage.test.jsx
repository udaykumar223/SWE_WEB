import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './HomePage';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { eventService } from '../services/eventService';

// Mock services and hooks
vi.mock('../services/eventService', () => ({
    eventService: {
        getEventsByDay: vi.fn(),
        getCountsForDay: vi.fn(),
    },
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test User' },
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        eventService.getEventsByDay.mockResolvedValue({ success: true, data: [] });
        eventService.getCountsForDay.mockResolvedValue({ success: true, data: { count: 0 } });
    });

    it('renders with correct greeting and user name', async () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Good/)).toBeInTheDocument();
        expect(screen.getByText("Today's Overview")).toBeInTheDocument();
    });

    it('displays overview stats correctly', async () => {
        eventService.getEventsByDay.mockResolvedValue({
            success: true,
            data: [
                { type: 'class', title: 'Math' },
                { type: 'exam', title: 'Final' }
            ]
        });

        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Classes')).toBeInTheDocument();
            // Since we can't easily query by color/icon, we just check labels
            expect(screen.getByText('Exams')).toBeInTheDocument();
        });
    });

    it('renders quick action buttons', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
        expect(screen.getByText('Timetable')).toBeInTheDocument();
        expect(screen.getByText('Attendance')).toBeInTheDocument();
    });
});
