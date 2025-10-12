import * as authControllers from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);

export default router;