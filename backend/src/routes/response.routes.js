import express from 'express';
import {
  submitResponse,
  getResponses,
  getResponseById
} from '../controllers/response.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/:formId', submitResponse);
router.get('/:formId', authenticate, getResponses);
router.get('/detail/:responseId', authenticate, getResponseById);

export default router;