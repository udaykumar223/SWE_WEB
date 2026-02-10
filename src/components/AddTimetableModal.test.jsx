import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddTimetableModal from './AddTimetableModal';
import { timetableService } from '../services/timetableService';
import { toast } from 'react-toastify';

// Mock services
vi.mock('../services/timetableService', () => ({
    timetableService: {
        createEntry: vi.fn(),
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        warn: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('AddTimetableModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onEntryAdded: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<AddTimetableModal {...defaultProps} />);
        expect(screen.getByText('Add Timetable Slot')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Course Name')).toBeInTheDocument();
    });

    it('validates required fields', () => {
        render(<AddTimetableModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Add Slot'));
        expect(toast.warn).toHaveBeenCalledWith('Please enter a course name and select at least one day');
    });

    it('handles day selection', () => {
        render(<AddTimetableModal {...defaultProps} />);
        const mondayChip = screen.getByText('M');
        fireEvent.click(mondayChip);
        expect(mondayChip).toHaveClass('active');
    });

    it('successfully adds a timetable slot', async () => {
        timetableService.createEntry.mockResolvedValue({ success: true, data: { id: 1, courseName: 'Test Course' } });

        render(<AddTimetableModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Test Course' } });
        fireEvent.click(screen.getByText('M')); // Select Monday
        fireEvent.click(screen.getByText('Add Slot'));

        await waitFor(() => {
            expect(timetableService.createEntry).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Timetable slot added successfully');
            expect(defaultProps.onEntryAdded).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });
});
