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
    HiOutlineViewGrid
} from 'react-icons/hi';
import './EventsPage.css';
import AddEventModal from '../components/AddEventModal';

const EventsPage = () => {
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <div className="empty-events-state">
                    <div className="empty-icon-wrapper">
                        <HiOutlineCalendar className="empty-cal-icon" />
                    </div>
                    <h3>No events yet</h3>
                    <p>Tap + to create your first event</p>
                </div>
            </div>

            <button className="fab-web" onClick={() => setIsModalOpen(true)}>
                <HiPlus /> New Event
            </button>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType={filter === 'all' ? 'class' : filter}
            />
        </div>
    );
};

export default EventsPage;
