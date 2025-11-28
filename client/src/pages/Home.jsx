import { Link } from 'react-router-dom';
import { BookOpen, Brain, Shield, Award, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';
import DailyLegalFact from '../components/DailyLegalFact';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: <BookOpen />,
            title: 'Daily Legal Articles',
            description: 'Access comprehensive articles on various legal topics, updated daily to keep you informed.'
        },
        {
            icon: <Brain />,
            title: 'Interactive Quizzes',
            description: 'Test your legal knowledge with engaging quizzes and track your progress over time.'
        },
        {
            icon: <Shield />,
            title: 'Know Your Rights',
            description: 'Learn about your fundamental rights and how to protect them in different situations.'
        },
        {
            icon: <Award />,
            title: 'Earn Certificates',
            description: 'Complete quizzes and earn certificates to showcase your legal awareness.'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container hero-content">
                    <div className="hero-text animate-fade-in">
                        <div className="hero-badge">
                            <Sparkles size={16} />
                            <span>Empowering Legal Awareness</span>
                        </div>
                        <h1 className="hero-title">
                            Know Your <span className="text-gradient">Legal Rights</span>
                        </h1>
                        <p className="hero-description">
                            Your daily dose of legal knowledge. Learn about laws, rights, and responsibilities
                            through engaging articles and interactive quizzes. Empower yourself with legal awareness.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/articles" className="btn btn-primary btn-lg">
                                Explore Articles
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/quiz" className="btn btn-secondary btn-lg">
                                Take a Quiz
                                <Brain size={20} />
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image animate-slide-in">
                        <div className="hero-card card-glass">
                            <div className="hero-card-icon">
                                <Scale size={48} />
                            </div>
                            <h3>Legal Awareness Portal</h3>
                            <p>Join thousands learning about their rights</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Legal Fact Section */}
            <section className="daily-fact-section">
                <div className="container">
                    <DailyLegalFact />
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose LegalAware?</h2>
                        <p className="section-description">
                            Everything you need to understand and exercise your legal rights
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card card-glass">
                        <h2 className="cta-title">Ready to Start Your Legal Journey?</h2>
                        <p className="cta-description">
                            Join our community and gain the legal knowledge you need to protect your rights
                        </p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Scale component for hero card
const Scale = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
);

export default Home;
