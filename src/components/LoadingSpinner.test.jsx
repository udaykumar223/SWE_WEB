import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<LoadingSpinner />);
        const loader = container.querySelector('.w-12');
        expect(loader).toBeInTheDocument();
    });
});
