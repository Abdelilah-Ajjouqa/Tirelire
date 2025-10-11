import * as authControllers from "../controllers/auth.controller.js";
import {authenticateToken} from "../middlewares/auth.js";
import e from "express";

const app = e.Router();

app.post('/register', authControllers.register);

export default app;