import express from "express";
import MongodbConnection from "./config/MongodbConnection.js";
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const db = new MongodbConnection();
db.connect();

app.use(express.json());
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Tirelire API is running...');
});

process.once("SIGINT", db.disconnect) // Crtl+c on terminal will disconnect from mongodb too

export default app;