import express from 'express';
import Article from '../models/Article.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to safely initialize user arrays
const initializeUserArrays = (user) => {
    if (!user.dailyReading) user.dailyReading = [];
    if (!user.dailyChallenges) user.dailyChallenges = [];
    if (!user.points) user.points = 0;
    if (!user.streak) user.streak = 0;
    if (!user.lastActivityDate) user.lastActivityDate = new Date();
    return user;
};

// @route   GET /api/articles
// @desc    Get all articles with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        let query = { published: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const articles = await Article.find(query)
            .sort({ publishedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Article.countDocuments(query);

        res.json({
            articles,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ message: 'Server error fetching articles' });
    }
});

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.views = (article.views || 0) + 1;
        await article.save();

        res.json(article);
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ message: 'Server error fetching article' });
    }
});

// @route   POST /api/articles/:id/read
// @desc    Mark article as read (for daily challenge tracking)
// @access  Private
router.post('/:id/read', protect, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize arrays
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

        // Track reading
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayReading = user.dailyReading.find(r => {
            if (!r || !r.date) return false;
            return new Date(r.date).toDateString() === today.toDateString();
        });

        if (todayReading) {
            if (!todayReading.articles) todayReading.articles = [];
            if (!todayReading.articles.includes(req.params.id)) {
                todayReading.articles.push(req.params.id);
                todayReading.count = todayReading.articles.length;
            }
        } else {
            user.dailyReading.push({
                date: today,
                articles: [req.params.id],
                count: 1
            });
        }

        // Check challenge completion
        const currentReading = user.dailyReading.find(r => {
            if (!r || !r.date) return false;
            return new Date(r.date).toDateString() === today.toDateString();
        });

        const todayChallenge = user.dailyChallenges.find(c => {
            if (!c || !c.date) return false;
            return new Date(c.date).toDateString() === today.toDateString();
        });

        let challengeCompleted = false;
        let pointsEarned = 0;

        if (currentReading && currentReading.count >= 3 && (!todayChallenge || !todayChallenge.completed)) {
            user.dailyChallenges.push({
                date: today,
                completed: true,
                points: 30,
                type: 'article'
            });
            pointsEarned = 30;
            challengeCompleted = true;

            // Add points
            try {
                if (typeof user.addPoints === 'function') {
                    user.addPoints(30);
                } else {
                    user.points = (user.points || 0) + 30;
                }
            } catch (err) {
                user.points = (user.points || 0) + 30;
            }
        }

        await user.save();

        res.json({
            articlesReadToday: currentReading ? currentReading.count : 0,
            challengeCompleted,
            pointsEarned,
            totalPoints: user.points,
            streak: user.streak
        });
    } catch (error) {
        console.error('Mark article read error:', error);
        res.status(500).json({ message: 'Server error tracking article' });
    }
});

// @route   POST /api/articles
// @desc    Create a new article
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ message: 'Server error creating article' });
    }
});

// @route   PUT /api/articles/:id
// @desc    Update an article
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ message: 'Server error updating article' });
    }
});

// @route   DELETE /api/articles/:id
// @desc    Delete an article
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ message: 'Server error deleting article' });
    }
});

// @route   POST /api/articles/:id/like
// @desc    Like an article
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.likes = (article.likes || 0) + 1;
        await article.save();

        res.json({ likes: article.likes });
    } catch (error) {
        console.error('Like article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
