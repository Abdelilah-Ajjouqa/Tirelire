import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { validateUserRegistration, validateUserLogin } from '../middlewares/validation.js';

export const register = async (req, res) => {
    try {
        // Validate input data
        const validation = validateUserRegistration(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors
            });
        }

        const { email, password, firstName, lastName } = validation.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const validation = validateUserLogin(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        const { email, password } = validation.data;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isKYCVerified: user.isKYCVerified,
                    facialVerificationStatus: user.facialVerificationStatus
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};