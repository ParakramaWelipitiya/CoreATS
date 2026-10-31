import pdfParse from 'pdf-parse';
import { calculateATSScore, performGeneralAudit } from '../services/aiService.js';

export const analyzeMatch = async (req, res) => {
    try {
        if (!req.file || !req.body.jobDescription) {
            return res.status(400).json({ error: 'Please provide both a CV and a job description.' });
        }

        // 1. Extract text from PDF buffer
        const pdfData = await pdfParse(req.file.buffer);
        const cvText = pdfData.text;

        // 2. Send to AI Service
        const aiAnalysis = await calculateATSScore(cvText, req.body.jobDescription);

        // 3. Return the AI results to the React frontend
        res.status(200).json({
            status: 'success',
            data: aiAnalysis
        });

    } catch (error) {
        console.error('Error analyzing CV:', error);
        res.status(500).json({ error: 'Failed to process the CV file.' });
    }
};

export const auditCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a CV file.' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const cvText = pdfData.text;

        const aiAudit = await performGeneralAudit(cvText);

        res.status(200).json({
            status: 'success',
            data: aiAudit
        });
    } catch (error) {
        console.error('Error auditing CV:', error);
        res.status(500).json({ error: 'Failed to process the CV file.' });
    }
};