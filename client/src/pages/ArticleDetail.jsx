import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Eye, ThumbsUp, Calendar, User, Share2, Bookmark, CheckCircle, Award } from 'lucide-react';
import Comments from '../components/Comments';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [readTracked, setReadTracked] = useState(false);
    const [readingProgress, setReadingProgress] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    useEffect(() => {
        // Track article as read after 10 seconds
        const timer = setTimeout(() => {
            if (!readTracked) {
                trackArticleRead();
            }
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [id, readTracked]);

    const fetchArticle = async () => {
        try {
            const response = await axios.get(`/api/articles/${id}`);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const trackArticleRead = async () => {
        try {
            const response = await axios.post(`/api/articles/${id}/read`);
            setReadTracked(true);
            setReadingProgress(response.data);

            // Show notification if challenge completed
            if (response.data.challengeCompleted) {
                showNotification('🎉 Daily Challenge Complete!', `You've read 3 articles today! +${response.data.pointsEarned} points`);
            } else if (response.data.articlesReadToday > 0) {
                showNotification('📚 Article Tracked', `${response.data.articlesReadToday}/3 articles read today`);
            }
        } catch (error) {
            console.error('Error tracking article read:', error);
        }
    };

    const showNotification = (title, message) => {
        // Simple notification - you can enhance this with a toast library
        if (window.Notification && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else {
            // Fallback to alert or custom notification component
            console.log(title, message);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/articles/${id}/like`);
            setArticle({ ...article, likes: response.data.likes });
            setLiked(true);
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Article not found</h2>
                <button onClick={() => navigate('/articles')} className="btn btn-primary mt-3">
                    Back to Articles
                </button>
            </div>
        );
    }

    return (
        <div className="article-detail-page">
            <div className="article-detail-header">
                <div className="container">
                    <button onClick={() => navigate('/articles')} className="back-button">
                        <ArrowLeft size={20} />
                        Back to Articles
                    </button>
                </div>
            </div>

            {/* Reading Progress Notification */}
            {readingProgress && (
                <div className="reading-progress-banner">
                    <div className="container">
                        <div className="progress-content">
                            {readingProgress.challengeCompleted ? (
                                <>
                                    <CheckCircle size={20} />
                                    <span>🎉 Daily Challenge Complete! You've read 3 articles today. +{readingProgress.pointsEarned} points</span>
                                </>
                            ) : (
                                <>
                                    <Award size={20} />
                                    <span>📚 Progress: {readingProgress.articlesReadToday}/3 articles read today | Streak: {readingProgress.streak} days 🔥</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <article className="article-detail-container">
                <div className="container">
                    <div className="article-detail-content">
                        <div className="article-detail-meta-top">
                            <span className="badge badge-primary">{article.category}</span>
                            <div className="article-detail-stats">
                                <span><Clock size={16} /> {article.readTime} min read</span>
                            </div>
                        </div>

                        <h1 className="article-detail-title">{article.title}</h1>

                        <div className="article-detail-meta">
                            <div className="author-info">
                                <User size={20} />
                                <span>{article.author}</span>
                            </div>
                            <div className="publish-date">
                                <Calendar size={16} />
                                <span>{new Date(article.publishedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>

                        <div className="article-detail-image">
                            <img src={article.imageUrl} alt={article.title} />
                        </div>

                        <div className="article-detail-body">
                            <div className="article-summary-box">
                                <h3>Summary</h3>
                                <p>{article.summary}</p>
                            </div>

                            <div className="article-content-text">
                                {article.content.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div className="article-tags">
                                    <h4>Tags:</h4>
                                    <div className="tags-list">
                                        {article.tags.map((tag, index) => (
                                            <span key={index} className="badge">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="article-actions">
                            <button
                                onClick={handleLike}
                                className={`btn ${liked ? 'btn-primary' : 'btn-outline'}`}
                                disabled={liked}
                            >
                                <ThumbsUp size={18} />
                                {liked ? 'Liked' : 'Like this article'}
                            </button>
                            <button className="btn btn-outline">
                                <Bookmark size={18} />
                                Bookmark
                            </button>
                            <button className="btn btn-outline">
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>

                        {/* Comments Section */}
                        <Comments articleId={id} />
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;
