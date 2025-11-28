import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    explanation: {
        type: String,
        default: ''
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Quiz description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Constitutional Law', 'Criminal Law', 'Civil Rights', 'Family Law', 'Property Law', 'Labor Law', 'Consumer Rights', 'Environmental Law', 'General']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    questions: [questionSchema],
    timeLimit: {
        type: Number,
        default: 600 // 10 minutes in seconds
    },
    passingScore: {
        type: Number,
        default: 70 // percentage
    },
    published: {
        type: Boolean,
        default: true
    },
    attempts: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
