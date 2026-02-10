import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalendarPage from './CalendarPage';
import { eventService } from '../services/eventService';

// Mock services
vi.mock('../services/eventService', () => ({
    eventService: {
        getEventsByDay: vi.fn(),
    },
}));

// Mock react-calendar to avoid complex DOM issues in tests
vi.mock('react-calendar', () => ({
    default: ({ onChange, value }) => (
        <div data-testid="mock-calendar">
            <button onClick={() => onChange(new Date())}>Change Date</button>
        </div>
    )
}));

describe('CalendarPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly and fetches events', async () => {
        eventService.getEventsByDay.mockResolvedValue({ success: true, data: [] });

        render(<CalendarPage />);

        expect(screen.getByText('Calendar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();

        await waitFor(() => {
            expect(eventService.getEventsByDay).toHaveBeenCalled();
        });
    });

    it('displays events for a specific day', async () => {
        const mockEvents = [
            { _id: '1', title: 'Math Class', type: 'class', startTime: new Date().toISOString() }
        ];
        eventService.getEventsByDay.mockResolvedValue({ success: true, data: mockEvents });

        render(<CalendarPage />);

        await waitFor(() => {
            expect(screen.getByText('Math Class')).toBeInTheDocument();
            expect(screen.getByText('class')).toBeInTheDocument();
        });
    });

    it('shows empty state when no events exist', async () => {
        eventService.getEventsByDay.mockResolvedValue({ success: true, data: [] });

        render(<CalendarPage />);

        await waitFor(() => {
            expect(screen.getByText('No events for this day')).toBeInTheDocument();
        });
    });
});
