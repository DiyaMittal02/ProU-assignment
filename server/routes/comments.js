import express from 'express';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function to safely initialize user arrays
const initializeUserArrays = (user) => {
    if (!user.dailyComments) user.dailyComments = [];
    if (!user.dailyChallenges) user.dailyChallenges = [];
    if (!user.achievements) user.achievements = [];
    if (!user.points) user.points = 0;
    if (!user.streak) user.streak = 0;
    if (!user.lastActivityDate) user.lastActivityDate = new Date();
    return user;
};

// @route   GET /api/comments/article/:articleId
// @desc    Get all comments for an article
// @access  Public
router.get('/article/:articleId', async (req, res) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId })
            .populate('user', 'name avatar')
            .populate('replies.user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Server error fetching comments' });
    }
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { articleId, content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = await Comment.create({
            user: req.user._id,
            article: articleId,
            content
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'name avatar');

        // Update user
        let user = await User.findById(req.user._id);
        if (user) {
            user = initializeUserArrays(user);

            // Update streak
            try {
                if (typeof user.updateStreak === 'function') {
                    user.updateStreak();
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const lastActivity = new Date(user.lastActivityDate);
                    lastActivity.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        user.streak = (user.streak || 0) + 1;
                    } else if (diffDays > 1) {
                        user.streak = 1;
                    }
                    user.lastActivityDate = new Date();
                }
            } catch (err) {
                console.error('Streak update error:', err);
            }

            // Track comments
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayComments = user.dailyComments.find(c => {
                if (!c || !c.date) return false;
                return new Date(c.date).toDateString() === today.toDateString();
            });

            if (todayComments) {
                todayComments.count = (todayComments.count || 0) + 1;
            } else {
                user.dailyComments.push({
                    date: today,
                    count: 1
                });
            }

            // Check challenge
            const currentComments = user.dailyComments.find(c => {
                if (!c || !c.date) return false;
                return new Date(c.date).toDateString() === today.toDateString();
            });

            const todayChallenge = user.dailyChallenges.find(c => {
                if (!c || !c.date) return false;
                return new Date(c.date).toDateString() === today.toDateString();
            });

            let challengeCompleted = false;
            let pointsEarned = 0;

            if (currentComments && currentComments.count >= 2 && (!todayChallenge || !todayChallenge.completed)) {
                user.dailyChallenges.push({
                    date: today,
                    completed: true,
                    points: 20,
                    type: 'comment'
                });
                pointsEarned = 20;
                challengeCompleted = true;

                try {
                    if (typeof user.addPoints === 'function') {
                        user.addPoints(20);
                    } else {
                        user.points = (user.points || 0) + 20;
                    }
                } catch (err) {
                    user.points = (user.points || 0) + 20;
                }

                // Check commentator achievement
                try {
                    const totalComments = await Comment.countDocuments({ user: req.user._id });
                    const hasCommentator = user.achievements.some(a => a && a.name === 'Commentator');

                    if (totalComments >= 50 && !hasCommentator) {
                        user.achievements.push({
                            name: 'Commentator',
                            description: 'Posted 50 comments',
                            icon: '💬',
                            points: 40
                        });
                        user.points = (user.points || 0) + 40;
                        pointsEarned += 40;
                    }
                } catch (err) {
                    console.error('Achievement check error:', err);
                }
            }

            await user.save();

            res.status(201).json({
                comment: populatedComment,
                gamification: {
                    challengeCompleted,
                    pointsEarned,
                    totalPoints: user.points,
                    streak: user.streak,
                    commentsToday: currentComments ? currentComments.count : 1
                }
            });
        } else {
            res.status(201).json({ comment: populatedComment });
        }
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Server error creating comment' });
    }
});

// @route   POST /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!comment.likes) comment.likes = [];

        const likeIndex = comment.likes.indexOf(req.user._id);

        if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
        } else {
            comment.likes.push(req.user._id);
        }

        await comment.save();

        res.json({ likes: comment.likes.length, liked: likeIndex === -1 });
    } catch (error) {
        console.error('Like comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/comments/:id/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Reply content is required' });
        }

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!comment.replies) comment.replies = [];

        comment.replies.push({
            user: req.user._id,
            content
        });

        await comment.save();

        const updatedComment = await Comment.findById(comment._id)
            .populate('user', 'name avatar')
            .populate('replies.user', 'name avatar');

        // Update user streak
        try {
            const user = await User.findById(req.user._id);
            if (user) {
                initializeUserArrays(user);

                if (typeof user.updateStreak === 'function') {
                    user.updateStreak();
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const lastActivity = new Date(user.lastActivityDate);
                    lastActivity.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        user.streak = (user.streak || 0) + 1;
                    } else if (diffDays > 1) {
                        user.streak = 1;
                    }
                    user.lastActivityDate = new Date();
                }

                await user.save();
            }
        } catch (err) {
            console.error('User update error:', err);
        }

        res.json(updatedComment);
    } catch (error) {
        console.error('Reply comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
