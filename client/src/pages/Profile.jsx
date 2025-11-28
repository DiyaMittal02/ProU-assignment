import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Award, BookOpen, TrendingUp, Calendar, Trophy, Flame, Edit2, CheckCircle, Download, FileText } from 'lucide-react';
import Certificate from '../components/Certificate';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [showCertificate, setShowCertificate] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            setProfile(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/users/profile', formData);
            await fetchProfile();
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const calculateStats = () => {
        if (!profile?.quizScores || profile.quizScores.length === 0) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                totalPoints: 0,
                level: 1,
                streak: 0
            };
        }

        const totalQuizzes = profile.quizScores.length;
        const totalPercentage = profile.quizScores.reduce((sum, quiz) => sum + (quiz.percentage || 0), 0);
        const averageScore = Math.round(totalPercentage / totalQuizzes);
        const totalPoints = profile.points || 0;
        const level = profile.level || 1;
        const streak = profile.streak || 0;

        return {
            totalQuizzes,
            averageScore,
            totalPoints,
            level,
            streak
        };
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const handleViewCertificate = (score) => {
        setSelectedCertificate({
            userName: profile.name,
            quizTitle: score.quizTitle || 'Legal Quiz',
            score: score.percentage,
            date: score.completedAt, // Fixed: using completedAt instead of date
            certificateId: `CERT-${score._id ? score._id.substring(0, 8).toUpperCase() : Math.random().toString(36).substring(7).toUpperCase()}`
        });
        setShowCertificate(true);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const stats = calculateStats();

    // Filter passed quizzes for certificates (score >= 70%)
    const passedQuizzes = profile?.quizScores?.filter(score => score.percentage >= 70) || [];

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-avatar-container">
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {getInitials(profile?.name)}
                            </div>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="profile-edit-form">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Name"
                                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" onClick={() => setEditing(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2 className="profile-name">{profile?.name}</h2>
                            <div className="profile-email">
                                <Mail size={16} />
                                {profile?.email}
                            </div>

                            <div className="profile-level-badge">
                                Level {stats.level} Scholar
                            </div>

                            <button onClick={() => setEditing(true)} className="edit-profile-btn">
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>

                {/* Main Content */}
                <div className="profile-content">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon purple">
                                <Trophy size={24} />
                            </div>
                            <span className="stat-value">{stats.totalPoints}</span>
                            <span className="stat-label">Total Points</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon orange">
                                <Flame size={24} />
                            </div>
                            <span className="stat-value">{stats.streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green">
                                <CheckCircle size={24} />
                            </div>
                            <span className="stat-value">{stats.totalQuizzes}</span>
                            <span className="stat-label">Quizzes Completed</span>
                        </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="content-section">
                        <div className="section-header">
                            <h3 className="section-title">
                                <FileText size={24} className="text-primary" />
                                My Certificates
                            </h3>
                        </div>

                        {passedQuizzes.length > 0 ? (
                            <div className="certificates-grid">
                                {passedQuizzes.map((score, index) => (
                                    <div key={index} className="certificate-card" onClick={() => handleViewCertificate(score)}>
                                        <div className="certificate-icon">
                                            <Award size={24} />
                                        </div>
                                        <h4 className="certificate-card-title">{score.quizTitle || 'Legal Quiz Certificate'}</h4>
                                        <span className="certificate-date">
                                            Issued on {new Date(score.completedAt).toLocaleDateString()}
                                        </span>
                                        <button className="view-certificate-btn">
                                            <Download size={14} />
                                            View & Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Award className="empty-icon" />
                                <p>Complete quizzes with a passing score (70%+) to earn certificates!</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="content-section">
                        <div className="section-header">
                            <h3 className="section-title">
                                <TrendingUp size={24} className="text-primary" />
                                Recent Activity
                            </h3>
                        </div>

                        {profile?.quizScores && profile.quizScores.length > 0 ? (
                            <div className="activity-list">
                                {profile.quizScores.slice(0, 5).map((score, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon-wrapper">
                                            {score.percentage >= 80 ? '🏆' : score.percentage >= 60 ? '⭐' : '📝'}
                                        </div>
                                        <div className="activity-details">
                                            <h4 className="activity-title">{score.quizTitle || 'Legal Quiz'}</h4>
                                            <div className="activity-meta">
                                                <Calendar size={14} />
                                                {new Date(score.completedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="activity-score">
                                            {score.percentage}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <BookOpen className="empty-icon" />
                                <p>No recent activity. Start a quiz to see your progress!</p>
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="content-section">
                        <div className="section-header">
                            <h3 className="section-title">
                                <Award size={24} className="text-primary" />
                                Achievements
                            </h3>
                        </div>

                        <div className="achievements-grid">
                            <div className="achievement-card">
                                <span className="achievement-icon">🎓</span>
                                <h4 className="achievement-name">Novice</h4>
                                <p className="achievement-desc">Joined LegalAware</p>
                            </div>
                            {stats.totalQuizzes >= 1 && (
                                <div className="achievement-card">
                                    <span className="achievement-icon">📝</span>
                                    <h4 className="achievement-name">First Steps</h4>
                                    <p className="achievement-desc">Completed 1st Quiz</p>
                                </div>
                            )}
                            {stats.totalPoints >= 100 && (
                                <div className="achievement-card">
                                    <span className="achievement-icon">⭐</span>
                                    <h4 className="achievement-name">Rising Star</h4>
                                    <p className="achievement-desc">Earned 100 Points</p>
                                </div>
                            )}
                            {stats.streak >= 3 && (
                                <div className="achievement-card">
                                    <span className="achievement-icon">🔥</span>
                                    <h4 className="achievement-name">On Fire</h4>
                                    <p className="achievement-desc">3 Day Streak</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            {showCertificate && selectedCertificate && (
                <Certificate
                    show={showCertificate}
                    onClose={() => setShowCertificate(false)}
                    certificateData={selectedCertificate}
                />
            )}
        </div>
    );
};

export default Profile;
