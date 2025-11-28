import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, TrendingUp, Flame } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all');

    useEffect(() => {
        fetchLeaderboard();
    }, [period]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/gamification/leaderboard?period=${period}&limit=10`);
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="rank-icon gold" />;
        if (index === 1) return <Medal className="rank-icon silver" />;
        if (index === 2) return <Medal className="rank-icon bronze" />;
        return <span className="rank-number">#{index + 1}</span>;
    };

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>
                    <Trophy size={28} />
                    Leaderboard
                </h2>
                <div className="period-selector">
                    <button
                        className={`period-btn ${period === 'all' ? 'active' : ''}`}
                        onClick={() => setPeriod('all')}
                    >
                        All Time
                    </button>
                    <button
                        className={`period-btn ${period === 'month' ? 'active' : ''}`}
                        onClick={() => setPeriod('month')}
                    >
                        This Month
                    </button>
                    <button
                        className={`period-btn ${period === 'week' ? 'active' : ''}`}
                        onClick={() => setPeriod('week')}
                    >
                        This Week
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="leaderboard-list">
                    {leaderboard.map((user, index) => (
                        <div key={user._id} className={`leaderboard-item rank-${index + 1}`}>
                            <div className="rank-badge">
                                {getRankIcon(index)}
                            </div>

                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="user-info">
                                <h4>{user.name}</h4>
                                <div className="user-stats">
                                    <span className="stat">
                                        <Award size={14} />
                                        Level {user.level}
                                    </span>
                                    {user.streak > 0 && (
                                        <span className="stat streak">
                                            <Flame size={14} />
                                            {user.streak} day streak
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="user-points">
                                <span className="points-value">{user.points}</span>
                                <span className="points-label">points</span>
                            </div>

                            {user.achievements && user.achievements.length > 0 && (
                                <div className="user-achievements">
                                    {user.achievements.slice(0, 3).map((achievement, i) => (
                                        <span key={i} className="achievement-badge" title={achievement.name}>
                                            {achievement.icon}
                                        </span>
                                    ))}
                                    {user.achievements.length > 3 && (
                                        <span className="achievement-more">+{user.achievements.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
