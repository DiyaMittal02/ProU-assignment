import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Clock, Award, TrendingUp, Filter, Play, CheckCircle } from 'lucide-react';
import './Quiz.css';

const Quiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Constitutional Law',
        'Criminal Law',
        'Civil Rights',
        'Family Law',
        'Property Law',
        'Labor Law',
        'Consumer Rights',
        'Environmental Law',
        'General'
    ];

    useEffect(() => {
        fetchQuizzes();
    }, [selectedCategory]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory !== 'All') {
                params.category = selectedCategory;
            }

            const response = await axios.get('/api/quiz', { params });
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'difficulty-easy';
            case 'Medium': return 'difficulty-medium';
            case 'Hard': return 'difficulty-hard';
            default: return 'difficulty-medium';
        }
    };

    return (
        <div className="quiz-page">
            <div className="quiz-header">
                <h1 className="quiz-title">Legal Knowledge Quizzes</h1>
                <p className="quiz-subtitle">
                    Test your understanding of legal concepts and track your progress
                </p>

                <div className="quiz-controls" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                    <div className="category-filter" style={{ position: 'relative', minWidth: '250px' }}>
                        <Filter size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                            style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', appearance: 'none', cursor: 'pointer' }}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="empty-state">
                        <Brain size={48} className="empty-icon" />
                        <p>No quizzes available in this category.</p>
                    </div>
                ) : (
                    <div className="quiz-grid">
                        {quizzes.map((quiz, index) => (
                            <div
                                key={quiz._id}
                                className={`quiz-card ${getDifficultyClass(quiz.difficulty)} animate-fade-in`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="quiz-icon-wrapper">
                                    <Brain size={32} />
                                </div>

                                <h3 className="quiz-card-title">{quiz.title}</h3>
                                <p className="quiz-card-description">{quiz.description}</p>

                                <div className="quiz-meta">
                                    <div className="quiz-stat">
                                        <Clock size={14} />
                                        <span>{Math.floor(quiz.timeLimit / 60)}m</span>
                                    </div>
                                    <div className="quiz-stat">
                                        <Award size={14} />
                                        <span>{quiz.questions.length} Qs</span>
                                    </div>
                                    <div className="quiz-stat">
                                        <TrendingUp size={14} />
                                        <span>{quiz.difficulty}</span>
                                    </div>
                                </div>

                                <Link to={`/quiz/${quiz._id}`} className="start-quiz-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Play size={18} fill="currentColor" />
                                    Play Quiz
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
