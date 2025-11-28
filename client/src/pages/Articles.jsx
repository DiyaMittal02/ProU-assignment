import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Clock, Eye, ThumbsUp, ArrowRight } from 'lucide-react';
import './Articles.css';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Constitutional Law',
        'Criminal Law',
        'Civil Rights',
        'Family Law',
        'Property Law',
        'Labor Law',
        'Consumer Rights',
        'Environmental Law'
    ];

    useEffect(() => {
        fetchArticles();
    }, [selectedCategory]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory !== 'All') {
                params.category = selectedCategory;
            }

            const response = await axios.get('/api/articles', { params });
            setArticles(response.data.articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="articles-page">
            <div className="articles-header">
                <div className="container">
                    <h1 className="page-title">Legal Articles</h1>
                    <p className="page-description">
                        Explore comprehensive articles on various legal topics to enhance your knowledge
                    </p>

                    <div className="articles-controls">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="category-filter">
                            <Filter size={20} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="empty-state">
                        <p>No articles found. Try adjusting your search or filter.</p>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {filteredArticles.map((article, index) => (
                            <article key={article._id} className="article-card card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="article-image">
                                    <img src={article.imageUrl} alt={article.title} />
                                    <span className="article-category badge badge-primary">{article.category}</span>
                                </div>
                                <div className="article-content">
                                    <h3 className="article-title">{article.title}</h3>
                                    <p className="article-summary">{article.summary}</p>

                                    <div className="article-meta">
                                        <span className="meta-item">
                                            <Clock size={16} />
                                            {article.readTime} min read
                                        </span>
                                    </div>

                                    <Link to={`/articles/${article._id}`} className="article-link">
                                        Read More
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
