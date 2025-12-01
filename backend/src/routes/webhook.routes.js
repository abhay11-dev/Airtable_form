import express from 'express';
import { handleAirtableWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

router.post('/airtable', handleAirtableWebhook);

export default router;