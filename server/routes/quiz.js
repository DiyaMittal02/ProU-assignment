import express from 'express';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/quiz
// @desc    Get all quizzes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { published: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        const quizzes = await Quiz.find(query)
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ message: 'Server error fetching quizzes' });
    }
});

// @route   GET /api/quiz/:id
// @desc    Get single quiz (without answers)
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('-questions.correctAnswer -questions.explanation');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ message: 'Server error fetching quiz' });
    }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const { answers } = req.body;

        console.log('=== QUIZ SUBMISSION ===');
        console.log('User ID:', req.user._id);

        // Find quiz
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let correctCount = 0;
        const results = quiz.questions.map((question, index) => {
            const userAnswer = answers[index] !== undefined ? answers[index] : null;
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) correctCount++;

            return {
                questionIndex: index,
                userAnswer: userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation
            };
        });

        const percentage = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = percentage >= (quiz.passingScore || 70);

        console.log('Score:', percentage, '% - Passed:', passed);

        // Get user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Before streak update - Streak:', user.streak, 'Last Activity:', user.lastActivityDate);

        // Update streak - IMPROVED LOGIC
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!user.lastActivityDate) {
            // First activity ever
            user.streak = 1;
            user.lastActivityDate = new Date();
            console.log('First activity - Setting streak to 1');
        } else {
            const lastActivity = new Date(user.lastActivityDate);
            lastActivity.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
            console.log('Days since last activity:', diffDays);

            if (diffDays === 0) {
                // Same day - if streak is 0, set to 1
                if (user.streak === 0) {
                    user.streak = 1;
                    console.log('Same day but streak was 0 - Setting to 1');
                } else {
                    console.log('Same day - Streak stays:', user.streak);
                }
            } else if (diffDays === 1) {
                // Consecutive day, increment streak
                user.streak = (user.streak || 0) + 1;
                user.lastActivityDate = new Date();
                console.log('Consecutive day - Streak increased to:', user.streak);
            } else if (diffDays > 1) {
                // Streak broken, reset to 1
                user.streak = 1;
                user.lastActivityDate = new Date();
                console.log('Streak broken - Reset to 1');
            }
        }

        console.log('After streak update - Streak:', user.streak);

        // Save quiz score
        const quizScore = {
            quizId: quiz._id,
            score: correctCount,
            totalQuestions: quiz.questions.length,
            percentage: percentage,
            completedAt: new Date()
        };

        if (!Array.isArray(user.quizScores)) {
            user.quizScores = [];
        }

        user.quizScores.push(quizScore);

        // Calculate points
        let pointsEarned = 0;
        if (passed) {
            pointsEarned = 50;
            if (percentage === 100) {
                pointsEarned = 100;
            }
        }

        // Add points
        user.points = (user.points || 0) + pointsEarned;

        // Calculate level
        user.level = Math.floor(user.points / 100) + 1;

        console.log('Points:', user.points, 'Level:', user.level, 'Streak:', user.streak);

        // Save user
        await user.save();
        console.log('User saved successfully!');

        // Update quiz attempts
        quiz.attempts = (quiz.attempts || 0) + 1;
        await quiz.save();

        console.log('=== QUIZ SUBMISSION COMPLETE ===');

        // Send response
        res.json({
            score: percentage,
            correctCount,
            totalQuestions: quiz.questions.length,
            passed,
            passingScore: quiz.passingScore || 70,
            results,
            gamification: {
                pointsEarned,
                totalPoints: user.points,
                level: user.level,
                leveledUp: false,
                newLevel: user.level,
                streak: user.streak,
                newAchievements: [],
                challengeCompleted: false
            }
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({
            message: 'Error submitting quiz',
            error: error.message
        });
    }
});

// @route   POST /api/quiz
// @desc    Create a new quiz
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ message: 'Server error creating quiz' });
    }
});

// @route   PUT /api/quiz/:id
// @desc    Update a quiz
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Update quiz error:', error);
        res.status(500).json({ message: 'Server error updating quiz' });
    }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete a quiz
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ message: 'Server error deleting quiz' });
    }
});

export default router;
