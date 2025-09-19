import React, { useState } from 'react';

// Make sure the CSS file name matches the import statement exactly, including capitalization.
import './Register.css'; 
import Camera from './Camera'; // We'll assume you have the Camera component ready to import.

const Register = () => {
    const [formData, setFormData] = useState({
        accountType: 'user', 
        fullName: '',
        age: '',
        qualifications: '',
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: '',
        cv: null, 
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(''); 

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        // Also append the captured photo
        if (capturedPhoto) {
            data.append('photo', capturedPhoto);
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                body: data, 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const result = await response.json();
            setMessage(result.message); 

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Create an Account</h2>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                {/* Account Type selection using radio buttons */}
                <div className="form-group account-type">
                    <label>Account Type:</label>
                    <input
                        type="radio"
                        name="accountType"
                        value="user"
                        checked={formData.accountType === 'user'}
                        onChange={handleChange}
                    /> <label>User</label>
                    <input
                        type="radio"
                        name="accountType"
                        value="company"
                        checked={formData.accountType === 'company'}
                        onChange={handleChange}
                    /> <label>Company</label>
                </div>

                {/* USER fields - conditional rendering */}
                {formData.accountType === 'user' && (
                    <>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Highest Qualifications</label>
                            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Upload CV</label>
                            <input type="file" name="cv" onChange={handleChange} accept=".pdf,.doc,.docx" required />
                        </div>
                        <hr />
                        {/* Webcam capture section */}
                        <div className="form-group">
                            <h4>Identity Verification</h4>
                            <Camera onCapture={setCapturedPhoto} />
                        </div>
                    </>
                )}

                {/* COMPANY fields - conditional rendering */}
                {formData.accountType === 'company' && (
                    <div className="form-group">
                        <label>Company Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>
                )}
                
                {/* Common fields for both user and company */}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;