import React, { useState, useEffect } from 'react';
import {
    HiOutlineX,
    HiOutlineAcademicCap,
    HiOutlinePencilAlt,
    HiOutlineFolder,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineMenuAlt2,
    HiOutlineInformationCircle,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineEmojiHappy,
    HiOutlineCheckCircle,
    HiOutlineStar,
    HiOutlineBell,
    HiOutlineMicrophone,
    HiOutlinePlus,
    HiChevronDown,
    HiStar
} from 'react-icons/hi';
import './AddEventModal.css';
import { eventService } from '../services/eventService';
import { toast } from 'react-toastify';

const AddEventModal = ({ isOpen, onClose, onEventAdded, initialType = 'class' }) => {
    const [activeTab, setActiveTab] = useState('Details');
    const [classification, setClassification] = useState(initialType);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('No category');
    const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(() => new Date(Date.now() + 3600000).toISOString().slice(0, 16));
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Advanced tab state
    const [priority, setPriority] = useState('Medium');
    const [isImportant, setIsImportant] = useState(false);
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        setClassification(initialType);
    }, [initialType, isOpen]);

    if (!isOpen) return null;

    const classifications = [
        { id: 'class', label: 'Class', icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.1)' },
        { id: 'exam', label: 'Exam', icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.1)' },
        { id: 'assignment', label: 'Assignment', icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.1)' },
        { id: 'meeting', label: 'Meeting', icon: HiOutlineUsers, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.1)' },
        { id: 'personal', label: 'Personal', icon: HiOutlineEmojiHappy, color: 'var(--personal-green)', bg: 'rgba(16, 185, 129, 0.1)' },
        { id: 'other', label: 'Other', icon: HiOutlineQuestionMarkCircle, color: 'var(--other-gray)', bg: 'rgba(107, 114, 128, 0.1)' },
    ];


    const categories = ['No category', 'General', 'Mathematics', 'Science', 'Language', 'Social Studies'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const tabs = ['Details', 'Advanced', 'Notes'];

    const handleCreate = async () => {
        if (!title.trim()) {
            toast.warn('Please enter an event title');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            toast.warn('End time cannot be before start time');
            return;
        }

        const eventData = {
            title,
            type: classification,
            category,
            startTime: startDate, // Map to backend schema
            endTime: endDate,     // Map to backend schema
            location,
            notes,
            priority: priority.toLowerCase(),
            important: isImportant,
            reminders,
            classification: classification, // Ensure backend gets this
            // date: new Date(startDate).toISOString() // Logic removed as startTime covers it
        };

        try {
            const response = await eventService.createEvent(eventData);
            if (response.success) {
                toast.success('Event created successfully');
                if (onEventAdded) onEventAdded(response.data);
                onClose();
                // Reset form
                setTitle('');
                setCategory('No category');
                setPriority('Medium');
                setIsImportant(false);
            }
        } catch (error) {
            console.error('Failed to create event:', error);
            toast.error('Failed to save event');
        }
    };


    const getClassificationIcon = () => {
        const cls = classifications.find(c => c.id === classification);
        return cls ? cls.icon : HiOutlineAcademicCap;
    };

    const formatDateForDisplay = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ' • ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const ClassificationIcon = getClassificationIcon();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="modal-header">
                    <div className="header-left">
                        <div className="header-icon-box">
                            <ClassificationIcon />
                        </div>
                        <div className="header-text">
                            <h2>Create Event</h2>
                            <p>{classification.charAt(0).toUpperCase() + classification.slice(1)}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <HiOutlineX />
                    </button>
                </header>

                {/* Tabs */}
                <div className="modal-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="modal-body">
                    {activeTab === 'Details' && (
                        <div className="form-section fade-in">
                            <div className="input-field">
                                <label className="field-label-float">
                                    <HiOutlinePencilAlt className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="Event Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="classification-section">
                                <span className="label-text">Classification</span>
                                <div className="chips-grid">
                                    {classifications.map(type => {
                                        const Icon = type.icon;
                                        const isActive = classification === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                className={`type-chip ${isActive ? 'active' : ''}`}
                                                style={{
                                                    '--chip-color': type.color,
                                                    '--chip-bg': type.bg,
                                                    borderColor: isActive ? type.color : 'var(--border-color)',
                                                    background: isActive ? type.bg : 'transparent',
                                                    color: isActive ? type.color : 'var(--text-secondary)'
                                                }}
                                                onClick={() => setClassification(type.id)}
                                            >
                                                <Icon className="chip-icon" />
                                                <span>{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="input-field">
                                <span className="field-tag">Category (Optional)</span>
                                <div className="custom-dropdown">
                                    <div
                                        className="field-label-float dropdown-trigger"
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    >
                                        <HiOutlineFolder className="field-icon" />
                                        <div className="dropdown-mock">
                                            <span>{category}</span>
                                            <HiChevronDown className={`dropdown-arrow ${isCategoryOpen ? 'open' : ''}`} />
                                        </div>
                                    </div>
                                    {isCategoryOpen && (
                                        <div className="dropdown-options fade-in">
                                            {categories.map(cat => (
                                                <div
                                                    key={cat}
                                                    className={`option-item ${category === cat ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                >
                                                    {cat}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="date-time-group">
                                <div className="input-field">
                                    <span className="field-tag">Start Date/Time</span>
                                    <label className="field-label-float">
                                        <HiOutlineCalendar className="field-icon" />
                                        <input
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                // Auto-adjust end date if it becomes before start date
                                                if (endDate < e.target.value) {
                                                    const newStart = new Date(e.target.value);
                                                    const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000); // +1 hour
                                                    // Handle timezone offset for datetime-local
                                                    const tzOffset = newEnd.getTimezoneOffset() * 60000;
                                                    const localISOTime = (new Date(newEnd - tzOffset)).toISOString().slice(0, 16);
                                                    setEndDate(localISOTime);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="input-field">
                                    <span className="field-tag">End Date/Time</span>
                                    <label className="field-label-float">
                                        <HiOutlineCalendar className="field-icon" />
                                        <input
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="input-field">
                                <label className="field-label-float">
                                    <HiOutlineLocationMarker className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="Location (Optional)"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="input-field">
                                <label className="field-label-last textarea-field">
                                    <HiOutlineMenuAlt2 className="field-icon" />
                                    <textarea
                                        placeholder="Notes (Optional)"
                                        rows="3"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Advanced' && (
                        <div className="form-section fade-in">
                            <div className="priority-section">
                                <span className="label-text">Priority Level</span>
                                <div className="priority-chips">
                                    {priorities.map(p => (
                                        <button
                                            key={p}
                                            className={`priority-chip ${priority === p ? 'active' : ''} ${p.toLowerCase()}`}
                                            onClick={() => setPriority(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="important-toggle-card">
                                <div className="toggle-info">
                                    <div className="toggle-icon-bg">
                                        <HiOutlineStar />
                                    </div>
                                    <div className="toggle-text">
                                        <h4>Mark as Important</h4>
                                        <p>Highlight this event with a star</p>
                                    </div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isImportant}
                                        onChange={(e) => setIsImportant(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="reminders-section">
                                <div className="reminders-header">
                                    <span className="label-text">Reminders ({reminders.length})</span>
                                    <button className="add-reminder-btn">
                                        <HiOutlineBell /> Add Reminder
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notes' && (
                        <div className="form-section fade-in">
                            <div className="voice-notes-header">
                                <span className="label-text">Voice Notes (0)</span>
                                <button className="record-btn">
                                    <HiOutlineMicrophone /> Record
                                </button>
                            </div>
                            <div className="voice-notes-empty">
                                <div className="empty-mic-icon">
                                    <HiOutlineMicrophone />
                                </div>
                                <h4>No voice notes yet</h4>
                                <p>Tap "Record" to add a voice note</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="modal-footer">
                    <button className="btn-submit" onClick={handleCreate}>
                        <HiOutlineCheckCircle /> Create Event
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddEventModal;

