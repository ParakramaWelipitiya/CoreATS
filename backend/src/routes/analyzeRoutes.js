import express from 'express';
import { upload } from '../middlewares/upload.js';
import { analyzeMatch } from '../controllers/analyzeController.js';

const router = express.Router();

// The upload.single('cv') expects the frontend to send the file in a form field named 'cv'
router.post('/match', upload.single('cv'), analyzeMatch);

export default router;