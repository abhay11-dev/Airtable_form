import express from 'express';
import { getAuthUrl, handleCallback, getCurrentUser, loginWithPAT } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/auth-url', getAuthUrl);
router.get('/callback', handleCallback);
router.post('/login-pat', loginWithPAT);
router.get('/me', authenticate, getCurrentUser);

export default router;