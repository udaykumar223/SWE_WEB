import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
    it('renders the correct copyright text and year', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} ClassFlow. All rights reserved.`))).toBeInTheDocument();
    });
});
