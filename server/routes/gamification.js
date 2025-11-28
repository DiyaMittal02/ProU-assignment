import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/gamification/leaderboard
// @desc    Get top users by points
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const { limit = 10, period = 'all' } = req.query;

        let query = {};

        // Filter by time period if needed
        if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query.lastActivityDate = { $gte: weekAgo };
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query.lastActivityDate = { $gte: monthAgo };
        }

        const leaderboard = await User.find(query)
            .select('name avatar points level streak achievements badges')
            .sort({ points: -1 })
            .limit(parseInt(limit));

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
});

// @route   GET /api/gamification/daily-challenge
// @desc    Get today's daily challenge
// @access  Private
router.get('/daily-challenge', protect, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if user already completed today's challenge
        const user = await User.findById(req.user._id);
        const todayChallenge = user.dailyChallenges.find(
            c => new Date(c.date).toDateString() === today.toDateString()
        );

        if (todayChallenge && todayChallenge.completed) {
            return res.json({
                completed: true,
                points: todayChallenge.points,
                message: 'You have already completed today\'s challenge!'
            });
        }

        // Generate daily challenge (could be randomized)
        const challenges = [
            {
                type: 'quiz',
                title: 'Complete Any Quiz',
                description: 'Take and complete any quiz with at least 70% score',
                points: 50,
                icon: '🎯'
            },
            {
                type: 'article',
                title: 'Read 3 Articles',
                description: 'Read at least 3 legal articles today',
                points: 30,
                icon: '📚'
            },
            {
                type: 'comment',
                title: 'Engage in Discussion',
                description: 'Post 2 meaningful comments on articles',
                points: 20,
                icon: '💬'
            },
            {
                type: 'streak',
                title: 'Maintain Your Streak',
                description: 'Visit the platform daily to maintain your learning streak',
                points: 25,
                icon: '🔥'
            }
        ];

        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const todaysChallengeIndex = dayOfYear % challenges.length;

        res.json({
            completed: false,
            challenge: challenges[todaysChallengeIndex],
            date: today
        });
    } catch (error) {
        console.error('Daily challenge error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/gamification/complete-challenge
// @desc    Mark daily challenge as complete
// @access  Private
router.post('/complete-challenge', protect, async (req, res) => {
    try {
        const { points } = req.body;
        const user = await User.findById(req.user._id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already completed
        const existingChallenge = user.dailyChallenges.find(
            c => new Date(c.date).toDateString() === today.toDateString()
        );

        if (existingChallenge && existingChallenge.completed) {
            return res.status(400).json({ message: 'Challenge already completed today' });
        }

        // Add challenge completion
        user.dailyChallenges.push({
            date: today,
            completed: true,
            points: points || 50
        });

        // Add points and check for level up
        const levelUpResult = user.addPoints(points || 50);

        // Update streak
        user.updateStreak();

        // Check for achievements
        const newAchievements = [];

        // First quiz achievement
        if (user.quizScores.length === 1 && !user.achievements.find(a => a.name === 'First Steps')) {
            newAchievements.push({
                name: 'First Steps',
                description: 'Completed your first quiz',
                icon: '🎓',
                points: 25
            });
        }

        // Streak achievements
        if (user.streak === 7 && !user.achievements.find(a => a.name === 'Week Warrior')) {
            newAchievements.push({
                name: 'Week Warrior',
                description: '7-day learning streak',
                icon: '🔥',
                points: 50
            });
        }

        if (user.streak === 30 && !user.achievements.find(a => a.name === 'Month Master')) {
            newAchievements.push({
                name: 'Month Master',
                description: '30-day learning streak',
                icon: '🏆',
                points: 150
            });
        }

        // Points milestone achievements
        if (user.points >= 500 && !user.achievements.find(a => a.name === 'Rising Star')) {
            newAchievements.push({
                name: 'Rising Star',
                description: 'Earned 500 points',
                icon: '⭐',
                points: 100
            });
        }

        if (user.points >= 1000 && !user.achievements.find(a => a.name === 'Legal Expert')) {
            newAchievements.push({
                name: 'Legal Expert',
                description: 'Earned 1000 points',
                icon: '👨‍⚖️',
                points: 200
            });
        }

        if (newAchievements.length > 0) {
            user.achievements.push(...newAchievements);
            user.points += newAchievements.reduce((sum, a) => sum + a.points, 0);
        }

        await user.save();

        res.json({
            success: true,
            points: user.points,
            level: user.level,
            leveledUp: levelUpResult.leveledUp,
            newLevel: levelUpResult.newLevel,
            streak: user.streak,
            newAchievements
        });
    } catch (error) {
        console.error('Complete challenge error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/gamification/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('achievements badges points level streak');

        // All possible achievements
        const allAchievements = [
            { name: 'First Steps', description: 'Completed your first quiz', icon: '🎓', points: 25 },
            { name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', points: 50 },
            { name: 'Month Master', description: '30-day learning streak', icon: '🏆', points: 150 },
            { name: 'Rising Star', description: 'Earned 500 points', icon: '⭐', points: 100 },
            { name: 'Legal Expert', description: 'Earned 1000 points', icon: '👨‍⚖️', points: 200 },
            { name: 'Quiz Master', description: 'Completed 10 quizzes', icon: '🧠', points: 75 },
            { name: 'Bookworm', description: 'Read 20 articles', icon: '📚', points: 60 },
            { name: 'Commentator', description: 'Posted 50 comments', icon: '💬', points: 40 },
            { name: 'Perfect Score', description: 'Got 100% in a quiz', icon: '💯', points: 100 }
        ];

        const unlockedAchievements = user.achievements.map(a => a.name);

        const achievementsWithStatus = allAchievements.map(achievement => ({
            ...achievement,
            unlocked: unlockedAchievements.includes(achievement.name),
            unlockedAt: user.achievements.find(a => a.name === achievement.name)?.unlockedAt
        }));

        res.json({
            achievements: achievementsWithStatus,
            totalPoints: user.points,
            level: user.level,
            streak: user.streak
        });
    } catch (error) {
        console.error('Achievements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/gamification/stats
// @desc    Get user's gamification stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('points level streak achievements badges quizScores bookmarkedArticles dailyChallenges');

        const totalQuizzes = user.quizScores.length;
        const averageScore = totalQuizzes > 0
            ? Math.round(user.quizScores.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes)
            : 0;

        const perfectScores = user.quizScores.filter(quiz => quiz.percentage === 100).length;
        const challengesCompleted = user.dailyChallenges.filter(c => c.completed).length;

        const nextLevelPoints = (user.level * 100);
        const currentLevelPoints = ((user.level - 1) * 100);
        const progressToNextLevel = ((user.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

        res.json({
            points: user.points,
            level: user.level,
            streak: user.streak,
            progressToNextLevel: Math.round(progressToNextLevel),
            nextLevelPoints,
            achievements: user.achievements.length,
            badges: user.badges.length,
            stats: {
                totalQuizzes,
                averageScore,
                perfectScores,
                bookmarkedArticles: user.bookmarkedArticles.length,
                challengesCompleted
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
