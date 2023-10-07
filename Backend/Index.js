import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { itemRouter } from './routes/itemRouter.js';

const app = express();

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// * Database connection
mongoose.connect(process.env.DB_CONNECTION);

mongoose.connection.on('connected', () => {
    console.log('Connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

const corsOptions = {
    origin: `http://localhost:${process.env.CORS_PORT}`,
    credentials: true,
};
app.use(cors(corsOptions))

app.use('/api', itemRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on: ' + `http://localhost:${PORT}`);
});
