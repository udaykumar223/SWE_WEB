import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineBell,
    HiOutlineAcademicCap,
    HiOutlineClipboardList,
    HiOutlineInformationCircle,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiPlus,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineBookOpen,
    HiOutlineEmojiHappy,
    HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddEventModal from '../components/AddEventModal';
import { eventService } from '../services/eventService';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('class');
    const [dayStats, setDayStats] = useState({});

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDayStats = async () => {
            const stats = {};
            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateString = date.toISOString().split('T')[0];
                const response = await eventService.getCountsForDay(date);
                stats[dateString] = response.data.count;
            }
            setDayStats(stats);
        };
        fetchDayStats();
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const [stats, setStats] = useState({
        classes: 0,
        tasks: 0,
        exams: 0,
        meetings: 0
    });
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        // Fetch Today's Stats
        const fetchStats = async () => {
            try {
                const response = await eventService.getTodayStats();
                if (response.success) {
                    // response.data has total, completed, pending, etc.
                    // We need breakdown by type. 
                    // Let's manually fetch today's events and count for now or update backend/service to return breakdown.
                    // For speed: Fetch all events for today and count.
                    const today = new Date();
                    const eventsRes = await eventService.getEventsByDay(today);
                    if (eventsRes.success) {
                        const events = eventsRes.data;
                        setStats({
                            classes: events.filter(e => e.type === 'class').length,
                            tasks: events.filter(e => e.type === 'assignment' || e.type === 'deadline').length,
                            exams: events.filter(e => e.type === 'exam').length,
                            meetings: events.filter(e => e.type === 'meeting').length
                        });

                        // Top 3 upcoming events for today
                        const upcoming = events
                            .filter(e => new Date(e.startDate) > new Date())
                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                            .slice(0, 3);
                        setUpcomingEvents(upcoming);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch home stats", error);
            }
        };
        fetchStats();
    }, [currentTime]); // Refresh when time changes (every min) is okay, or just on mount

    const overviewStats = [
        { label: 'Classes', count: stats.classes, icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.05)' },
        { label: 'Tasks', count: stats.tasks, icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.05)' },
        { label: 'Exams', count: stats.exams, icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.05)' },
        { label: 'Meetings', count: stats.meetings, icon: HiOutlineUsers, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
    ];

    const quickActions = [
        { id: 'class', label: 'Class', icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.05)' },
        { id: 'assignment', label: 'Assignment', icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.05)' },
        { id: 'exam', label: 'Exam', icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.05)' },
        { id: 'timetable', label: 'Timetable', icon: HiOutlineCalendar, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
        { id: 'attendance', label: 'Attendance', icon: HiOutlineChartBar, color: 'var(--personal-green)', bg: 'rgba(16, 185, 129, 0.05)' },
        { id: 'meeting', label: 'Meeting', icon: HiOutlineUsers, color: 'var(--secondary-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
    ];

    const handleActionClick = (action) => {
        if (action.id === 'timetable' || action.id === 'attendance') {
            navigate(`/${action.id}`);
        } else {
            openCreateModal(action.id);
        }
    };

    const openCreateModal = (type = 'class') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="home-content fade-in">
            {/* Header */}
            <header className="home-header">
                <div className="header-text">
                    <h1>{getGreeting()}</h1>
                    <p>{formatDate(currentTime)}</p>
                </div>
                <button className="icon-btn">
                    <HiOutlineBell />
                </button>
            </header>

            {/* Today's Overview */}
            <section className="section">
                <h3 className="section-title">Today's Overview</h3>
                <div className="overview-grid">
                    {overviewStats.map((stat, index) => (
                        <div key={index} className="overview-card card" style={{ background: stat.bg }}>
                            <stat.icon className="stat-icon" style={{ color: stat.color }} />
                            <div className="stat-info">
                                <span className="stat-count" style={{ color: stat.count }}>{stat.count}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <div key={index} className="action-card card" style={{ background: action.bg }} onClick={() => handleActionClick(action)}>
                            <action.icon className="action-icon" style={{ color: action.color }} />
                            <span className="action-label" style={{ color: action.color }}>{action.label}</span>
                        </div>
                    ))}
                </div>
            </section>


            {/* Upcoming Events */}
            <section className="section">
                <h3 className="section-title">Upcoming Events Today</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="upcoming-events-list">
                        {upcomingEvents.map(event => (
                            <div key={event._id} className="event-card-home card">
                                <div className={`event-type-indicator ${event.type}`} />
                                <div className="event-info-home">
                                    <h4>{event.title}</h4>
                                    <div className="event-meta-home">
                                        <HiOutlineClock />
                                        <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-card card">
                        <HiOutlineCheckCircle className="check-icon" />
                        <h4>All Caught Up!</h4>
                        <p>No more events today</p>
                    </div>
                )}
            </section>

            {/* Next 3 Days */}
            <section className="section">
                <h3 className="section-title">Next 3 Days</h3>
                <div className="next-days-row">
                    {[0, 1, 2].map((offset) => {
                        const date = new Date(currentTime);
                        date.setDate(date.getDate() + offset);
                        const isToday = offset === 0;
                        const dateString = date.toISOString().split('T')[0];
                        const count = dayStats[dateString] || 0;

                        return (
                            <div key={offset} className={`day-card card ${isToday ? 'active' : ''}`}>
                                <span className="day-name">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <div className={`day-number-circle ${isToday ? 'today' : ''}`}>
                                    {date.getDate()}
                                </div>
                                <div className={`event-chip ${count > 0 ? 'has-events' : 'no-events'}`}>
                                    {count} {count === 1 ? 'event' : 'events'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>


            {/* FAB */}
            <button className="fab-web" onClick={() => openCreateModal('class')}>
                <HiPlus /> New Event
            </button>

            {/* Modal */}
            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType={modalType}
            />
        </div>
    );
};

export default HomePage;
