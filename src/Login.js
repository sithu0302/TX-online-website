import React, { useState } from 'react';

// Me file eka api hadanna yana component eka. Oyage style sheets (CSS) tika mekata import karanna puluwan
import './Login.css'; 

const Login = () => {
    // State hooks use karala user ge input data save karagamu
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Error messages display karanna

    // Form eka submit kalama me function eka run wenawa
    const handleSubmit = async (e) => {
        e.preventDefault(); // Default form submit eka nawaththana

        try {
            // BACKEND API EKATA data yawana kotasa. Me URL eka oyage backend server eke URL eka anuwa wenas karanna
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // response eka hariyatama awe neththam
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            // Backend eken apita data ganna puluwan
            const data = await response.json();
            const { token, role } = data;

            // Labunu token eka saha user ge role eka browser eke save karaganna
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Labunu role eka anuwa user wa wenas dashboard ekakata redirect karanna
            if (role === 'admin') {
                window.location.href = '/admin/dashboard'; // Admin dashboard ekata
            } else if (role === 'company') {
                window.location.href = '/company/dashboard'; // Company dashboard ekata
            } else {
                window.location.href = '/user/dashboard'; // Regular user dashboard ekata
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message); // Error eka display karanna
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
            </form>
        </div>
    );
};

export default Login;