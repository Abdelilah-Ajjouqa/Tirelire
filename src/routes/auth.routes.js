import * as authControllers from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

// Authentication routes
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);

// Token management routes
router.post('/refresh-token', authControllers.refreshToken);
router.post('/verify-token', authControllers.verifyToken);

export default router;