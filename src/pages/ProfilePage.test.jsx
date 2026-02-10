import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfilePage from './ProfilePage';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as ThemeContext from '../context/ThemeContext';

// Mock icons
vi.mock('react-icons/hi', () => {
    const mockIcon = () => <div />;
    return {
        HiOutlineUser: mockIcon,
        HiOutlineAcademicCap: mockIcon,
        HiOutlineCalendar: mockIcon,
        HiOutlineOfficeBuilding: mockIcon,
        HiOutlineMoon: mockIcon,
        HiOutlineSun: mockIcon,
        HiOutlineLogout: mockIcon,
        HiOutlineChevronRight: mockIcon,
        HiOutlineColorSwatch: mockIcon,
        HiOutlineLightningBolt: mockIcon,
        HiOutlineViewGrid: mockIcon,
        HiOutlineCollection: mockIcon,
        HiOutlineDatabase: mockIcon,
        HiOutlineBell: mockIcon,
        HiOutlineClock: mockIcon,
        HiOutlineMicrophone: mockIcon,
        HiOutlineInformationCircle: mockIcon,
        HiOutlineQuestionMarkCircle: mockIcon,
        HiOutlineShieldCheck: mockIcon,
        HiOutlineFire: mockIcon,
    };
});

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
            user: { name: 'Test User', role: 'Student', email: 'test@example.com' },
            logout: vi.fn(),
        });
        vi.spyOn(ThemeContext, 'useTheme').mockReturnValue({
            isDark: false,
            toggleTheme: vi.fn(),
        });
    });

    it('renders and finds user name text', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );
        expect(screen.getByText(/Profile & Settings/i)).toBeInTheDocument();
        // Check for "Test User"
        const nameHeading = screen.getByRole('heading', { level: 3 });
        expect(nameHeading.textContent).toBe('Test User');
    });
});
