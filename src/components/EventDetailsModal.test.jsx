import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventDetailsModal from './EventDetailsModal';

describe('EventDetailsModal', () => {
    const mockEvent = {
        id: 1,
        title: 'Test Event',
        type: 'class',
        startTime: '2026-02-10T23:00:00.000Z',
        endTime: '2026-02-11T00:00:00.000Z',
        location: 'Test Location',
        notes: 'Test Notes'
    };

    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        event: mockEvent
    };

    it('renders event details correctly', () => {
        render(<EventDetailsModal {...defaultProps} />);
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Class')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
        expect(screen.getByText('Test Notes')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { container } = render(<EventDetailsModal {...defaultProps} isOpen={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('calls onClose when close button is clicked', () => {
        render(<EventDetailsModal {...defaultProps} />);
        const closeBtn = screen.getByRole('button', { selector: '.close-btn-details' });
        fireEvent.click(closeBtn);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('handles missing location and notes gracefuly', () => {
        const minimalEvent = { ...mockEvent, location: '', notes: '' };
        render(<EventDetailsModal {...defaultProps} event={minimalEvent} />);
        expect(screen.queryByText('Location')).not.toBeInTheDocument();
        expect(screen.queryByText('Notes')).not.toBeInTheDocument();
    });
});
