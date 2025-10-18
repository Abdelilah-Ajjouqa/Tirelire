import User from "../models/User.js";
import JWTService from "../services/JWTService.js";


const jwtService = new JWTService();

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = jwtService.extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. No token provided"
            });
        }

        // Verify the token
        const decoded = jwtService.verifyToken(token);
        
        // Find user by ID from token
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Attach user and decoded token to request
        req.user = user;
        req.tokenPayload = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Token is not valid',
            error: error.message
        });
    }
}

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({
            message: "Access denied. Admin role required."
        });
    }
    next();
};

export { jwtService };