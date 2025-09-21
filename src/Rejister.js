import React, { useState } from 'react';

// CSS file නම, import statement එකට ගැලපෙන බවට වග බලා ගන්න.
import './Register.css'; 
import Camera from './Camera'; // Camera component එක තවම තිබෙන බවට උපකල්පනය කරමු.

const Register = () => {
    const [formData, setFormData] = useState({
        // accountType එක array එකක් ලෙස වෙනස් කරමු
        accountType: [], 
        fullName: '',
        age: '',
        qualifications: '', // දැන් dropdown එකක්
        email: '', // අලුත් email field එක
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: '',
        cv: null,
        jobPath: '', // අලුත් field එක
        hasExperience: 'no', // Default value එක 'no'
        yearsOfExperience: '', // අලුත් field එක
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Checkbox එකක් select කරන විට, ඒ value එක array එකට එකතු කරමු
            setFormData(prevData => ({
                ...prevData,
                accountType: checked
                    ? [...prevData.accountType, value] // Check කළ විට array එකට එකතු කරන්න
                    : prevData.accountType.filter(type => type !== value) // Uncheck කළ විට array එකෙන් ඉවත් කරන්න
            }));
        } else if (type === 'file') {
            setFormData(prevData => ({
                ...prevData,
                [name]: e.target.files[0]
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Password matching validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Email validation: '@' අක්ෂරය තිබේදැයි පරීක්ෂා කරන්න
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address with an "@" symbol.');
            return;
        }

        setError(''); 

        const data = new FormData();
        // Form data object එකට අලුත් fields සියල්ලම append කරමු
        for (const key in formData) {
            // Arrays backend එකට යැවීමට පෙර stringify කළ යුතුයි
            if (Array.isArray(formData[key])) {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        }
        
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

    // User ගේ account type එක select කර තිබේදැයි පරීක්ෂා කිරීමට helper function එකක්
    const isUserTypeSelected = formData.accountType.includes('user') || formData.accountType.includes('freelancer');
    const isCompanyTypeSelected = formData.accountType.includes('company');

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Create an Account</h2>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                {/* Checkboxes භාවිතයෙන් Account Type තේරීම */}
                <div className="form-group account-type">
                    <label>Account Type:</label>
                    <div>
                        <input
                            type="checkbox"
                            name="accountType"
                            value="user"
                            checked={formData.accountType.includes('user')}
                            onChange={handleChange}
                        /> <label>Job Seeker</label>
                        <input
                            type="checkbox"
                            name="accountType"
                            value="freelancer"
                            checked={formData.accountType.includes('freelancer')}
                            onChange={handleChange}
                        /> <label>Freelancer</label>
                        <input
                            type="checkbox"
                            name="accountType"
                            value="company"
                            checked={formData.accountType.includes('company')}
                            onChange={handleChange}
                        /> <label>Company</label>
                    </div>
                </div>

                {/* USER fields - conditional rendering */}
                {isUserTypeSelected && (
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
                            <label>Job Path</label>
                            <input type="text" name="jobPath" value={formData.jobPath} onChange={handleChange} placeholder="e.g., IT, Management" required />
                        </div>
                        <div className="form-group">
                            <label>Highest Qualifications</label>
                            <select name="qualifications" value={formData.qualifications} onChange={handleChange} required>
                                <option value="">Select Qualification</option>
                                <option value="O/L">O/L</option>
                                <option value="A/L">A/L</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Degree">Degree</option>
                                <option value="Master">Master</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Experience</label>
                            <div className="flex items-center space-x-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="hasExperience"
                                        value="yes"
                                        checked={formData.hasExperience === 'yes'}
                                        onChange={handleChange}
                                    /> Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="hasExperience"
                                        value="no"
                                        checked={formData.hasExperience === 'no'}
                                        onChange={handleChange}
                                    /> No
                                </label>
                            </div>
                        </div>
                        {formData.hasExperience === 'yes' && (
                            <div className="form-group">
                                <label>Years of Experience</label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                        )}
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
                {isCompanyTypeSelected && (
                    <div className="form-group">
                        <label>Company Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>
                )}
                
                {/* Common fields for all user types */}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                {/* New Email field added here */}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
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
