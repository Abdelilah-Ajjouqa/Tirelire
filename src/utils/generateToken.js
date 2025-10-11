import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    )
};