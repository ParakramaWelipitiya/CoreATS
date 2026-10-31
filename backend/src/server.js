import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyzeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'CoreATS API is running cleanly.' });
});

// Register the new analysis routes
app.use('/api/analyze', analyzeRoutes);

app.listen(PORT, () => {
    console.log(`[SERVER] CoreATS Backend is live on port ${PORT}`);
});