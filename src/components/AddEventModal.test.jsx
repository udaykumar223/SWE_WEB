import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddEventModal from './AddEventModal';
import { eventService } from '../services/eventService';
import { toast } from 'react-toastify';

// Mock services
vi.mock('../services/eventService', () => ({
    eventService: {
        createEvent: vi.fn(),
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        warn: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('AddEventModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onEventAdded: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(<AddEventModal {...defaultProps} />);
        // Use more specific selectors due to multiple "Create Event" strings
        expect(screen.getByRole('heading', { level: 2, name: /Create Event/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Event Title/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();
    });

    it('successfully creates an event', async () => {
        eventService.createEvent.mockResolvedValue({ success: true, data: { id: 1, title: 'Test Event' } });

        render(<AddEventModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText(/Event Title/i), { target: { value: 'Test Event' } });
        const submitBtn = screen.getByRole('button', { name: /Create Event/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(eventService.createEvent).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Event created successfully');
        });
    });

    it('shows warning if title is empty', async () => {
        render(<AddEventModal {...defaultProps} />);
        const submitBtn = screen.getByRole('button', { name: /Create Event/i });
        fireEvent.click(submitBtn);
        expect(toast.warn).toHaveBeenCalledWith('Please enter an event title');
    });

    it('does not render when closed', () => {
        const { container } = render(<AddEventModal {...defaultProps} isOpen={false} />);
        expect(container.firstChild).toBeNull();
    });
});
