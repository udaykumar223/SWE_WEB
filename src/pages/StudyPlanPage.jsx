import { useState } from 'react';
import { aiService } from '../services/aiService';
import {
    HiOutlineSparkles,
    HiOutlineClock,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineLightningBolt,
    HiOutlineCalendar
} from 'react-icons/hi';
import './StudyPlanPage.css';

const StudyPlanPage = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [studyPlan, setStudyPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setStudyPlan(null);
        try {
            const data = await aiService.generateStudyPlan(selectedDate);
            setStudyPlan(data);
        } catch (err) {
            console.error('Study plan generation failed:', err);
            setError(
                err.response?.data?.message ||
                'Failed to generate study plan. Please ensure the backend is running and you have events/tasks configured.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getSessionIcon = (type) => {
        switch (type) {
            case 'study': return <HiOutlineBookOpen />;
            case 'class': case 'lecture': return <HiOutlineAcademicCap />;
            case 'break': return <HiOutlineLightningBolt />;
            default: return <HiOutlineClock />;
        }
    };

    const getSessionColor = (type) => {
        switch (type) {
            case 'study': return 'var(--accent-purple)';
            case 'class': case 'lecture': return 'var(--class-blue)';
            case 'break': return 'var(--success-green)';
            default: return 'var(--other-gray)';
        }
    };

    const getSessionBg = (type) => {
        switch (type) {
            case 'study': return 'rgba(139, 92, 246, 0.08)';
            case 'class': case 'lecture': return 'rgba(59, 130, 246, 0.08)';
            case 'break': return 'rgba(16, 185, 129, 0.08)';
            default: return 'rgba(107, 114, 128, 0.08)';
        }
    };

    return (
        <div className="studyplan-content fade-in">
            {/* Header */}
            <header className="studyplan-header">
                <div className="header-text">
                    <h1><HiOutlineSparkles className="header-icon" /> AI Study Planner</h1>
                    <p>Generate a personalized study schedule powered by Gemini AI</p>
                </div>
            </header>

            {/* Controls */}
            <section className="studyplan-controls card">
                <div className="controls-row">
                    <div className="date-input-group">
                        <HiOutlineCalendar className="input-icon" />
                        <input
                            id="study-plan-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <HiOutlineSparkles /> Generate Plan
                            </>
                        )}
                    </button>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="studyplan-error card">
                    <p>❌ {error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="studyplan-loading">
                    <div className="ai-loader">
                        <HiOutlineSparkles className="pulse-icon" />
                        <p>AI is crafting your perfect schedule...</p>
                        <span className="text-small">This may take a few seconds</span>
                    </div>
                </div>
            )}

            {/* Results */}
            {studyPlan && !loading && (
                <div className="studyplan-results fade-in">
                    {/* Summary Card */}
                    {studyPlan.summary && (
                        <div className="summary-card card">
                            <HiOutlineSparkles className="summary-icon" />
                            <p>{studyPlan.summary}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <section className="timeline-section">
                        <h3 className="section-title">Your Schedule</h3>
                        <div className="timeline">
                            {studyPlan.sessions && studyPlan.sessions.map((session, index) => (
                                <div
                                    key={index}
                                    className="timeline-item"
                                    style={{ '--session-color': getSessionColor(session.type) }}
                                >
                                    <div className="timeline-marker">
                                        <div className="marker-dot" style={{ background: getSessionColor(session.type) }}></div>
                                        {index < studyPlan.sessions.length - 1 && (
                                            <div className="marker-line"></div>
                                        )}
                                    </div>
                                    <div
                                        className="timeline-card card"
                                        style={{ background: getSessionBg(session.type) }}
                                    >
                                        <div className="session-header">
                                            <div className="session-icon" style={{ color: getSessionColor(session.type) }}>
                                                {getSessionIcon(session.type)}
                                            </div>
                                            <div className="session-info">
                                                <h4>{session.task}</h4>
                                                <span className="session-type-badge" style={{
                                                    color: getSessionColor(session.type),
                                                    background: getSessionBg(session.type)
                                                }}>
                                                    {session.type}
                                                </span>
                                            </div>
                                            <div className="session-time">
                                                <HiOutlineClock />
                                                <span>{session.startTime} – {session.endTime}</span>
                                            </div>
                                        </div>
                                        {session.note && (
                                            <p className="session-note">{session.note}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {/* Empty State */}
            {!studyPlan && !loading && !error && (
                <div className="studyplan-empty card">
                    <HiOutlineSparkles className="empty-icon" />
                    <h4>Ready to Plan Your Day?</h4>
                    <p>Select a date and hit "Generate Plan" to get an AI-powered study schedule tailored to your tasks and classes.</p>
                </div>
            )}
        </div>
    );
};

export default StudyPlanPage;
