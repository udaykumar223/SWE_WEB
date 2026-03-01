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
    HiOutlineQuestionMarkCircle,
    HiOutlineExclamation,
    HiOutlineFire,
    HiX
} from 'react-icons/hi';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddEventModal from '../components/AddEventModal';
import EventDetailsModal from '../components/EventDetailsModal';
import { eventService } from '../services/eventService';
import { aiService } from '../services/aiService';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('class');
    const [dayStats, setDayStats] = useState({});

    // Details Modal
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Wellness alerts state
    const [procrastinationAlert, setProcrastinationAlert] = useState(null);
    const [burnoutAlert, setBurnoutAlert] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState({});

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch wellness data on mount
    useEffect(() => {
        const fetchWellness = async () => {
            try {
                const [procData, burnData] = await Promise.all([
                    aiService.getProcrastinationAnalysis().catch(() => null),
                    aiService.getBurnoutAnalysis().catch(() => null)
                ]);
                if (procData && procData.warning && procData.warning !== 'OK') {
                    setProcrastinationAlert(procData);
                }
                if (burnData && burnData.burnoutRisk) {
                    setBurnoutAlert(burnData);
                }
            } catch (err) {
                console.error('Wellness fetch failed:', err);
            }
        };
        fetchWellness();
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

    const fetchStats = async () => {
        try {
            // Fetch Today's Stats
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
                    .filter(e => new Date(e.startTime) > new Date())
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .slice(0, 3);
                setUpcomingEvents(upcoming);
            }

            // Fetch Day Stats (Next 3 Days)
            const stats = {};
            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateString = date.toISOString().split('T')[0];
                const response = await eventService.getCountsForDay(date);
                stats[dateString] = response.data.count;
            }
            setDayStats(stats);

        } catch (error) {
            console.error("Failed to fetch home stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [currentTime]);

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
            {/* Wellness Alerts */}
            {procrastinationAlert && !dismissedAlerts.procrastination && (
                <div className="wellness-alert wellness-alert-warning">
                    <div className="alert-icon-wrap">
                        <HiOutlineExclamation />
                    </div>
                    <div className="alert-body">
                        <strong>Procrastination Detected</strong>
                        <p className="alert-reason">{procrastinationAlert.warning}</p>
                        <div className="alert-details">
                            <div className="alert-stat-row">
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{procrastinationAlert.procrastinationScore}</span>
                                    <span className="alert-stat-label">Procrastination Score</span>
                                </div>
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{procrastinationAlert.missedDeadlines}</span>
                                    <span className="alert-stat-label">Missed Deadlines</span>
                                </div>
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{procrastinationAlert.rushingTasks}</span>
                                    <span className="alert-stat-label">Rushing Tasks</span>
                                </div>
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{procrastinationAlert.totalTasks}</span>
                                    <span className="alert-stat-label">Total Tasks Tracked</span>
                                </div>
                            </div>
                            <div className="alert-explain">
                                <p><strong>How is this detected?</strong></p>
                                <ul>
                                    <li><strong>Missed Deadlines:</strong> Assignments/exams that passed their due date but are still incomplete.</li>
                                    <li><strong>Rushing Tasks:</strong> Tasks where over 80% of the time between creation and deadline has passed, and the task is still not done — a sign of "last minute" behavior.</li>
                                </ul>
                                <p className="alert-tip">💡 <strong>Tip:</strong> Start your assignments early! Break big tasks into smaller sub-tasks and tackle them across multiple days.</p>
                            </div>
                        </div>
                    </div>
                    <button className="alert-dismiss" onClick={() => setDismissedAlerts(prev => ({ ...prev, procrastination: true }))}>
                        <HiX />
                    </button>
                </div>
            )}
            {burnoutAlert && !dismissedAlerts.burnout && (
                <div className="wellness-alert wellness-alert-danger">
                    <div className="alert-icon-wrap">
                        <HiOutlineFire />
                    </div>
                    <div className="alert-body">
                        <strong>Burnout Risk Detected</strong>
                        <p className="alert-reason">You've been consistently overloaded. Take a step back and prioritize rest.</p>
                        <div className="alert-details">
                            <div className="alert-stat-row">
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{burnoutAlert.averageDailyWorkload} min</span>
                                    <span className="alert-stat-label">Avg Daily Workload</span>
                                </div>
                                <div className="alert-stat">
                                    <span className="alert-stat-value">{burnoutAlert.overloadDays}</span>
                                    <span className="alert-stat-label">Overloaded Days (of 7)</span>
                                </div>
                            </div>
                            <div className="alert-explain">
                                <p><strong>How is this detected?</strong></p>
                                <ul>
                                    <li><strong>Daily Threshold:</strong> Any day where your total task workload exceeds <strong>8 hours (480 minutes)</strong> is flagged as an overloaded day.</li>
                                    <li><strong>Burnout Trigger:</strong> If half or more of the last 7 days were overloaded, you're at risk of burnout.</li>
                                </ul>
                                <p className="alert-tip">💡 <strong>Tip:</strong> Use the AI Study Planner to spread your tasks more evenly, and schedule breaks between study sessions.</p>
                            </div>
                        </div>
                    </div>
                    <button className="alert-dismiss" onClick={() => setDismissedAlerts(prev => ({ ...prev, burnout: true }))}>
                        <HiX />
                    </button>
                </div>
            )}

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
                            <div key={event._id} className="event-card-home card" onClick={() => {
                                setSelectedEvent(event);
                                setIsDetailsOpen(true);
                            }} style={{ cursor: 'pointer' }}>
                                <div className={`event-type-indicator ${event.type}`} />
                                <div className="event-info-home">
                                    <h4>{event.title}</h4>
                                    <div className="event-meta-home">
                                        <HiOutlineClock />
                                        <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            {/* Modal */}
            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType={modalType}
                onEventAdded={() => {
                    // Re-fetch stats and events
                    const fetchStats = async () => {
                        try {
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

                                const upcoming = events
                                    .filter(e => new Date(e.startTime) > new Date())
                                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                                    .slice(0, 3);
                                setUpcomingEvents(upcoming);
                            }

                            // Also refresh day stats chart if needed
                            const stats = {};
                            for (let i = 0; i < 3; i++) {
                                const date = new Date();
                                date.setDate(date.getDate() + i);
                                const dateString = date.toISOString().split('T')[0];
                                const response = await eventService.getCountsForDay(date);
                                stats[dateString] = response.data.count;
                            }
                            setDayStats(stats);
                        } catch (error) {
                            console.error("Failed to refresh home stats", error);
                        }
                    };
                    fetchStats();
                }}
            />

            <EventDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
};

export default HomePage;
