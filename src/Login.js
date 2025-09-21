import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            const { token, role } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on the user's role
            if (role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (role === 'company') {
                window.location.href = '/company/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="login-button">Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>
            
            {/* Admin Login Section - You might want to make this a separate page */}
            <div className="admin-login-link">
                <p>Admin Login? <Link to="/admin/login">Click here</Link></p>
            </div>
        </div>
    );
};

export default Login;