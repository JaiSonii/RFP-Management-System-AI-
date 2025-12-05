import { Router } from 'express';
import { RfpController } from '../controllers/RfpController';

const router = Router();

// RFP Routes
router.get('/rfps', RfpController.getAll);
router.post('/rfp', RfpController.create);
router.post('/rfp/send', RfpController.send);
router.get('/rfp/:rfpId/compare', RfpController.compare);

// Vendor Routes
router.get('/vendors', RfpController.getVendors); 
router.post('/vendor', RfpController.createVendor);

// Inbound Email Simulation
router.post('/webhook/email', RfpController.receiveWebhook);

export default router;