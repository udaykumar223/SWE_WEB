import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HiPlus, HiOutlineViewGrid, HiOutlineCalendar } from 'react-icons/hi';
import './CalendarPage.css';
import AddEventModal from '../components/AddEventModal';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                <div className="empty-events-state">
                    <div className="empty-icon-wrapper">
                        <HiOutlineCalendar className="empty-cal-icon" />
                    </div>
                    <h3>No events for this day</h3>
                    <p>Tap + to add an event</p>
                </div>
            </div>

            <button className="calendar-fab" onClick={() => setIsModalOpen(true)}>
                <HiPlus /> New Event
            </button>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType="class"
            />
        </div>
    );
};

export default CalendarPage;
