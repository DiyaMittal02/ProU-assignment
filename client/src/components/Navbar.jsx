import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, BookOpen, Brain, User, Menu, X, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <Scale className="logo-icon" />
                    <span className="logo-text">Legal<span className="text-gradient">Aware</span></span>
                </Link>

                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link to="/articles" className="nav-link" onClick={closeMenu}>
                        <BookOpen size={18} />
                        Articles
                    </Link>
                    <Link to="/quiz" className="nav-link" onClick={closeMenu}>
                        <Brain size={18} />
                        Quiz
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="nav-link" onClick={closeMenu}>
                                <User size={18} />
                                {user?.name}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
