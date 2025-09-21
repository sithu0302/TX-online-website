import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-card">
                <h1 className="home-title animate-title">
                    Welcome to TX Job Hub
                </h1>
                <p className="home-subtitle animate-subtitle">
                    Your one-stop solution for finding the best jobs and freelancers.
                </p>
                <div className="button-container animate-buttons">
                    <Link 
                        to="/register" 
                        className="button-link register-button"
                    >
                        Register
                    </Link>
                    <Link 
                        to="/login" 
                        className="button-link login-button"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
