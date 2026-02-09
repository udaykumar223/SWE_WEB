import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HiPlus, HiOutlineViewGrid, HiOutlineCalendar } from 'react-icons/hi';
import './CalendarPage.css';
import AddEventModal from '../components/AddEventModal';

import { eventService } from '../services/eventService';
import { useEffect } from 'react';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, [date]);

    const fetchEvents = async () => {
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
    };

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
                        <div className="events-list">
                            {events.map(event => (
                                <div key={event._id} className={`event-card ${event.type}`}>
                                    <div className="event-time">
                                        {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="event-details">
                                        <h4>{event.title}</h4>
                                        <p>{event.location}</p>
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
        </div>
    );
};

export default CalendarPage;
