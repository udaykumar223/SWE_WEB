import { useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HiPlus, HiOutlineViewGrid, HiOutlineCalendar } from 'react-icons/hi';
import './CalendarPage.css';
import AddEventModal from '../components/AddEventModal';
import EventDetailsModal from '../components/EventDetailsModal';

import { eventService } from '../services/eventService';
import { useEffect } from 'react';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await eventService.getEventsByDay(date);
            if (response.success) {
                setEvents(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="calendar-content fade-in">
            <header className="calendar-header">
                <h1 className="page-title">Calendar</h1>
                <button className="icon-btn header-action">
                    <HiOutlineViewGrid />
                </button>
            </header>

            <div className="calendar-container">
                <div className="calendar-wrapper card">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        className="custom-calendar"
                        calendarType="iso8601"
                        next2Label={null}
                        prev2Label={null}
                        formatShortWeekday={(locale, date) =>
                            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
                        }
                    />
                </div>

                <div className="events-list-section">
                    <h3 className="section-title">Events for {date.toLocaleDateString()}</h3>
                    {loading ? (
                        <p>Loading events...</p>
                    ) : events.length > 0 ? (
                        <div className="timeline-container">
                            {/* Vertical Line placed via CSS */}
                            <div className="timeline-line"></div>

                            {events
                                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                                .map(event => (
                                    <div key={event._id} className="timeline-item" onClick={() => {
                                        setSelectedEvent(event);
                                        setIsDetailsOpen(true);
                                    }} style={{ cursor: 'pointer' }}>
                                        <div className="timeline-time">
                                            {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="timeline-marker">
                                            <div className={`timeline-dot ${event.type}`}></div>
                                        </div>
                                        <div className={`timeline-content card ${event.type}`}>
                                            <div className="timeline-card-header">
                                                <h4 className="timeline-title">{event.title}</h4>
                                                <span className={`timeline-badge ${event.type}`}>{event.type}</span>
                                            </div>
                                            <div className="timeline-card-body">
                                                <div className="timeline-row">
                                                    <span className="timeline-date">
                                                        {new Date(event.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                {event.location && (
                                                    <div className="timeline-row">
                                                        <span className="timeline-loc">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="empty-events-state">
                            <div className="empty-icon-wrapper">
                                <HiOutlineCalendar className="empty-cal-icon" />
                            </div>
                            <h3>No events for this day</h3>
                            <p>Tap + to add an event</p>
                        </div>
                    )}
                </div>
            </div>

            <button className="calendar-fab" onClick={() => setIsModalOpen(true)}>
                <HiPlus /> New Event
            </button>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEventAdded={() => fetchEvents()}
                initialType="class"
            />

            <EventDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
};

export default CalendarPage;
