import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Constitutional Law', 'Criminal Law', 'Civil Rights', 'Family Law', 'Property Law', 'Labor Law', 'Consumer Rights', 'Environmental Law', 'Other']
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: String,
        default: 'Legal Team'
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
    },
    readTime: {
        type: Number,
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    comments: [{
        user: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for search functionality
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Article = mongoose.model('Article', articleSchema);

export default Article;
