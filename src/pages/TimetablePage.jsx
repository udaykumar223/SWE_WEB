import { useState } from 'react';
import { HiOutlineChevronLeft, HiPlus, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './TimetablePage.css';

const TimetablePage = () => {
    const navigate = useNavigate();
    const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
    const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

    const mockSchedule = [];

    return (
        <div className="timetable-content fade-in">
            <header className="timetable-header">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <HiOutlineChevronLeft />
                    </button>
                    <h2>Weekly Timetable</h2>
                </div>

                <div className="days-tab">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            className={`day-tab-item ${selectedDayIndex === idx ? 'active' : ''}`}
                            onClick={() => setSelectedDayIndex(idx)}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </header>

            <div className="schedule-section">
                <h4 className="day-title">{fullDays[selectedDayIndex]}</h4>

                <div className="schedule-list">
                    {mockSchedule.length > 0 ? (
                        mockSchedule.map((item) => (
                            <div key={item.id} className="schedule-card card">
                                <div className="schedule-time-line">
                                    <HiOutlineClock className="time-icon" />
                                    <span>{item.time}</span>
                                </div>
                                <div className="schedule-info">
                                    <h3>{item.subject}</h3>
                                    <p className="subject-code">{item.code} • {item.professor}</p>
                                    <div className="schedule-location">
                                        <HiOutlineLocationMarker />
                                        <span>{item.room}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-schedule-state">
                            <p>No classes scheduled for this day</p>
                        </div>
                    )}
                </div>
            </div>


            <button className="fab">
                <HiPlus /> Add Slot
            </button>
        </div>
    );
};

export default TimetablePage;
