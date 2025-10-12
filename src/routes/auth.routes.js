import * as authControllers from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import express from "express";

const router = express.Router();

// Public routes
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);

// Protected routes
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        message: "Profile retrieved successfully",
        data: { user: req.user }
    });
});


export default router;