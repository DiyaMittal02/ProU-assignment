import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    quizScores: {
        type: [{
            quizId: mongoose.Schema.Types.ObjectId,
            score: Number,
            totalQuestions: Number,
            percentage: Number,
            completedAt: Date
        }],
        default: []
    },
    bookmarkedArticles: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.lastActivityDate) {
        // First activity ever
        this.streak = 1;
        this.lastActivityDate = new Date();
        return;
    }

    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Same day, no change
        return;
    } else if (diffDays === 1) {
        // Consecutive day, increment streak
        this.streak += 1;
    } else if (diffDays > 1) {
        // Streak broken, reset to 1
        this.streak = 1;
    }

    this.lastActivityDate = new Date();
};

const User = mongoose.model('User', userSchema);

export default User;
