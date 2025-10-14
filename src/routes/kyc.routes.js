import e from 'express';
import * as kycController from '../controllers/kyc.controller.js';
import * as kycMiddleware from "../middlewares/auth.js";
import upload from '../middlewares/upload.js';
import { getKYCStatus } from '../services/kyc.service.js';

const router = e.Router();

router.post('/submit', kycMiddleware.authenticate, upload.single('nationalIdImage'), kycController.submitKYC);
router.get('/status', kycMiddleware.authenticate, getKYCStatus);

export default router;