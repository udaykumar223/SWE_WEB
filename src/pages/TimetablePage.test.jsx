import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimetablePage from './TimetablePage';
import { timetableService } from '../services/timetableService';
import { BrowserRouter } from 'react-router-dom';

// Mock services
vi.mock('../services/timetableService', () => ({
    timetableService: {
        getTimetable: vi.fn(),
    },
}));

describe('TimetablePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders and fetches timetable entries', async () => {
        const mockEntries = [
            { _id: '1', courseName: 'Test Subject', daysOfWeek: [new Date().getDay()], startTime: '09:00', endTime: '10:00' }
        ];
        timetableService.getTimetable.mockResolvedValue({ success: true, data: mockEntries });

        render(
            <BrowserRouter>
                <TimetablePage />
            </BrowserRouter>
        );

        expect(screen.getByText('Weekly Timetable')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Subject')).toBeInTheDocument();
        });
    });

    it('filters schedule based on selected day', async () => {
        const mockEntries = [
            { _id: '1', courseName: 'Monday Subject', daysOfWeek: [1], startTime: '09:00', endTime: '10:00' },
            { _id: '2', courseName: 'Tuesday Subject', daysOfWeek: [2], startTime: '10:00', endTime: '11:00' }
        ];
        timetableService.getTimetable.mockResolvedValue({ success: true, data: mockEntries });

        render(
            <BrowserRouter>
                <TimetablePage />
            </BrowserRouter>
        );

        // Click on Monday (M)
        const mondayTab = screen.getByText('M');
        fireEvent.click(mondayTab);

        await waitFor(() => {
            expect(screen.getByText('Monday Subject')).toBeInTheDocument();
            expect(screen.queryByText('Tuesday Subject')).not.toBeInTheDocument();
        });
    });
});
