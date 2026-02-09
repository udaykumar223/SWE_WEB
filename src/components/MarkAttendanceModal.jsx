import React, { useState } from 'react';
import { HiOutlineX, HiOutlineCheckCircle, HiOutlineAcademicCap } from 'react-icons/hi';
import { attendanceService } from '../services/attendanceService';
import './AddEventModal.css';

const MarkAttendanceModal = ({ isOpen, onClose, onAttendanceMarked }) => {
    const [courseName, setCourseName] = useState('');
    const [status, setStatus] = useState('present');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!courseName) return;

        const record = {
            courseName,
            status,
            date: new Date(date).toISOString()
        };

        try {
            const response = await attendanceService.markAttendance(record);
            if (response.success) {
                if (onAttendanceMarked) onAttendanceMarked(response.data);
                onClose();
                setCourseName('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="header-left">
                        <h2>Mark Attendance</h2>
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
                                <select value={status} onChange={e => setStatus(e.target.value)} className="custom-select">
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                    <option value="excused">Excused</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </label>
                        </div>
                        <div className="input-field">
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="date-input" />
                        </div>
                    </div>
                </div>
                <footer className="modal-footer">
                    <button className="btn-submit" onClick={handleSubmit}>
                        <HiOutlineCheckCircle /> Save
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MarkAttendanceModal;
