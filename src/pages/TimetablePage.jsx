import { useState } from 'react';
import { HiOutlineChevronLeft, HiPlus, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { timetableService } from '../services/timetableService';
import { useEffect } from 'react';
import './TimetablePage.css';

const TimetablePage = () => {
    const navigate = useNavigate();
    const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
    const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTimetable();
    }, [selectedDayIndex]);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const response = await timetableService.getTimetable();
            if (response.success) {
                // Filter for selected day (1=Monday, 7=Sunday)
                // Backend daysOfWeek: 1=Monday...
                // selectedDayIndex: 0=Monday... 
                const currentDayBackend = selectedDayIndex + 1;

                const filtered = response.data.filter(entry =>
                    entry.daysOfWeek.includes(currentDayBackend)
                );

                // Map to UI format
                const mapped = filtered.map(entry => ({
                    id: entry._id,
                    time: `${entry.startTime.hour.toString().padStart(2, '0')}:${entry.startTime.minute.toString().padStart(2, '0')} - ${entry.endTime.hour.toString().padStart(2, '0')}:${entry.endTime.minute.toString().padStart(2, '0')}`,
                    subject: entry.courseName,
                    code: entry.courseCode || '',
                    professor: entry.instructor || '',
                    room: entry.room || 'TBA'
                }));

                setSchedule(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch timetable", error);
        } finally {
            setLoading(false);
        }
    };

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
                    {loading ? (
                        <p>Loading...</p>
                    ) : schedule.length > 0 ? (
                        schedule.map((item) => (
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
