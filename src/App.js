import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Register from './Rejister';
import Login from './Login';
import './Layout.css';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

// Default profile image
const defaultProfilePic = "https://placehold.co/45x45/cccccc/999999?text=P";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [profilePic, setProfilePic] = useState(defaultProfilePic);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token && role) {
                try {
                    const decodedToken = jwtDecode(token);
                    const isTokenExpired = decodedToken.exp < Date.now() / 1000;
                    if (!isTokenExpired) {
                        setIsLoggedIn(true);
                        setUserRole(role);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Failed to decode token:", error);
                    logout();
                }
            }
        };

        checkAuth();
    }, []);

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            <Router>
                <header className="header">
                    <div className="navbar">
                        <div className="logo">
                            <Link to="/">TX JOB HUB</Link>
                        </div>
                        <nav>
                            <ul className="nav-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/">About</Link></li>
                                <li><Link to="/">Contact Us</Link></li>
                                {isLoggedIn ? (
                                    <li className="profile-dropdown-container">
                                        <div className="profile-photo">
                                            <img src={profilePic} alt="Profile" />
                                        </div>
                                        <ul className="profile-dropdown-menu">
                                            <li><Link to="/user/dashboard">Dashboard</Link></li>
                                            <li><a href="#" onClick={logout}>Logout</a></li>
                                        </ul>
                                    </li>
                                ) : (
                                    <>
                                        <li><Link to="/login">Login</Link></li>
                                        <li><Link to="/register">Register</Link></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </header>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <p>© 2025 TX Job Hub. All rights reserved.</p>
                </footer>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;