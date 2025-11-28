import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with quiz history
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('quizScores.quizId', 'title category')
            .populate('bookmarkedArticles', 'title category summary');

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;

            // Check if email is being changed and if it's already taken
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                user.email = email;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// @route   POST /api/users/bookmark/:articleId
// @desc    Bookmark/unbookmark an article
// @access  Private
router.post('/bookmark/:articleId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const articleId = req.params.articleId;

        const isBookmarked = user.bookmarkedArticles.includes(articleId);

        if (isBookmarked) {
            // Remove bookmark
            user.bookmarkedArticles = user.bookmarkedArticles.filter(
                id => id.toString() !== articleId
            );
        } else {
            // Add bookmark
            user.bookmarkedArticles.push(articleId);
        }

        await user.save();

        res.json({
            bookmarked: !isBookmarked,
            bookmarkedArticles: user.bookmarkedArticles
        });
    } catch (error) {
        console.error('Bookmark error:', error);
        res.status(500).json({ message: 'Server error bookmarking article' });
    }
});

// @route   GET /api/users/quiz-history
// @desc    Get user's quiz history
// @access  Private
router.get('/quiz-history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('quizScores')
            .populate('quizScores.quizId', 'title category difficulty');

        res.json(user.quizScores);
    } catch (error) {
        console.error('Get quiz history error:', error);
        res.status(500).json({ message: 'Server error fetching quiz history' });
    }
});

export default router;
