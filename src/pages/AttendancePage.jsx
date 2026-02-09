import { useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiChevronRight, HiOutlineChartPie, HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import MarkAttendanceModal from '../components/MarkAttendanceModal';
import './AttendancePage.css';

const AttendancePage = () => {
    const navigate = useNavigate();

    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await attendanceService.getStats();
            if (response.success) {
                // Backend returns: { "Subject": { total: 10, present: 8, ... } }
                const statsObj = response.data;

                const mapped = Object.entries(statsObj).map(([subject, stats], index) => {
                    const attended = stats.present + (stats.late || 0); // Include late as attended
                    const total = stats.total;
                    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

                    return {
                        id: index,
                        subject: subject,
                        attended: attended,
                        total: total,
                        percentage: percentage
                    };
                });
                setAttendanceData(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch attendance stats", error);
        } finally {
            setLoading(false);
        }
    };

    const overallPercentage = attendanceData.length > 0
        ? Math.round(
            (attendanceData.reduce((acc, curr) => acc + curr.attended, 0) /
                (attendanceData.reduce((acc, curr) => acc + curr.total, 0) || 1)) * 100
        )
        : 0;


    return (
        <div className="attendance-content fade-in">
            <header className="page-header-alt">
                <button className="back-btn-ghost" onClick={() => navigate(-1)}>
                    <HiOutlineChevronLeft />
                </button>
                <h2>Attendance Tracker</h2>
                <button className="icon-btn" onClick={() => setIsMarkModalOpen(true)}>
                    <HiPlus />
                </button>
            </header>

            <div className="overall-stats-card">
                <div className="stats-main">
                    <div className="percentage-circle">
                        <span className="percent-val">{overallPercentage}%</span>
                        <span className="percent-label">Overall</span>
                    </div>
                    <div className="stats-details">
                        <div className="stat-row">
                            <span className="dot success" />
                            <span>Total Attended: {attendanceData.reduce((acc, curr) => acc + curr.attended, 0)}</span>
                        </div>
                        <div className="stat-row">
                            <span className="dot error" />
                            <span>Total Classes: {attendanceData.reduce((acc, curr) => acc + curr.total, 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="subject-list-section">
                <h4 className="section-title">Your Subjects</h4>
                <div className="subject-list">
                    {attendanceData.map((subject) => (
                        <div key={subject.id} className="subject-card card">
                            <div className="subject-header">
                                <h3>{subject.subject}</h3>
                                <div className="subject-badge" style={{
                                    background: subject.percentage >= 75 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: subject.percentage >= 75 ? 'var(--success-green)' : 'var(--error-red)'
                                }}>
                                    {subject.percentage}%
                                </div>
                            </div>

                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${subject.percentage}%`, background: subject.percentage >= 75 ? 'var(--success-green)' : 'var(--error-red)' }} />
                            </div>

                            <div className="subject-footer">
                                <span>{subject.attended} attended of {subject.total}</span>
                                <button className="details-btn">
                                    Details <HiChevronRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <MarkAttendanceModal
                isOpen={isMarkModalOpen}
                onClose={() => setIsMarkModalOpen(false)}
                onAttendanceMarked={fetchAttendance}
            />
        </div>
    );
};

export default AttendancePage;
