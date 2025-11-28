import { Link } from 'react-router-dom';
import { Scale, Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <Scale className="footer-logo-icon" />
                            <span className="footer-logo-text">LegalAware</span>
                        </div>
                        <p className="footer-description">
                            Empowering citizens with legal knowledge and awareness.
                            Know your rights, understand the law.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/articles">Articles</Link></li>
                            <li><Link to="/quiz">Quiz</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Legal Categories</h3>
                        <ul className="footer-links">
                            <li><Link to="/articles?category=Constitutional Law">Constitutional Law</Link></li>
                            <li><Link to="/articles?category=Criminal Law">Criminal Law</Link></li>
                            <li><Link to="/articles?category=Civil Rights">Civil Rights</Link></li>
                            <li><Link to="/articles?category=Consumer Rights">Consumer Rights</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Contact</h3>
                        <ul className="footer-links">
                            <li>
                                <Mail size={16} />
                                <a href="mailto:info@legalaware.com">info@legalaware.com</a>
                            </li>
                            <li>Available 24/7 for legal awareness</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} LegalAware. Made with <Heart size={16} className="heart-icon" /> for legal empowerment.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Disclaimer</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
