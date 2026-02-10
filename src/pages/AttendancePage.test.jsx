import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AttendancePage from './AttendancePage';
import { attendanceService } from '../services/attendanceService';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-icons/hi', () => ({
    HiOutlineChevronLeft: () => <div />,
    HiChevronRight: () => <div />,
    HiOutlineChartPie: () => <div />,
    HiPlus: () => <div />,
    HiOutlineAcademicCap: () => <div />,
    HiOutlineX: () => <div />,
    HiOutlineCheckCircle: () => <div />,
}));

vi.mock('../services/attendanceService', () => ({
    attendanceService: {
        getStats: vi.fn(),
    },
}));

describe('AttendancePage', () => {
    it('renders stats', async () => {
        attendanceService.getStats.mockResolvedValue({
            success: true,
            data: { 'Math': { total: 10, present: 8, late: 0 } }
        });

        render(
            <BrowserRouter>
                <AttendancePage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Math/i)).toBeInTheDocument();
        });
    });
});
