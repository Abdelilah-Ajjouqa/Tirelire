import express from "express";
import MongodbConnection from "./config/MongodbConnection.js";

const app = express();
const db = new MongodbConnection();
// db.connect();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Tirelire API is running...');
});

process.once("SIGINT", db.disconnect) // Crtl+c on terminal will disconnect from mongodb too

export default app;