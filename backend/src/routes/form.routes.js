import express from 'express';
import {
  getBases,
  getTables,
  getFields,
  createForm,
  getForms,
  getFormById,
  deleteForm
} from '../controllers/form.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/bases', getBases);
router.get('/bases/:baseId/tables', getTables);
router.get('/bases/:baseId/tables/:tableId/fields', getFields);

router.post('/', createForm);
router.get('/', getForms);
router.get('/:formId', getFormById);
router.delete('/:formId', deleteForm);

export default router;