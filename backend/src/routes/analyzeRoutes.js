import express from 'express';
import { upload } from '../middlewares/upload.js';
import { analyzeMatch, auditCV, buildBlueprint } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/match', upload.single('cv'), analyzeMatch);
router.post('/audit', upload.single('cv'), auditCV);
router.post('/blueprint', upload.single('cv'), buildBlueprint); // New Route

export default router;