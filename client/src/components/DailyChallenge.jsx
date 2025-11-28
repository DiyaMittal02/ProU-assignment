import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, CheckCircle, Gift, Flame } from 'lucide-react';
import './DailyChallenge.css';

const DailyChallenge = () => {
    const [challenge, setChallenge] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyChallenge();
    }, []);

    const fetchDailyChallenge = async () => {
        try {
            const response = await axios.get('/api/gamification/daily-challenge');
            setChallenge(response.data);
            setCompleted(response.data.completed);
        } catch (error) {
            console.error('Error fetching daily challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="daily-challenge-card card">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="daily-challenge-card card completed">
                <div className="challenge-completed">
                    <CheckCircle size={48} className="completed-icon" />
                    <h3>Challenge Completed!</h3>
                    <p>You've earned <strong>{challenge.points} points</strong> today!</p>
                    <p className="comeback-text">Come back tomorrow for a new challenge</p>
                </div>
            </div>
        );
    }

    return (
        <div className="daily-challenge-card card">
            <div className="challenge-header">
                <div className="challenge-icon">
                    <Target size={32} />
                </div>
                <div>
                    <h3>Daily Challenge</h3>
                    <p className="challenge-subtitle">Complete to earn bonus points!</p>
                </div>
            </div>

            <div className="challenge-content">
                <div className="challenge-emoji">{challenge.challenge.icon}</div>
                <h4>{challenge.challenge.title}</h4>
                <p>{challenge.challenge.description}</p>

                <div className="challenge-reward">
                    <Gift size={20} />
                    <span><strong>{challenge.challenge.points}</strong> points</span>
                </div>
            </div>

            <div className="challenge-footer">
                <div className="challenge-hint">
                    <Flame size={16} />
                    <span>Complete daily challenges to build your streak!</span>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenge;
