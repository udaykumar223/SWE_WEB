import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineUser,
    HiOutlineAcademicCap,
    HiOutlineCalendar,
    HiOutlineOfficeBuilding,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineLogout,
    HiOutlineChevronRight,
    HiOutlineColorSwatch,
    HiOutlineLightningBolt,
    HiOutlineViewGrid,
    HiOutlineCollection,
    HiOutlineDatabase,
    HiOutlineBell,
    HiOutlineClock,
    HiOutlineMicrophone,
    HiOutlineInformationCircle,
    HiOutlineQuestionMarkCircle,
    HiOutlineShieldCheck,
    HiOutlineFire
} from 'react-icons/hi';
import './ProfilePage.css';

const ProfilePage = () => {
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const sections = [
        {
            title: 'Personal Information',
            items: [
                { label: 'Name', value: 'Student User', icon: HiOutlineUser },
                { label: 'Role', value: 'Student', icon: HiOutlineAcademicCap },
                { label: 'Semester', value: 'Spring 2026', icon: HiOutlineCalendar },
                { label: 'Institution', value: 'University Name', icon: HiOutlineOfficeBuilding },
            ]
        },
        {
            title: 'Appearance',
            items: [
                { id: 'dark-mode', label: 'Dark Mode', subLabel: 'Toggle dark theme', type: 'toggle', icon: HiOutlineMoon },
                { id: 'color-theme', label: 'Color Theme', value: 'Professional', type: 'value', icon: HiOutlineColorSwatch },
                { id: 'reduced-animations', label: 'Reduced Animations', subLabel: 'Minimize visual effects', type: 'toggle', icon: HiOutlineLightningBolt },
            ]
        },
        {
            title: 'Workflow',
            items: [
                { id: 'default-view', label: 'Default View', value: 'Home', type: 'value', icon: HiOutlineViewGrid },
                { id: 'study-mode', label: 'Study Mode', subLabel: 'Minimal interface during focus time', type: 'toggle', icon: HiOutlineFire },
            ]
        },
        {
            title: 'Data & Categories',
            items: [
                { id: 'manage-categories', label: 'Manage Categories', subLabel: '5 categories', type: 'link', icon: HiOutlineCollection },
                { id: 'export-data', label: 'Export Data', subLabel: 'Backup your events', type: 'link', icon: HiOutlineDatabase },
            ]
        },
        {
            title: 'Notifications',
            items: [
                { id: 'event-reminders', label: 'Event Reminders', type: 'toggle', icon: HiOutlineBell, defaultActive: true },
                { id: 'deadline-alerts', label: 'Deadline Alerts', type: 'toggle', icon: HiOutlineClock, defaultActive: true },
                { id: 'voice-note-notifications', label: 'Voice Note Notifications', type: 'toggle', icon: HiOutlineMicrophone },
            ]
        },
        {
            title: 'About',
            items: [
                { id: 'version', label: 'Version', value: '1.0.0', type: 'simple', icon: HiOutlineInformationCircle },
                { id: 'help', label: 'Help & Support', type: 'link', icon: HiOutlineQuestionMarkCircle },
                { id: 'privacy', label: 'Privacy Policy', type: 'link', icon: HiOutlineShieldCheck },
            ]
        }
    ];

    const [toggles, setToggles] = useState({
        'dark-mode': isDark,
        'reduced-animations': false,
        'study-mode': false,
        'event-reminders': true,
        'deadline-alerts': true,
        'voice-note-notifications': false
    });

    const handleToggle = (id) => {
        if (id === 'dark-mode') toggleTheme();
        setToggles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="profile-content fade-in">
            <header className="page-header">
                <h2>Profile & Settings</h2>
            </header>

            <div className="profile-header-card card">
                <div className="avatar-box">
                    <span>SU</span>
                </div>
                <div className="profile-info">
                    <div className="name-row">
                        <h3>Student User</h3>
                        <span className="badge student">Student</span>
                    </div>
                    <p className="email-text">student@university.edu</p>
                </div>
            </div>

            {sections.map((section, idx) => (
                <div key={idx} className="profile-section">
                    <h4 className="section-title">{section.title}</h4>
                    <div className="card list-card">
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                className={`list-item ${item.type === 'toggle' || item.type === 'link' ? 'clickable' : ''}`}
                                onClick={() => item.type === 'toggle' ? handleToggle(item.id) : null}
                            >
                                <item.icon className="item-icon" />
                                <div className="item-content">
                                    <span className="item-label">{item.label}</span>
                                    {item.subLabel && <span className="item-sublabel">{item.subLabel}</span>}
                                    {item.type === 'simple' && <span className="item-value">{item.value}</span>}
                                </div>

                                {item.type === 'value' && (
                                    <div className="item-value-box">
                                        <span className="item-value">{item.value}</span>
                                        <HiOutlineChevronRight className="arrow-icon" />
                                    </div>
                                )}

                                {item.type === 'link' && <HiOutlineChevronRight className="arrow-icon" />}

                                {item.type === 'toggle' && (
                                    <div className={`toggle-switch ${toggles[item.id] ? 'active' : ''}`}>
                                        <div className="toggle-thumb" />
                                    </div>
                                )}

                                {!item.type && (
                                    <span className="item-value">{item.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}


            <button className="btn-filled logout-btn" onClick={logout} style={{ background: 'var(--error-red)' }}>
                <HiOutlineLogout /> Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;
