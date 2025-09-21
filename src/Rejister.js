import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Register.css';

const Register = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [accountTypes, setAccountTypes] = useState([]);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [cv, setCv] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [bizRegNo, setBizRegNo] = useState('');
    const [error, setError] = useState('');
    const [selfie, setSelfie] = useState(null);
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing the camera:", err);
            setError("Could not access camera. Please check your permissions.");
        }
    };

    const takePhoto = () => {
        const width = 300;
        const height = width / (16 / 9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        const data = photo.toDataURL('image/png');
        setSelfie(data);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setAccountTypes([...accountTypes, value]);
        } else {
            setAccountTypes(accountTypes.filter(type => type !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Selfie verification is only required for 'freelancer'
        if (accountTypes.includes('freelancer') && !selfie) {
            setError("Please take a selfie for verification.");
            return;
        }

        const formData = {
            username,
            password,
            email,
            accountTypes,
            selfie: accountTypes.includes('freelancer') ? selfie : null,
        };

        // Append additional fields based on account type
        if (accountTypes.includes('freelancer') || accountTypes.includes('job_seeker')) {
            formData.fullName = fullName;
            formData.phone = phone;
            formData.address = address;
            formData.qualifications = qualifications;
            if (cv) {
                formData.cv = cv.name; // In a real app, you would upload the file
            }
        }
        if (accountTypes.includes('company')) {
            formData.companyName = companyName;
            formData.bizRegNo = bizRegNo;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            const { token, role } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            login();

            if (role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (role === 'company') {
                window.location.href = '/company/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        }
    };

    const renderAccountTypeFields = () => {
        return (
            <>
                {(accountTypes.includes('freelancer') || accountTypes.includes('job_seeker')) && (
                    <>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="2"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="qualifications">Qualifications</label>
                            <textarea
                                id="qualifications"
                                value={qualifications}
                                onChange={(e) => setQualifications(e.target.value)}
                                rows="4"
                                placeholder="Enter your qualifications, skills, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cv">Upload CV/Resume</label>
                            <input
                                type="file"
                                id="cv"
                                onChange={(e) => setCv(e.target.files[0])}
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                    </>
                )}
                {accountTypes.includes('company') && (
                    <>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bizRegNo">Business Registration Number</label>
                            <input
                                type="text"
                                id="bizRegNo"
                                value={bizRegNo}
                                onChange={(e) => setBizRegNo(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
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
                
                <div className="form-group">
                    <label>Account Type</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="accountType"
                                value="job_seeker"
                                onChange={handleCheckboxChange}
                            />
                            Job Seeker
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="accountType"
                                value="freelancer"
                                onChange={handleCheckboxChange}
                            />
                            Freelancer
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="accountType"
                                value="company"
                                onChange={handleCheckboxChange}
                            />
                            Company
                        </label>
                    </div>
                </div>

                {renderAccountTypeFields()}

                {accountTypes.includes('freelancer') && (
                    <div className="selfie-verification-section">
                        <h3>Selfie Verification</h3>
                        <div className="camera-container">
                            <video ref={videoRef} onCanPlay={() => videoRef.current.play()} className="camera-preview"></video>
                            <canvas ref={photoRef} style={{ display: 'none' }}></canvas>
                        </div>
                        
                        <button type="button" onClick={startCamera}>Start Camera</button>
                        <button type="button" onClick={takePhoto} disabled={!videoRef.current}>Take Photo</button>
                        
                        {selfie && (
                            <div className="selfie-preview">
                                <h4>Selfie Preview</h4>
                                <img src={selfie} alt="Selfie" />
                            </div>
                        )}
                    </div>
                )}

                <button type="submit" className="register-button">Register</button>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};

export default Register;