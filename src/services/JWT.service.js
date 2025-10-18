import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export default class JWTService {

    constructor(secret = process.env.JWT_SECRET, expireIn = process.env.JWT_EXPIRES_IN) {
        if (!secret) {
            throw new Error('JWT secret is required');
        }
        this.secret = secret;
        this.expireIn = expireIn;
    }

    generateToken(userId, additionalPayload = {}) {
        try {
            const payload = {
                userId,
                ...additionalPayload
            };

            const token = jwt.sign(payload, this.secret, {
                expiresIn: this.expireIn
            });

            return token;
        } catch (error) {
            throw new Error(`failed to generate token ${error.message}`);
        }
    }

    verifiyToken(token) {
        try {
            const tokenVerify = jwt.decode(token, this.secret);
            return tokenVerify;
        } catch (error) {
            throw new Error(`cannot verify token, ${error.message}`);
        }
    }

    generateRefreshToken(userId, expiresIn = '7d') {
        try {
            const token = jwt.sign(
                { userId, type: 'refresh' },
                this.secret,
                { expiresIn }
            )
            return token;
        } catch (error) {
            throw new Error(`refresh token failed, ${error.message}`)
        }
    }

    extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            return null;
        }

        const token = authHeader.split(' ');
        if (token.length = 2 && token[0] === 'Bearer') {
            return token[1];
        }
        return null;
    }

    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error(`Token decode failed: ${error.message}`);
        }
    }

    isTokenExpired(token) {
        try {
            const decode = this.decodeToken(token);
            if (!decode.exp) {
                return false;
            }
        } catch (error) {
            throw true;
        }
    }

    getTokenExpiration(token) {
        try {
            const decoded = this.decodeToken(token);
            if (decoded.exp) {
                return new Date(decoded.exp * 1000);
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}