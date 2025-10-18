import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import JWTService from '../services/JWT.service.js';
import { validateUserRegistration, validateUserLogin } from '../validation/validation.js';

// Create JWT service instance
const jwtService = new JWTService();

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

        const token = jwtService.generateToken(user._id.toString(), {
            email: user.email,
            role: user.role
        });

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

        const token = jwtService.generateToken(user._id.toString(), {
            email: user.email,
            role: user.role
        });

        // generate refresh token
        const refreshToken = jwtService.generateRefreshToken(user._id.toString());

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
                token,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        // Verify refresh token
        const decoded = jwtService.verifyToken(refreshToken);

        // Check if it's a refresh token
        if (decoded.type !== 'refresh') {
            return res.status(400).json({
                message: "Invalid token type"
            });
        }

        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Generate new tokens
        const newToken = jwtService.generateToken(user._id.toString(), {
            email: user.email,
            role: user.role
        });
        const newRefreshToken = jwtService.generateRefreshToken(user._id.toString());

        res.status(200).json({
            message: "Token refreshed successfully",
            data: {
                token: newToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            message: "Invalid or expired refresh token",
            error: error.message
        });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = jwtService.extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        const decoded = jwtService.verifyToken(token);
        const expirationDate = jwtService.getTokenExpiration(token);

        res.status(200).json({
            message: "Token is valid",
            data: {
                userId: decoded.userId,
                expiresAt: expirationDate
            }
        });

    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
            error: error.message
        });
    }
};