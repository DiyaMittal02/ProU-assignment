import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, TrendingUp, Flame, Trophy, Star, AlertCircle, Play, ArrowRight, RotateCcw, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Certificate from '../components/Certificate';
import './QuizDetail.css';

const QuizDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [results, setResults] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (quizStarted && timeLeft > 0 && !quizCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
            handleSubmit();
        }
    }, [timeLeft, quizStarted, quizCompleted]);

    const fetchQuiz = async () => {
        try {
            setError(null);
            const response = await axios.get(`/api/quiz/${id}`);
            setQuiz(response.data);
            setTimeLeft(response.data.timeLimit);
            setAnswers(new Array(response.data.questions.length).fill(null));
        } catch (error) {
            console.error('Error fetching quiz:', error);
            setError('Failed to load quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
    };

    const handleAnswerSelect = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;

        // Check if all questions are answered
        if (answers.includes(null) && timeLeft > 0) {
            if (!confirm('You have unanswered questions. Submit anyway?')) {
                return;
            }
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await axios.post(`/api/quiz/${id}/submit`, { answers });
            setResults(response.data);
            setQuizCompleted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError(error.response?.data?.message || 'Error submitting quiz. Please try again.');
            alert('Error submitting quiz: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error && !quiz) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="error-message">
                    <AlertCircle size={48} color="#ef4444" />
                    <h2>Error Loading Quiz</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/quiz')} className="btn btn-primary mt-3">
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    // 1. Intro Screen
    if (!quizStarted) {
        return (
            <div className="quiz-detail-page">
                <div className="container">
                    <button onClick={() => navigate('/quiz')} className="back-button" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: '600' }}>
                        <ArrowLeft size={20} />
                        Back to Quizzes
                    </button>

                    <div className="quiz-intro-card">
                        <div className="quiz-intro-icon">
                            <Award size={48} />
                        </div>
                        <h1 className="quiz-intro-title">{quiz.title}</h1>
                        <p className="quiz-intro-description">{quiz.description}</p>

                        <div className="quiz-info-grid">
                            <div className="quiz-info-item">
                                <span className="quiz-info-label">Questions</span>
                                <span className="quiz-info-value">
                                    <Award size={20} />
                                    {quiz.questions.length}
                                </span>
                            </div>
                            <div className="quiz-info-item">
                                <span className="quiz-info-label">Time Limit</span>
                                <span className="quiz-info-value">
                                    <Clock size={20} />
                                    {Math.floor(quiz.timeLimit / 60)} mins
                                </span>
                            </div>
                            <div className="quiz-info-item">
                                <span className="quiz-info-label">Passing Score</span>
                                <span className="quiz-info-value">
                                    <TrendingUp size={20} />
                                    {quiz.passingScore}%
                                </span>
                            </div>
                        </div>

                        <button onClick={startQuiz} className="primary-btn action-btn" style={{ margin: '0 auto', fontSize: '18px', padding: '16px 48px' }}>
                            <Play size={24} fill="currentColor" />
                            Start Quiz Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Results Screen
    if (quizCompleted && results) {
        const percentage = Math.round((results.score / results.totalQuestions) * 100);
        const passed = results.passed;

        return (
            <div className="quiz-detail-page">
                <div className="results-container">
                    <div className="results-card">
                        <div className="score-circle" style={{ '--score-percent': `${percentage}%` }}>
                            <div className="score-text">
                                <span className="score-number">{percentage}%</span>
                                <span className="score-label">Score</span>
                            </div>
                        </div>

                        <h2 className="results-title">
                            {passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
                        </h2>
                        <p className="results-message">
                            {passed
                                ? `You passed the quiz! You answered ${results.score} out of ${results.totalQuestions} questions correctly.`
                                : `You didn't pass this time. You need ${quiz.passingScore}% to pass.`}
                        </p>

                        <div className="results-stats">
                            <div className="result-stat-item">
                                <span className="stat-value">{results.score}/{results.totalQuestions}</span>
                                <span className="stat-name">Correct Answers</span>
                            </div>
                            <div className="result-stat-item">
                                <span className="stat-value">{results.pointsEarned}</span>
                                <span className="stat-name">Points Earned</span>
                            </div>
                            <div className="result-stat-item">
                                <span className="stat-value">{results.streak} 🔥</span>
                                <span className="stat-name">Current Streak</span>
                            </div>
                        </div>

                        <div className="results-actions">
                            <button onClick={() => window.location.reload()} className="secondary-btn action-btn">
                                <RotateCcw size={20} />
                                Retry Quiz
                            </button>
                            <button onClick={() => navigate('/quiz')} className="secondary-btn action-btn">
                                <ArrowLeft size={20} />
                                All Quizzes
                            </button>
                            {percentage >= 70 && (
                                <button onClick={() => setShowCertificate(true)} className="primary-btn action-btn">
                                    <Download size={20} />
                                    Download Certificate
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {showCertificate && (
                    <Certificate
                        userName={user?.name || 'User'}
                        courseName={quiz.title}
                        date={new Date().toLocaleDateString()}
                        onClose={() => setShowCertificate(false)}
                    />
                )}
            </div>
        );
    }

    // 2. Active Quiz Screen
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="quiz-detail-page">
            <div className="quiz-active-container">
                <div className="quiz-header-bar">
                    <span className="quiz-progress-text">
                        Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                    <div className={`quiz-timer ${timeLeft < 60 ? 'warning' : ''}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="quiz-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="question-card">
                    <h2 className="question-text">{question.question}</h2>

                    <div className="options-grid">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-btn ${answers[currentQuestion] === index ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelect(index)}
                            >
                                <div className="option-marker">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="quiz-footer">
                        <button
                            onClick={handlePrevious}
                            className="nav-btn prev-btn"
                            disabled={currentQuestion === 0}
                            style={{ opacity: currentQuestion === 0 ? 0.5 : 1, cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            <ArrowLeft size={20} />
                            Previous
                        </button>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="nav-btn submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                                <CheckCircle size={20} />
                            </button>
                        ) : (
                            <button onClick={handleNext} className="nav-btn next-btn">
                                Next Question
                                <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizDetail;
