const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const port = 5000;
const jwtSecret = 'your_jwt_secret_key'; // CHANGE THIS IN A REAL APPLICATION

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MongoDB Connection ---
mongoose.connect('mongodb://localhost:27017/txOnline', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema ---
const userSchema = new mongoose.Schema({
    accountType: { type: [String], required: true },
    fullName: { type: String, required: function() { return this.accountType.includes('user') || this.accountType.includes('freelancer'); } },
    age: Number,
    qualifications: String,
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: String,
    companyName: { type: String, required: function() { return this.accountType.includes('company'); } },
    jobPath: String,
    hasExperience: { type: String, enum: ['yes', 'no'] },
    yearsOfExperience: { type: Number, required: function() { return this.hasExperience === 'yes'; } },
    cvPath: String,
    photoPath: String
});

const User = mongoose.model('User', userSchema);

// --- Multer for File Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// --- API Routes ---

// Registration Route
app.post('/api/register', upload.fields([{ name: 'cv' }, { name: 'photo' }]), async (req, res) => {
    try {
        const {
            accountType,
            fullName,
            age,
            qualifications,
            email,
            username,
            password,
            phoneNumber,
            companyName,
            jobPath,
            hasExperience,
            yearsOfExperience
        } = req.body;

        const cvFile = req.files['cv'] ? req.files['cv'][0] : null;
        const photoFile = req.files['photo'] ? req.files['photo'][0] : null;

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Parse the accountType string array from the frontend
        const parsedAccountType = JSON.parse(accountType);

        // Create a new user instance
        const newUser = new User({
            accountType: parsedAccountType,
            fullName,
            age,
            qualifications,
            email,
            username,
            password: hashedPassword,
            phoneNumber,
            companyName,
            jobPath,
            hasExperience,
            yearsOfExperience: hasExperience === 'yes' ? yearsOfExperience : undefined,
            cvPath: cvFile ? cvFile.path : undefined,
            photoPath: photoFile ? photoFile.path : undefined
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully', token });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});