import React from 'react';
import {
    HiOutlineX,
    HiOutlineAcademicCap,
    HiOutlineClipboardList,
    HiOutlineInformationCircle,
    HiOutlineUsers,
    HiOutlineEmojiHappy,
    HiOutlineQuestionMarkCircle,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineMenuAlt2
} from 'react-icons/hi';
import './EventDetailsModal.css';

const EventDetailsModal = ({ isOpen, onClose, event }) => {
    if (!isOpen || !event) return null;

    const classifications = [
        { id: 'class', label: 'Class', icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.1)' },
        { id: 'exam', label: 'Exam', icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.1)' },
        { id: 'assignment', label: 'Assignment', icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.1)' },
        { id: 'meeting', label: 'Meeting', icon: HiOutlineUsers, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.1)' },
        { id: 'personal', label: 'Personal', icon: HiOutlineEmojiHappy, color: 'var(--personal-green)', bg: 'rgba(16, 185, 129, 0.1)' },
        { id: 'other', label: 'Other', icon: HiOutlineQuestionMarkCircle, color: 'var(--other-gray)', bg: 'rgba(107, 114, 128, 0.1)' },
    ];

    const getClassificationInfo = () => {
        return classifications.find(c => c.id === event.type) || classifications[5];
    };

    const typeInfo = getClassificationInfo();
    const Icon = typeInfo.icon;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container-details" onClick={e => e.stopPropagation()}>
                <header className="modal-header-details" style={{ background: typeInfo.bg }}>
                    <div className="header-icon-details" style={{ color: typeInfo.color, background: 'white' }}>
                        <Icon />
                    </div>
                    <button className="close-btn-details" onClick={onClose}>
                        <HiOutlineX />
                    </button>
                </header>

                <div className="modal-content-details">
                    <div className="main-info">
                        <span className="type-badge" style={{ color: typeInfo.color, background: typeInfo.bg, borderColor: typeInfo.color }}>
                            {typeInfo.label}
                        </span>
                        <h2 className="details-title">{event.title}</h2>
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <HiOutlineClock />
                            </div>
                            <div className="detail-text">
                                <span className="label">Time</span>
                                <p>{formatDate(event.startTime)}</p>
                                <p className="time-range">
                                    {formatTime(event.startTime)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                </p>
                            </div>
                        </div>

                        {event.location && (
                            <div className="detail-item">
                                <div className="detail-icon">
                                    <HiOutlineLocationMarker />
                                </div>
                                <div className="detail-text">
                                    <span className="label">Location</span>
                                    <p>{event.location}</p>
                                </div>
                            </div>
                        )}

                        {event.notes && (
                            <div className="detail-item full-width">
                                <div className="detail-icon">
                                    <HiOutlineMenuAlt2 />
                                </div>
                                <div className="detail-text">
                                    <span className="label">Notes</span>
                                    <p className="notes-text">{event.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
