import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventsPage from './EventsPage';
import { eventService } from '../services/eventService';
import { attendanceService } from '../services/attendanceService';
import { toast } from 'react-toastify';

// Mock services
vi.mock('../services/eventService', () => ({
    eventService: {
        getEvents: vi.fn(),
        deleteEvent: vi.fn(),
    },
}));

vi.mock('../services/attendanceService', () => ({
    attendanceService: {
        markAttendance: vi.fn(),
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('EventsPage', () => {
    const mockEvents = [
        { _id: '1', title: 'Math Class', type: 'class', startTime: new Date().toISOString() },
        { _id: '2', title: 'English Exam', type: 'exam', startTime: new Date().toISOString() }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        eventService.getEvents.mockResolvedValue({ success: true, data: mockEvents });
    });

    it('renders and fetches all events', async () => {
        render(<EventsPage />);

        await waitFor(() => {
            expect(screen.getByText('Math Class')).toBeInTheDocument();
            expect(screen.getByText('English Exam')).toBeInTheDocument();
        });
    });

    it('filters events by type', async () => {
        render(<EventsPage />);

        await waitFor(() => {
            const classFilter = screen.getByText('Class', { selector: '.chip' });
            fireEvent.click(classFilter);

            expect(screen.getByText('Math Class')).toBeInTheDocument();
            expect(screen.queryByText('English Exam')).not.toBeInTheDocument();
        });
    });

    it('handles attendance marking for classes', async () => {
        attendanceService.markAttendance.mockResolvedValue({ success: true });

        render(<EventsPage />);

        await waitFor(() => {
            const presentBtn = screen.getByText('Present');
            fireEvent.click(presentBtn);

            expect(attendanceService.markAttendance).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Marked as present');
        });
    });
});
