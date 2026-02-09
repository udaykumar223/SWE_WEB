import React, { useState } from 'react';
import { HiOutlineX, HiOutlineCheckCircle, HiOutlineClock, HiOutlineAcademicCap, HiOutlineLocationMarker } from 'react-icons/hi';
import { timetableService } from '../services/timetableService';
import { toast } from 'react-toastify';
import './AddEventModal.css'; // Reusing styles

const AddTimetableModal = ({ isOpen, onClose, onEntryAdded }) => {
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [instructor, setInstructor] = useState('');
    const [room, setRoom] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');

    if (!isOpen) return null;

    const days = [
        { id: 1, label: 'M' },
        { id: 2, label: 'T' },
        { id: 3, label: 'W' },
        { id: 4, label: 'Th' },
        { id: 5, label: 'F' },
        { id: 6, label: 'S' },
        { id: 7, label: 'Su' }
    ];

    const toggleDay = (id) => {
        if (daysOfWeek.includes(id)) {
            setDaysOfWeek(daysOfWeek.filter(d => d !== id));
        } else {
            setDaysOfWeek([...daysOfWeek, id]);
        }
    };

    const handleSubmit = async () => {
        if (!courseName || daysOfWeek.length === 0) {
            toast.warn('Please enter a course name and select at least one day');
            return;
        }

        const entryData = {
            courseName,
            courseCode,
            instructor,
            room,
            daysOfWeek,
            startTime, // "HH:mm"
            endTime    // "HH:mm"
        };

        try {
            const response = await timetableService.createEntry(entryData);
            if (response.success) {
                toast.success('Timetable slot added successfully');
                if (onEntryAdded) onEntryAdded(response.data);
                onClose();
                // Reset
                setCourseName('');
                setDaysOfWeek([]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add timetable slot');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="header-left">
                        <div className="header-icon-box">
                            <HiOutlineAcademicCap />
                        </div>
                        <h2>Add Timetable Slot</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}><HiOutlineX /></button>
                </header>
                <div className="modal-body">
                    <div className="form-section fade-in">
                        <div className="input-field">
                            <label className="field-label-float">
                                <HiOutlineAcademicCap className="field-icon" />
                                <input type="text" placeholder="Course Name" value={courseName} onChange={e => setCourseName(e.target.value)} />
                            </label>
                        </div>
                        <div className="input-field">
                            <label className="field-label-float">
                                <HiOutlineLocationMarker className="field-icon" />
                                <input type="text" placeholder="Room/Location" value={room} onChange={e => setRoom(e.target.value)} />
                            </label>
                        </div>
                        <div className="days-selection">
                            <p className="label-text">Days</p>
                            <div className="days-grid">
                                {days.map(d => (
                                    <button key={d.id}
                                        className={`day-chip ${daysOfWeek.includes(d.id) ? 'active' : ''}`}
                                        onClick={() => toggleDay(d.id)}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="time-row">
                            <div className="input-field">
                                <label className="field-label-float">
                                    <HiOutlineClock className="field-icon" />
                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                </label>
                            </div>
                            <div className="input-field">
                                <label className="field-label-float">
                                    <HiOutlineClock className="field-icon" />
                                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="modal-footer">
                    <button className="btn-submit" onClick={handleSubmit}>
                        <HiOutlineCheckCircle /> Add Slot
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddTimetableModal;
