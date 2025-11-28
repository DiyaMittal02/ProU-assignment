import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Comments.css';

const Comments = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/comments/article/${articleId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/comments',
                { articleId, content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComments([response.data.comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    return (
        <div className="comments-section">
            <h3 className="comments-title">Comments ({comments.length})</h3>

            {user ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        className="comment-textarea"
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="comment-submit-btn"
                        disabled={!newComment.trim()}
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    Please <Link to="/login" className="login-link">login</Link> to leave a comment.
                </div>
            )}

            <div className="comments-list">
                {loading ? (
                    <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-avatar">
                                {getInitials(comment.user?.name)}
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.user?.name || 'Anonymous'}</span>
                                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="comment-text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
