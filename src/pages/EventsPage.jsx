import { useState } from 'react';
import {
    HiPlus,
    HiOutlineFilter,
    HiOutlineAcademicCap,
    HiOutlineClipboardList,
    HiOutlineInformationCircle,
    HiOutlineUsers,
    HiOutlineBookmark,
    HiOutlineCalendar,
    HiOutlineViewGrid,
    HiOutlineTrash
} from 'react-icons/hi';
import './EventsPage.css';
import AddEventModal from '../components/AddEventModal';
import EventDetailsModal from '../components/EventDetailsModal';
import { eventService } from '../services/eventService';
import { attendanceService } from '../services/attendanceService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const EventsPage = () => {
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Details Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await eventService.getEvents();
            if (response.success) {
                // Add local state for attendance if needed, though we might just fire-and-forget
                setEvents(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await eventService.deleteEvent(id);
                if (response.success) {
                    toast.success('Event deleted');
                    fetchEvents();
                }
            } catch (error) {
                console.error("Failed to delete event", error);
                toast.error("Failed to delete event");
            }
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsDetailsOpen(true);
    };

    const handleAttendance = async (event, status) => {
        try {
            const record = {
                courseName: event.title,
                status: status, // 'present', 'absent', 'cancelled'
                date: new Date(event.startTime).toISOString()
            };

            const response = await attendanceService.markAttendance(record);
            if (response.success) {
                toast.success(`Marked as ${status}`);
                // Optional: Update local state to show it's marked
                // For now, simpler to just show toast
            }
        } catch (error) {
            console.error("Failed to mark attendance", error);
            toast.error("Failed to mark attendance");
        }
    };

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(e => e.type === filter);

    const categories = [
        { id: 'all', label: 'All', icon: HiOutlineViewGrid },
        { id: 'class', label: 'Class', icon: HiOutlineAcademicCap },
        { id: 'exam', label: 'Exam', icon: HiOutlineInformationCircle },
        { id: 'assignment', label: 'Assignment', icon: HiOutlineClipboardList },
        { id: 'meeting', label: 'Meeting', icon: HiOutlineUsers },
        { id: 'personal', label: 'Personal', icon: HiOutlineBookmark },
        { id: 'other', label: 'Other', icon: HiOutlineCalendar },
    ];

    return (
        <div className="events-content fade-in">
            <header className="events-header">
                <h1 className="page-title">Events</h1>
                <button className="icon-btn header-action">
                    <HiOutlineFilter />
                </button>
            </header>

            <div className="filter-scroll">
                <div className="filter-chips">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`chip ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <cat.icon className="chip-icon" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="events-main-area">
                {loading ? (
                    <p>Loading...</p>
                ) : filteredEvents.length > 0 ? (
                    <div className="events-list-page">
                        {filteredEvents.map(event => (
                            <div
                                key={event._id}
                                className={`event-card-premium ${event.type}`}
                                onClick={() => handleEventClick(event)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="event-card-left">
                                    <div className="event-time-box">
                                        <span className="event-time-start">
                                            {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="event-time- date">
                                            {new Date(event.startTime).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="vertical-divider"></div>
                                    <div className="event-info-box">
                                        <div className="event-header-row">
                                            <span className={`event-type-badge ${event.type}`}>{event.type}</span>
                                            {event.location && <span className="event-location-badge">{event.location}</span>}
                                            <button className="delete-btn-icon" onClick={(e) => handleDelete(e, event._id)}>
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                        <h3 className="event-title-premium">{event.title}</h3>
                                        <p className="event-notes-truncate">{event.notes || 'No notes'}</p>
                                    </div>
                                </div>

                                {event.type === 'class' && (
                                    <div className="event-card-right" onClick={e => e.stopPropagation()}>
                                        <div className="attendance-actions">
                                            <button
                                                className="btn-attend present"
                                                onClick={() => handleAttendance(event, 'present')}
                                            >
                                                Present
                                            </button>
                                            <button
                                                className="btn-attend absent"
                                                onClick={() => handleAttendance(event, 'absent')}
                                            >
                                                Absent
                                            </button>
                                            <button
                                                className="btn-attend cancelled"
                                                onClick={() => handleAttendance(event, 'cancelled')}
                                            >
                                                Cancelled
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-events-state">
                        <div className="empty-icon-wrapper">
                            <HiOutlineCalendar className="empty-cal-icon" />
                        </div>
                        <h3>No events yet</h3>
                        <p>Tap + to create your first event</p>
                    </div>
                )}
            </div>

            <button className="fab-web" onClick={() => setIsModalOpen(true)}>
                <HiPlus /> New Event
            </button>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType={filter === 'all' ? 'class' : filter}
                onEventAdded={fetchEvents}
            />

            <EventDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
};

export default EventsPage;
