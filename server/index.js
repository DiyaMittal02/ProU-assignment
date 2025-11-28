import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import quizRoutes from './routes/quiz.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import gamificationRoutes from './routes/gamification.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/gamification', gamificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Start Server with port conflict handling
const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use!`);
            console.log(`\n💡 To fix this, run one of these commands:\n`);
            console.log(`   Windows: taskkill /F /IM node.exe`);
            console.log(`   Or change PORT in .env file\n`);
            process.exit(1);
        } else {
            console.error('❌ Server error:', err);
            process.exit(1);
        }
    });
};

startServer();

export default app;
