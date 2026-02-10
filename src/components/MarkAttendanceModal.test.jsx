import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MarkAttendanceModal from './MarkAttendanceModal';
import { attendanceService } from '../services/attendanceService';
import { toast } from 'react-toastify';

// Mock services
vi.mock('../services/attendanceService', () => ({
    attendanceService: {
        markAttendance: vi.fn(),
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        warn: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('MarkAttendanceModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onAttendanceMarked: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<MarkAttendanceModal {...defaultProps} />);
        expect(screen.getByText('Mark Attendance')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Course Name')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Present')).toBeInTheDocument();
    });

    it('validates course name', () => {
        render(<MarkAttendanceModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Save'));
        expect(toast.warn).toHaveBeenCalledWith('Please enter a course name');
    });

    it('successfully marks attendance', async () => {
        attendanceService.markAttendance.mockResolvedValue({ success: true, data: { id: 1, courseName: 'Test Course' } });

        render(<MarkAttendanceModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Test Course' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(attendanceService.markAttendance).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Attendance marked successfully');
            expect(defaultProps.onAttendanceMarked).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });
});
