import e from 'express';
import * as kycController from '../controllers/kyc.controller.js';
import upload from '../middlewares/upload.js';

const router = e.Router();

router.post('/submit', upload.single('nationalIdImage'), kycController.submitKYC);
router.get('/status', kycController.getUserKYC);

export default router;